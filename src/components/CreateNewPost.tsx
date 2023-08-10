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
                        title: 'Hub already exists.',
                        description: 'Please choose a different Hub name',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Invalid Hub name',
                        description: 'Please choose a Hub name between 3 and 21 Alphanumeric characters only (special characters not allowed)',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'An Error Occured :(',
                description: 'Could not create Hub, please try again in some time',
                variant: 'destructive'
            })

        },
        onSuccess: (data) => {
            router.push(`/hub/${data}`)
        }

    })

    return (
        <>
            <div>
                <p className="text-lg font-medium">Name</p>
                <p className="text-xs pb-2">
                    <Balancer>
                        HiveHub names including capitalization cannot be changed.
                    </Balancer>
                </p>

                <div className="relative">
                    <p className="absolute text-sm left-1 w-8 inset-y-0 grid place-items-center ">
                        hub/
                    </p>
                    <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-9" />
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
