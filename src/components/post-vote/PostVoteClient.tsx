'use client'
import { useCustomToast } from "@/hooks/use-custom-toast"
import { usePrevious } from "@mantine/hooks"
import { VoteType } from "@prisma/client"
import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { cn } from "@/lib/utils"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { PostVoteRequest } from "@/lib/validators/vote"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"

interface PostVoteClientProps {
    postId: string
    initialVotesAmount: number
    initialVote?: VoteType | null
  }
export default function PostVoteClient({
    postId,
    initialVotesAmount,
    initialVote,
}: PostVoteClientProps) {

    const { loginToast } = useCustomToast()
    const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const prevVote = usePrevious(currentVote)

    // sync with server incase initial votes are undefined
    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])

    const { mutate: vote } = useMutation({
        mutationFn: async (type: VoteType) => {
            const payload: PostVoteRequest = {
              voteType: type,
              postId: postId,
            }

            await axios.patch('/api/subreddit/post/vote', payload)
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
        onMutate: (type: VoteType) => {
            if (currentVote === type) {
                // User is voting the same way again, so remove their vote
                setCurrentVote(undefined)
                if (type === 'UP') setVotesAmount((prev) => prev - 1)
                else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
              } else {
                // User is voting in the opposite direction, so subtract 2
                setCurrentVote(type)
                if (type === 'UP') setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
                else if (type === 'DOWN')
                  setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
              }
            },
          })

    return (
        <div className="flex md:flex-col gap-4 sm:gap-0 pr-6 pb-4 sm:w-20 sm:pb-0">
            <Button onClick={() => vote("UP")} size={'sm'} variant={'ghost'} aria-label="upvote">
                <ArrowBigUp className={cn('w-5 h-5',
                    { 'text-teal-300 fill-teal-500': currentVote === 'UP' }
                )} />
            </Button>

            <p className="text-center py-2 font-medium text-sm">
                {votesAmount}
            </p>

            <Button onClick={() => vote("DOWN")} size={'sm'} variant={'ghost'} aria-label="downvote">
                <ArrowBigDown className={cn('w-5 h-5',
                    { 'text-rose-500 fill-rose-500': currentVote === 'DOWN' }
                )} />
            </Button>

        </div>
    )
}
