'use client'
import { Post, User, Vote } from "@prisma/client"
import { buttonVariants } from "./ui/Button"
import {formatTimeToNow} from '@/lib/utils'
import { useRef } from "react"
import { MessageSquareIcon } from "lucide-react"
import { cn } from '@/lib/utils'
import EditorOutput from "./EditorOutput"
import PostVoteClient from "./post-vote/PostVoteClient"

type PartialVote = Pick<Vote,'type'>

interface PostProps {
subredditName : string,
post : Post & {
    author:User,
    votes:Vote[]
},
commentAmount : number,
votesAmount:number,
currentVote?:PartialVote
}
export default function Post({subredditName,post,commentAmount,votesAmount,currentVote}:PostProps) {

    const pRef = useRef<HTMLDivElement>(null)

    return (
    <div className="rounded-md shadow border">
        <div className="px-6 py-4 flex justify-between">
            <div className="md:block hidden">
            <PostVoteClient postId={post.id} initialVotesAmount={votesAmount} initialVote={currentVote?.type} />
            </div>

            <div className="w-0 flex-1">
                <div className="max-h-40 mt-1 text-xs">
                    {
                        subredditName ? (
                            <>
                            <a className={buttonVariants({variant:"link"})} href={`/r/${subredditName}`}>r/{subredditName}</a>
                            <span className="px-1">•</span>
                            </>
                        ):null
                    }
                    <span>Posted by u/{post.author.username}</span>
                    {" "}{formatTimeToNow(new Date(post.createdAt))}
                </div>

                <a href={`/r/${subredditName}/post/${post.id}`} className={buttonVariants({variant:"link"})}>
                    <h1 className="text-xl font-semibold py-2 leading-6">
                        {post.title}
                    </h1>
                </a>

                <div className="relative text-sm max-h-40 w-full overflow-clip p-4"
                ref={pRef}>

                    <EditorOutput content={post.content}/>
                    {pRef.current?.clientHeight===160 ? (
                        <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-white dark:from-[#030711]  to-transparent"/>
                    ):null}
                </div>
            </div>
        </div>

        <div className="flex z-20 text-sm p-4 sm:px-6">
        <div className="block md:hidden">
            <PostVoteClient postId={post.id} initialVotesAmount={votesAmount} initialVote={currentVote?.type} />
        </div>
        <a className={cn('gap-2',buttonVariants({variant:"link"}))} href={`/r/${subredditName}`}>
            <MessageSquareIcon className="w-4 h-4"/>{commentAmount} comments
        </a>

        </div>
    </div>
  )
}
