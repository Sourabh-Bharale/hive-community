'use client'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { ExtendedPosts } from "@/types/db"
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"
import Post from "./Post"
import { Skeleton } from "./ui/skeleton"
interface PostFeedProps {
    initialPosts: ExtendedPosts[],
    subredditName?: string,
    tabType?:string
}
export default function PostFeed({ initialPosts, subredditName,tabType }: PostFeedProps) {
    const { data: session } = useSession()
    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        ['infinite-query'],
        async ({ pageParam = 1 }) => {
            const query =
                `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
                (!!subredditName ? `&subredditName=${subredditName}` : '') + `&tabType=${tabType}`


            const { data } = await axios.get(query)
            return data as ExtendedPosts[]
        }, {
        getNextPageParam: (_, pages) => {
            return pages.length + 1
        },
        initialData: {
            pages: [initialPosts],
            pageParams: [1]
        },
    }
    )

    useEffect(() => {
        if (entry?.isIntersecting)
            fetchNextPage()
    }, [entry, fetchNextPage])

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts


    return (
        <ul className="flex flex-col col-span-2 space-y-6">
            {
                posts.map((post, index) => {
                    const voteAmount = post.votes.reduce((acc, vote) => {
                        if (vote.type === "UP") return acc + 1
                        if (vote.type === "DOWN") return acc - 1
                        return acc
                    }, 0)

                    // check if user voted the post
                    const currentVote = post.votes.find(
                        // @ts-ignore user id exists
                        (vote) => vote.userId === session?.user.id
                    )

                    if (index === posts.length - 1) {
                        return (
                            <li key={post.id} ref={ref}>
                                <Post currentVote={currentVote} votesAmount={voteAmount} commentAmount={post.comments.length} post={post} subredditName={post.subreddit.name} />
                            </li>
                        )
                    }
                    else {
                        return <Post currentVote={currentVote} votesAmount={voteAmount} key={post.id} commentAmount={post.comments.length} post={post} subredditName={post.subreddit.name} />
                    }

                })}


            {isFetchingNextPage && (
                <li className='flex justify-start w-full h-24 '>
                    <div className="p-4 h-full">
                        <Skeleton className="w-5 h-full" />
                    </div>
                    <div className="flex w-full flex-col p-2 gap-2">
                        <div className="flex gap-2">
                            <Skeleton className="w-12 h-4" />
                            <Skeleton className="w-12 h-4" />
                        </div>
                        <div className="flex w-full h-full ">
                            <Skeleton className="w-full h-full" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="w-12 h-4" />
                        </div>
                    </div>
                </li>
            )}
        </ul>
    )
}
