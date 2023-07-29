'use client'
import { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { notFound, useRouter } from "next/navigation";
import { Button } from "./ui/Button";

interface CreateCommentProps {
    postId:string,
    replyToId?:string
}

export default function CreateComment({postId,replyToId}:CreateCommentProps) {
    const {loginToast} = useCustomToast()
    const router = useRouter()
    const {mutate:postComment,isLoading:isCommentPosting} = useMutation({
        mutationFn:async({postId,text,replyToId}:CommentRequest)=>{
            const payload:CommentRequest={
                postId,
                text,
                replyToId,
            }

            const {data} = await axios.patch('/api/subreddit/post/comment',payload)
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
        }
    })

    const [input,setInput] = useState<string>('')

  return (
    <div className="grid w-full gap-1.5">
        <Label htmlFor="comment" >Your Commet</Label>
        <div className="mt-2">
            <Textarea id="comment"
            value={input} onChange={(e)=>setInput(e.target.value)}
            placeholder="what's on your mind...?" />

            <div className="mt-2 flex justify-end">
                <Button onClick={()=>postComment({postId,text:input,replyToId })} isLoading={isCommentPosting} disabled={input.length===0}>Post</Button>
            </div>
        </div>
    </div>
  )
}
