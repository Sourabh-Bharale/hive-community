import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user)
            return new Response('Unauthorized', { status: 401 })

        const body = await req.json()

        const { subredditId ,title ,content } = PostValidator.parse(body)

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                // @ts-ignore user id exists
                userId: session.user.id,
            },
        })

        if (!subscriptionExists)
            return new Response('You need to be subscribed to this community, for posting', { status: 400 })

        await db.post.create({
            data : {
                title,
                content,
                // @ts-ignore user id exists
                authorId:session.user.id,
                subredditId,
            }
        })

        return new Response('Post created successfully')
    } catch (error) {
        (error)
        if (error instanceof z.ZodError)
            return new Response(error.message, { status: 422 })

        return new Response('Could not create post at this moment, please try again later', { status: 500 })
    }
}