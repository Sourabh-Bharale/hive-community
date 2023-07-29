import CommentsSection from "@/components/CommentsSection"
import EditorOutput from "@/components/EditorOutput"
import PostVoteServer from "@/components/post-vote/PostVoteServer"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { ArrowBigDown } from "lucide-react"
import { ArrowBigUp } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

interface PageParams {
    params: {
        postId: string
    }
}
export default async function Page({ params: { postId } }: PageParams) {

    const cachedPost = (
        await redis.hgetall(`post:${postId}`)
    ) as CachedPost

    let post: (Post & {
        votes: Vote[];
        author: User
    }) | null = null

    if (!cachedPost) {
        post = await db.post.findFirst({
            where: {
                id: postId
            },
            include: {
                votes: true,
                author: true,
            },
        })
    }

    if (!post && !cachedPost) return notFound()



    return (
        <div>
        <div className="h-full w-full flex flex-col sm:flex-row items-center sm:items-start justify-between">

            <Suspense fallback={<PostVoteLoader />}>
                {/* @ts-expect-error server component */}
                <PostVoteServer
                    postId={post?.id ?? cachedPost.id}
                    getData={async () => {
                        return await db.post.findUnique({
                            where: {
                                id: postId,
                            },
                            include: {
                                votes: true,
                            },
                        })
                    }}
                />
            </Suspense>
            <div className="flex flex-col w-full p-4 rounded-sm ">
                <p className="max-h-40 mt-1 truncate text-xs">
                    Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
                    {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                </p>
                <h1 className="text-2xl font-semibold py-2 leading-6 ">
                    {post?.title ?? cachedPost.title}
                </h1>
                    {/* @ts-ignore server component */}
                <EditorOutput content={post?.content ?? cachedPost.content} />

                <Suspense fallback={<Skeleton className="w-full h-full" />}>
                    {/* @ts-ignore server component */}
                    <CommentsSection postId={post?.id ?? cachedPost.id} />
                </Suspense>
            </div>
        </div>
        </div>

    )
}

function PostVoteLoader() {
    return <div className="flex md:flex-col gap-1 ">
        <Button size={'sm'} variant={'ghost'} >
            <ArrowBigUp className={'w-5 h-5'} />
        </Button>

        <Skeleton className=" self-center w-2 h-5" />

        <Button size={'sm'} variant={'ghost'} >
            <ArrowBigDown className={'w-5 h-5'} />
        </Button>
    </div>
}


