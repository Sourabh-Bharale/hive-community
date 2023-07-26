'use client'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { ExtendedPosts } from "@/types/db"
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRef } from "react"
import Post from "./Post"
interface PostFeedProps {
    initialPosts: ExtendedPosts[],
    subredditName: string
}
export default function PostFeed({ initialPosts, subredditName }: PostFeedProps) {
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
                (!!subredditName ? `&subredditName=${subredditName}` : '')

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
                                <Post commentAmount={post.comments.length} post={post} subredditName={subredditName}/>
                            </li>
                        )
                    }
                    else {
                        return <Post commentAmount={post.comments.length} post={post} subredditName={subredditName}/>
                    }

                })}
        </ul>
    )
}
