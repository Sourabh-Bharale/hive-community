import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"
import { Separator } from "./ui/separator"

interface GeneralFeedProps  {
    tabType?:string
}

export default async function GeneralFeed({tabType}:GeneralFeedProps) {
    const posts = await db.post.findMany({
        orderBy:{
            createdAt:'desc',
        },
        include:{
            author:true,
            votes:true,
            comments:true,
            subreddit:true,
        },
        take:INFINITE_SCROLLING_PAGINATION_RESULTS
    })
    return (
    <div className="flex flex-col gap-2 w-full h-full">
    <h1 className="text-xs font-light">explore...</h1>
    <Separator/>
    <PostFeed tabType={tabType} initialPosts={posts}/>
    </div>
  )
}
