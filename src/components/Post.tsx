'use client'
import { Post, User, Vote } from "@prisma/client"
import { buttonVariants } from "./ui/Button"
import {formatTimeToNow} from '@/lib/utils'
import { useRef } from "react"
import { MessageSquareIcon } from "lucide-react"
import { cn } from '@/lib/utils'
import EditorOutput from "./EditorOutput"
import PostVoteClient from "./post-vote/PostVoteClient"
import WebShare from "./WebShare"

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
        <div className="px-2 py-4 flex justify-between ">
            <div className="md:block hidden">
            <PostVoteClient postId={post.id} initialVotesAmount={votesAmount} initialVote={currentVote?.type} />
            </div>

            <div className="w-0 h-full flex-col gap-2 flex-1">
                <div className="flex flex-col  max-h-40 mt-1 text-xs truncate justify-start items-start">
                    {
                        subredditName ? (
                            <>
                            <a className={buttonVariants({variant:"link"})} href={`/hub/${subredditName}`}>hub/{subredditName}</a>
                            </>
                        ):null
                    }
                    <div className="flex gap-2 px-4">
                    <span>Posted by u/{post.author.username}</span>
                    {" "}{formatTimeToNow(new Date(post.createdAt))}
                    </div>
                </div>

                <a href={`/hub/${subredditName}/post/${post.id}`} className={cn('my-4',buttonVariants({variant:"link"}))}>
                    <h1 className="text-xl font-semibold py-2 ">
                        {post.title}
                    </h1>
                </a>
                <a href={`/hub/${subredditName}/post/${post.id}`}>
                <div className="relative text-sm h-fit max-h-96 w-full overflow-clip"
                ref={pRef}>

                    <EditorOutput content={post.content}/>

              {/* // blur bottom if content is too long */}
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white dark:from-[#030711] to-transparent'></div>
                </div>
                </a>
            </div>
        </div>

        <div className="flex z-20 text-sm p-4 sm:px-6 items-center">
        <div className="block md:hidden">
            <PostVoteClient postId={post.id} initialVotesAmount={votesAmount} initialVote={currentVote?.type} />
        </div>
        <a className={cn('gap-2',buttonVariants({variant:"link"}))} href={`/hub/${subredditName}/post/${post.id}`}>
            <MessageSquareIcon className="w-4 h-4"/>{commentAmount} <p className="hidden lg:flex ">comments</p>
        </a>
        <div className="flex gap-2 justify-center items-center">
            <WebShare post={post} subredditName={subredditName}/>
        </div>

        </div>
    </div>
  )
}
