import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"
import { getAuthSession } from "@/lib/auth"
import { Separator } from "./ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GeneralFeed from "./GeneralFeed"


export default async function CustomFeed() {
    const session = await getAuthSession()

    const followedCommunities = await db.subscription.findMany({
        where: {
            // @ts-ignore
            userId: session?.user.id
        },
        include: {
            subreddit: true
        }
    })

    const followedCommunitiesIds = followedCommunities.map(({ subreddit }) => subreddit.id)

    const posts = await db.post.findMany({
        where: {
            subreddit: {
                name: {
                    in: followedCommunitiesIds
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: true,
            votes: true,
            comments: true,
            subreddit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    })

    return (
        <div className="flex flex-col gap-2 w-full h-full">

            <Tabs defaultValue="subscription" className="w-full">
                <TabsList>
                    <TabsTrigger value="subscription">
                        {/* @ts-ignore */}
                        For u/{session?.user?.username}
                    </TabsTrigger>
                    <TabsTrigger value="general">
                        General
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                <Separator />
                {/* @ts-ignore server component */}
                <GeneralFeed tabType={true}/>
                </TabsContent>
                <TabsContent value="subscription">
                    <Separator />
                    <PostFeed tabType={'false'} initialPosts={posts} />
                </TabsContent>
            </Tabs>

        </div>
    )
}
