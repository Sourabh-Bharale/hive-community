import MiniCreatePost from "@/components/MiniCreatePost"
import PostFeed from "@/components/PostFeed"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        slug: string
    }
}


export async function generateMetadata(
    { params }: PageProps,
  ): Promise<Metadata> {

    // fetch metadata
    const subreddit = await db.subreddit.findFirst({
        where: {
            name:params.slug
        },
    })
    return {
      title: `r/${subreddit?.name}`,
      description:`created by ${subreddit?.creatorId}`
    }
  }


export default async function ({ params }: PageProps) {
    const { slug } = params
    const session = await getAuthSession()
    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: INFINITE_SCROLLING_PAGINATION_RESULTS
            },
        },
    })

    if(!subreddit) return notFound()

    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-3xl md:text-4xl">
                r/{subreddit.name}
            </h1>
            <MiniCreatePost session={session}/>
            <PostFeed tabType={'false'} initialPosts={subreddit.posts}  subredditName={subreddit.name}/>
        </div>
    )
}