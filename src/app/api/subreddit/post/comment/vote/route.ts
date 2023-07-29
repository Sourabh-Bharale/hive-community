import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentVoteValidator } from "@/lib/validators/vote"
import { z } from "zod"


export async function PATCH(req:Request){
    try {
        const session = await getAuthSession()

        if (!session?.user)
            return new Response('Unauthorized', { status: 401 })

        const body = await req.json()

        const { commentId,voteType } = CommentVoteValidator.parse(body)

        const existingVote = await db.commentVote.findFirst({
            where:{
                // @ts-ignore userid exists
                userId:session.user.id,
                commentId,
            }
        })

        if(existingVote){
            if(existingVote.type===voteType){
                await db.commentVote.delete({
                    where :{
                        userId_commentId :{
                            commentId,
                            // @ts-ignore userid exists
                            userId:session.user.id
                        }
                    }
                })

                return new Response('OK',{status:200})
            }else{
                await db.commentVote.update({
                    where :{
                        userId_commentId :{
                            commentId,
                            // @ts-ignore userid exists
                            userId:session.user.id
                        },
                    },
                    data:{
                        type:voteType,
                    },
                })

                return new Response('ok',{status:200})
            }

        }

        await db.commentVote.create({
            data:{
                type:voteType,
                // @ts-ignore
                userId:session.user.id,
                commentId,
            },
        })

        return new Response('ok',{status:200})



    } catch (error) {
        (error)
        if (error instanceof z.ZodError)
            return new Response(error.message, { status: 422 })

        return new Response('Could not register your vote at this moment, please try again later', { status: 500 })
    }
}