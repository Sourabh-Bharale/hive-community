'use client'
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

interface SubscribeLeaveToggleProps {
    subredditId: string,
    subredditName:string,
    isSubscribed : boolean
}

export default function SubscribeLeaveToggle({ subredditId , subredditName , isSubscribed }: SubscribeLeaveToggleProps) {
    const router = useRouter()
    const { loginToast } = useCustomToast()

    // subscribe to community
    const { mutate:subscribe , isLoading:isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId,
            }
            const { data } = await axios.post('/api/subreddit/subscribe', payload)
            return data as string
        },
        onError: (error) => {
            if (error instanceof AxiosError) {

                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'An Error Occured :(',
                description: 'Something went wrong , please try again in some time',
                variant: "destructive"
            })
        },
        onSuccess: () => {
            startTransition(()=>{
                router.refresh()
            })
            return toast({
                title:'Subscribed',
                description:`You are now subscribed to hub/${subredditName}`
            })
        }
    })
    // unsubscribe from a community
    const { mutate:unsubscribe , isLoading:isUnSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId,
            }
            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
            return data as string
        },
        onError: (error) => {
            if (error instanceof AxiosError) {

                if (error.response?.status === 401) {
                    return loginToast()
                }

                if(error.response?.status ===403){
                    return toast({
                        title: 'Action not Allowed',
                        description:'You cannot unsubscribe from your own community',
                        variant:'destructive'
                    })
                }
            }
            return toast({
                title: 'An Error Occured :(',
                description: 'Something went wrong , please try again in some time',
                variant: "destructive"
            })
        },
        onSuccess: () => {
            startTransition(()=>{
                router.refresh()
            })
            return toast({
                title:'Unsubscribed',
                description:`You are now unsubscribed from hub/${subredditName}`
            })
        }
    })

    return (
        <>
            {isSubscribed ? (
                <Button isLoading={isUnSubLoading} onClick={()=>unsubscribe()} className="w-full mt-1 mb-4">Leave Community</Button>
            ) : (
                <Button isLoading={isSubLoading} onClick={()=>subscribe()} className="w-full mt-1 mb-4">Join Community</Button>
            )
            }
        </>
    )
}
