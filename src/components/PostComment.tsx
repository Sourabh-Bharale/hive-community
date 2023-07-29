'use client'

import { useRef, useState } from "react"
import UserAvatar from "./UserAvatar"
import { cn, formatTimeToNow } from "@/lib/utils"
import { Comment, CommentVote, User } from "@prisma/client"
import CommentVotes from "./CommentVotes"
import { Button } from "./ui/Button"
import { MessageSquareIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { notFound, useRouter } from "next/navigation"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { useMutation } from "@tanstack/react-query"
import { CommentRequest } from "@/lib/validators/comment"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/use-custom-toast"

type ExtendedComment = Comment & {
    votes: CommentVote[],
    author: User
}

interface PostCommentProp {
    comment: ExtendedComment
    postId: string
    votesAmount: number
    currentVote?: CommentVote | undefined
}
export default function PostComment(
    { comment,
        postId,
        votesAmount,
        currentVote
    }: PostCommentProp) {

    const { data: session } = useSession()
    const router = useRouter()
    const commentRef = useRef<HTMLDivElement>(null)
    const [input, setInput] = useState<string>('')
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const {loginToast} = useCustomToast()

    const { mutate: postComment, isLoading: isCommentPosting } = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId
            }
            const { data } = await axios.patch('/api/subreddit/post/comment', payload)
            return data
        },
        onError: (error) => {
            if (error instanceof AxiosError) {

                if (error.response?.status === 401) {
                    return loginToast()
                }

                if (error.response?.status === 404) {
                    return notFound()
                }
            }
            return toast({
                title: 'Something went wrong',
                description: 'Could not post your comment at this moment, please try again later',
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            router.refresh()
            setInput('')
            setIsReplying(false)
        }
    })

    return (
        <div ref={commentRef} className="flex flex-col">
            <div className="flex items-center">
                <UserAvatar
                    className={cn('h-6 w-6')}
                    user={{
                        name: comment.author.name || null,
                        image: comment.author.image || null
                    }} />

                <div className="ml-2 flex items-center gap-x-2">
                    <p className="text-sm font-medium">u/{comment.author.name}</p>
                    <p className="truncate text-xs">
                        {formatTimeToNow(new Date(comment.createdAt))}
                    </p>
                </div>
            </div>

            <p className="text-sm mt-2">{comment.text}</p>
            <div className="flex flex-wrap gap-2 items-center">
                <CommentVotes commentId={comment.id}
                    initialVotesAmount={votesAmount}
                    initialVote={currentVote}
                />

                <Button onClick={() => {
                    if (!session) router.push('/sign-in')
                    setIsReplying(true)

                }} size='xs' variant={'link'} className="flex gap-1">
                    <MessageSquareIcon className="h-4 w-4" />
                    Reply
                </Button>
                {
                    isReplying ? (

                        <div className="block w-full gap-1.5">
                            <Label htmlFor="comment" >Your Commet</Label>
                            <div className="mt-2">
                                <Textarea id="comment"
                                    value={input} onChange={(e) => setInput(e.target.value)}
                                    placeholder="what's on your mind...?" />

                                <div className="mt-2 flex items-center gap-2 justify-end">
                                    <Button
                                        tabIndex={-1}
                                        variant={'link'}
                                        onClick={() => setIsReplying(false)}>
                                        cancel
                                    </Button>
                                    <Button onClick={() => postComment(
                                        {
                                            postId,
                                            text: input,
                                            replyToId: comment.replyToId ?? comment.id
                                        })}
                                        isLoading={isCommentPosting}
                                        disabled={input.length === 0}>
                                        Post
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}
