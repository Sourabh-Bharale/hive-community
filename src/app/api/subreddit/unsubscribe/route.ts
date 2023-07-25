import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user)
            return new Response('Unauthorized', { status: 401 })

        const body = await req.json()

        const { subredditId } = SubredditSubscriptionValidator.parse(body)

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                // @ts-ignore user id exists
                userId: session.user.id,
            },
        })

        if (!subscriptionExists)
            return new Response('You are not subscribed to this community', { status: 400 })

        const creatorUnsubscribing = await db.subreddit.findFirst({
            where : {
                id : subredditId,
                // @ts-ignore user id exists
                creatorId : session.user.id
            }
        })

        if(creatorUnsubscribing)
            return new Response('You cannot unsubscribe from your own community',{status:403})

        await db.subscription.delete({
            where: {
                userId_subredditId : {
                    subredditId,
                    // @ts-ignore user id exists
                    userId: session.user.id,
                }
            }
        })

        return new Response(subredditId)
    } catch (error) {
        (error)
        if (error instanceof z.ZodError)
            return new Response(error.message, { status: 422 })

        return new Response('Could not unsubscribe :( , please try again later', { status: 500 })
    }
}