import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentValidator } from "@/lib/validators/comment"
import { z } from "zod"

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req:Request){
    try {
        const session = await getAuthSession()

        if (!session?.user)
            return new Response('Unauthorized', { status: 401 })

        const body = await req.json()

        const { postId,text,replyToId } = CommentValidator.parse(body)

        const post = await db.post.findUnique({
            where:{
                id:postId,
            },
            include:{
                author:true,
                votes:true,
                comments:true,
            },
        })

        if(!post)
            return new Response('Post not found',{status:404})


        await db.comment.create({
            data:{
                text,
                postId,
                // @ts-ignore
                authorId:session.user.id,
                replyToId
            }
        })

        return new Response('comment addded to' + post.title)

    } catch (error) {
        if (error instanceof z.ZodError)
            return new Response(error.message, { status: 422 })

        return new Response('Could not post your comment at this moment, please try again later', { status: 500 })
    }
}