import { Post, Vote, VoteType } from "@prisma/client"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import PostVoteClient from "./PostVoteClient"

interface PostVoteServerProps {
    postId: string
    initialVotesAmount?: number
    initialVote?: VoteType | null
    getData?: () => Promise<(Post & { votes: Vote[] }) | null>
}

const wait = (ms:number)=>new Promise((res)=>setTimeout(res,ms))

export default async function PostVoteServer({
    postId,
    initialVotesAmount,
    initialVote,
    getData,
}: PostVoteServerProps) {
    const session = await getServerSession()
    let _voteAmount: number = 0
    let _currentVote: VoteType | null | undefined = undefined

    if (getData) {
        await wait(2000)
        const post = await getData()
        if (!post) return notFound()

        _voteAmount = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
        }, 0)

        _currentVote = post.votes.find(
            (vote) =>
                // @ts-ignore
                vote.userId === session?.user.id
        )?.type
    }else{
        _voteAmount=initialVotesAmount!
        _currentVote=initialVote
    }
    return (
        <PostVoteClient postId={postId} initialVotesAmount={_voteAmount} initialVote={_currentVote}/>
    )
}
