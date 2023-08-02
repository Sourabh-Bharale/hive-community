import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { format } from 'date-fns'
import { CalendarIcon, UsersIcon } from "@heroicons/react/24/outline"
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/Button"
interface LayoutProps {
    children: React.ReactNode
    params: {
        slug: string
    }
}
export default async function Layout({ children, params: { slug } }: LayoutProps) {
    const session = await getAuthSession()
    const subreddit = await db.subreddit.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true
                }
            }
        }
    })

    const subscription = !session?.user
        ? undefined
        : await db.subscription.findFirst({
            where: {
                subreddit: {
                    name: slug
                },
                user: {
                    // @ts-expect-error user exists
                    id: session.user.id,
                }
            }
        })

    const isSubscribed = !!subscription

    if (!subreddit) return notFound()

    const memberCount = await db.subscription.count({
        where: {
            subreddit: {
                name: slug
            }
        }
    })

    return (
        <div className="sm:container max-w-7xl mx-auto h-full pt-12">
            <div className="">
                {/* todo back */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <div className="flex flex-col col-span-2 space-y-6">
                        {children}
                    </div>
                    {/* info sidebar */}
                    <div className="hidden md:block overflow-hidden h-fit rounded-lg border order-first md:order-last">
                        <div className="px-6 py-4">
                            <p className="font-semibold py-3">About hub/{subreddit.name}</p>
                        </div>

                        <dl className="divide-y px-6 py-4 text-sm leading-6">
                            <div className="flex justify-between items-center gap-x-4 py-3">
                                <dt className="flex items-center gap-2">
                                    <p>Created</p>
                                    <CalendarIcon className="w-4 h-4" />
                                </dt>
                                <dt>
                                    <time dateTime={subreddit.createdAt.toDateString()}>
                                        {format(subreddit.createdAt, 'MMMM d,yyyy')}
                                    </time>
                                </dt>
                            </div>

                            <div className="flex justify-between items-center gap-x-4 py-3">
                                <dt className="flex items-center gap-2">
                                    <p>Members</p>
                                    <UsersIcon className="w-4 h-4" />
                                </dt>
                                <dt>
                                    <p>{memberCount}</p>
                                </dt>
                            </div>
                            {/* @ts-expect-error user id exists */}
                            {subreddit.creatorId === session?.user.id ? (
                                <div className="flex justify-between gap-x-4 py-3">
                                    <p>
                                        You created this Hub
                                    </p>
                                </div>
                            ) : null}
                            {/* @ts-expect-error user id exists */}
                            {subreddit.creatorId !== session?.user.id ? (
                                <SubscribeLeaveToggle subredditId={subreddit.id} subredditName={subreddit.name} isSubscribed={isSubscribed} />
                            ) : null}

                            <Link
                                className={buttonVariants({
                                    variant: "secondary",
                                    className: 'w-full '
                                })}
                                href={`hub/${slug}/submit`}>
                                Create Post
                            </Link>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}