'use client'
import TextareaAutoSize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef, useState } from 'react'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from './ui/Button'
import { useCustomToast } from '@/hooks/use-custom-toast'

interface EditorProps {
    subredditId: string,
}
export default function Editor({ subredditId }: EditorProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subredditId,
            title: '',
            content: null
        }
    })

    const ref = useRef<EditorJS>()
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const _titleRef = useRef<HTMLTextAreaElement>(null)

    const pathname = usePathname()
    const router = useRouter()
    const {loginToast} = useCustomToast()


    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        const List = (await import('@editorjs/list')).default
        const Code = (await import('@editorjs/code')).default
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default

        // initialize editor only if not initialized
        if (!ref.current) {
            // invoke
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    // initialize
                    ref.current = editor
                },
                placeholder: 'Type here to write your post...',
                inlineToolbar: true,
                data: {
                    blocks: []
                },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link',
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const [res] = await uploadFiles([file], 'imageUploader')

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        },
                                    }
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            })
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true)
        }
    }, [])
    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                toast({
                    title: 'Something went wrong',
                    description: (value as { message: string }).message,
                    variant: 'destructive',
                })
            }
        }
    }, [errors])

    useEffect(() => {
        const init = async () => {
            await initializeEditor()
            setTimeout(() => {
                _titleRef.current?.focus()
            }, 0)
        }

        if (isMounted) {
            init()

            // destroy initialized EditorJs
            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }

    }, [isMounted, initializeEditor])

    const { mutate: createPost, isLoading: isCreating } = useMutation({
        mutationFn: async ({ title, content, subredditId }: PostCreationRequest) => {

            const payload: PostCreationRequest = {
                title,
                content,
                subredditId
            }
            const { data } = await axios.post('/api/subreddit/post/create', payload)
            return data
        },
        onError: (error) => {
            if (error instanceof AxiosError) {

                if (error.response?.status === 401) {
                    return loginToast()
                }

                if (error.response?.status === 400) {
                    return toast({
                        title: 'Subscribe to this Community',
                        description: 'You need to be subscribed to this community, for posting',
                        variant: 'destructive',
                    })
                }
            }
            return toast({
                title: 'Something went wrong',
                description: 'Could not create post at this moment, please try again later',
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            const newPathname = pathname.split('/').slice(0, -1).join('/')
            router.push(newPathname)
            router.refresh()

            return toast({
                title: 'Post created',
                description: 'Your post has been successfully created :)'
            })
        }
    })

    async function onSubmit(data: PostCreationRequest) {
        const blocks = await ref.current?.save()

        const payload: PostCreationRequest = {
            title: data.title,
            content: blocks,
            subredditId
        }
        createPost(payload)
    }

    if (!isMounted) return null

    const { ref: titleRef, ...rest } = register('title')

    return (
        <>
            <div className="w-full p-4 rounded-lg border">
                <form
                    id="subreddit-post-form"
                    className="w-full"
                    onSubmit={handleSubmit(onSubmit)}>
                    <div className="prose prose-stone dark:prose-invert">
                        <TextareaAutoSize
                            ref={(e) => {
                                titleRef(e)
                                // @ts-ignore
                                _titleRef.current = e
                            }}
                            {...rest}
                            placeholder='Title'
                            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-semibold focus:outline-none' />

                        <div id='editor' className='w-full min-h-[500px]' />
                    </div>
                </form>
                <div className="w-full flex justify-end">

                </div>
            </div>
            <Button isLoading={isCreating} type="submit" className="w-full" form="subreddit-post-form">
                Post
            </Button>
        </>
    )
}
