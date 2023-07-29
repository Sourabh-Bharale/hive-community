'use client'

import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { CreateSubredditPayload } from "@/lib/validators/subreddit"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/input"
import { Balancer } from "react-wrap-balancer"

export default function CreateNewCommunity() {
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const { loginToast } = useCustomToast()

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: CreateSubredditPayload = {
                name: input
            }
            const { data } = await axios.post('/api/subreddit', payload)
            return data as string
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    return toast({
                        title: 'Subreddit already exists.',
                        description: 'Please choose a different subreddit name',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Invalid Subreddit name',
                        description: 'Please choose a Subreddit name between 3 and 21 characters',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'An Error Occured :(',
                description: 'Could not create subreddit, please try again in some time',
                variant: 'destructive'
            })

        },
        onSuccess: (data) => {
            router.push(`/r/${data}`)
        }

    })

    return (
        <>
            <div>
                <p className="text-lg font-medium">Name</p>
                <p className="text-xs pb-2">
                    <Balancer>
                        Community names including capitalization cannot be changed.
                    </Balancer>
                </p>

                <div className="relative">
                    <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center ">
                        r/
                    </p>
                    <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6" />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    variant={"link"}
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    isLoading={isLoading}
                    disabled={input.length === 0}
                    onClick={() => createCommunity()}
                >
                    Create
                </Button>
            </div>
        </>
    )
}
