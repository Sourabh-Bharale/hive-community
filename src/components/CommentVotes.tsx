'use client'
import { useCustomToast } from "@/hooks/use-custom-toast"
import { usePrevious } from "@mantine/hooks"
import { CommentVote, VoteType } from "@prisma/client"
import {  useState } from "react"

import { cn } from "@/lib/utils"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { CommentVoteRequest } from "@/lib/validators/vote"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { Button } from "./ui/Button"

interface CommentVotesProps {
    commentId: string
    initialVotesAmount: number
    initialVote?: Pick<CommentVote, 'type'>
  }
export default function CommentVotes({
    commentId,
    initialVotesAmount,
    initialVote,
}: CommentVotesProps) {

    const { loginToast } = useCustomToast()
    const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const prevVote = usePrevious(currentVote)


    const { mutate: vote } = useMutation({
        mutationFn: async (type: VoteType) => {
            const payload: CommentVoteRequest = {
              voteType: type,
              commentId: commentId,
            }

            await axios.patch('/api/subreddit/post/comment/vote', payload)
          },
          onError: (err, voteType) => {

            if (voteType === 'UP') setVotesAmount((prev) => prev - 1)
            else setVotesAmount((prev) => prev + 1)

            // reset current vote
            setCurrentVote(prevVote)

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                  return loginToast()
                }
              }

            return toast({
                title: 'Something went wrong :(',
                description: 'Could not register your vote at this moment, please try again later',
                variant: 'destructive'
            })
        },
        onMutate: (type) => {
            if (currentVote?.type === type) {
                // User is voting the same way again, so remove their vote
                setCurrentVote(undefined)
                if (type === 'UP') setVotesAmount((prev) => prev - 1)
                else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
              } else {
                // User is voting in the opposite direction, so subtract 2
                setCurrentVote({type})
                if (type === 'UP') setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
                else if (type === 'DOWN')
                  setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
              }
            },
          })


    return (
        <div className="flex gap-1">
            <Button onClick={() => vote("UP")} size={'sm'} variant={'ghost'} aria-label="upvote">
                <ArrowBigUp className={cn('w-5 h-5',
                    { 'text-teal-300 fill-teal-500': currentVote?.type === 'UP' }
                )} />
            </Button>

            <p className="text-center py-2 font-medium text-sm">
                {votesAmount}
            </p>

            <Button onClick={() => vote("DOWN")} size={'sm'} variant={'ghost'} aria-label="downvote">
                <ArrowBigDown className={cn('w-5 h-5',
                    { 'text-rose-500 fill-rose-500': currentVote?.type === 'DOWN' }
                )} />
            </Button>

        </div>
    )
}
