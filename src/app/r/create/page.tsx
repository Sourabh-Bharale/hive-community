'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Balancer } from "react-wrap-balancer"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from 'axios'
import { CreateSubredditPayload } from "@/lib/validators/subreddit"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/use-custom-toast"

export default function Page() {
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const {loginToast} = useCustomToast()

    const {mutate:createCommunity , isLoading } = useMutation({
        mutationFn:async()=>{
            const payload : CreateSubredditPayload = {
                name:input
            }
            const {data} = await axios.post('/api/subreddit',payload)
            return data as string
        },
        onError: (error)=>{
            if(error instanceof AxiosError){
                if(error.response?.status ===409){
                    return toast({
                        title: 'Subreddit already exists.',
                        description:'Please choose a different subreddit name',
                        variant:'destructive'
                    })
                }

                if(error.response?.status ===422){
                    return toast({
                        title: 'Invalid Subreddit name',
                        description:'Please choose a Subreddit name between 3 and 21 characters',
                        variant:'destructive'
                    })
                }

                if(error.response?.status === 401){
                    return loginToast()
                }
            }
            toast({
                title:'An Error Occured :(',
                description:'Could not create subreddit, please try again in some time'
            })

        },
        onSuccess:(data)=>{
            router.push(`/r/${data}`)
        }

    })
    return (
        <div className="container flex items-center h-full max-w-3xl m-auto">
            <div className="flex h-full w-full  flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Create a new Suc</h1>
                </div>

                <Separator />
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
                        disabled={input.length===0}
                        onClick={()=>createCommunity()}
                        >
                        Create
                    </Button>
                </div>
            </div>
        </div>
    )
}