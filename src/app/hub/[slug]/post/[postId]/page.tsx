import CommentsSection from "@/components/CommentsSection"
import EditorOutput from "@/components/EditorOutput"
import WebShare from "@/components/WebShare"
import PostVoteServer from "@/components/post-vote/PostVoteServer"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { ArrowBigDown } from "lucide-react"
import { ArrowBigUp } from "lucide-react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

interface PageParams {
    params: {
        slug:string
        postId: string
    }
}

export async function generateMetadata(
    { params }: PageParams,
  ): Promise<Metadata> {

    // fetch metadata
    const post = await db.post.findFirst({
        where: {
            id: params.postId
        },
    })
    return {
      title:`hub/${params.slug}/${post?.title}`,
      description:`${post?.authorId} on hub/${params.slug} Posted ${post?.title}`
    }
  }


export default async function Page({ params: { postId,slug } }: PageParams) {

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
        <div className=" flex flex-col sm:flex-row items-center sm:items-start justify-start">
            <div className="lg:flex hidden">
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

            </div>
            <div className=" flex flex-col justify-start w-full overflow-x-clip p-4 rounded-sm">
                <p className="max-h-40 w-full mt-1 truncate text-xs">
                    Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
                    {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                </p>
                <h1 className="text-2xl font-semibold py-2 leading-6 ">
                    {post?.title ?? cachedPost.title}
                </h1>

                <Separator/>
                    {/* @ts-ignore server component */}

                <div className="md:w-full md:max-w-none max-w-xs rounded-xl overflow-x-scroll scrollbar-thin scrollbar-thumb-current scrollbar-thumb-rounded-sm mt-4">

                <EditorOutput content={post?.content ?? cachedPost.content} />
                </div>


            </div>

        </div>
        <Separator/>
        <div className="flex justify-start gap-4 items-center pt-6">

        <div className="flex lg:hidden">
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

            </div>
        <div className="flex gap-2  justify-center items-center">
            <h1 className="hidden lg:flex ">liked this post...? try sharing it with your friends </h1>
            <WebShare post={post} subredditName={slug}/>
            </div>
            </div>

        <Suspense fallback={<Skeleton className="w-full h-full" />}>
                    {/* @ts-ignore server component */}
                    <CommentsSection postId={post?.id ?? cachedPost.id} />
                </Suspense>
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


