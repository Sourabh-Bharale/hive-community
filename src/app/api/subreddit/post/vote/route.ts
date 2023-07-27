import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { PostVoteValidator } from "@/lib/validators/vote"
import { CachedPost } from "@/types/redis"
import { VoteType } from "@prisma/client"
import { z } from "zod"

const CACHE_AFTER_UPVOTES = 1



export async function PATCH(req:Request){
    try {
        const session = await getAuthSession()

        if (!session?.user)
            return new Response('Unauthorized', { status: 401 })

        const body = await req.json()

        const { postId,voteType } = PostVoteValidator.parse(body)

        const existingVote = await db.vote.findFirst({
            where:{
                // @ts-ignore userid exists
                userId:session.user.id,
                postId,
            }
        })

        const post = await db.post.findUnique({
            where:{
                id:postId,
            },
            include:{
                author:true,
                votes:true,
            },
        })

        if(!post)
            return new Response('Post not found',{status:404})

        if(existingVote){
            if(existingVote.type===voteType){
                await db.vote.delete({
                    where :{
                        userId_postId :{
                            postId,
                            // @ts-ignore userid exists
                            userId:session.user.id
                        }
                    }
                })

                return new Response('OK',{status:200})
            }
            await db.vote.update({
                where :{
                    userId_postId :{
                        postId,
                        // @ts-ignore userid exists
                        userId:session.user.id
                    },
                },
                data:{
                    type:voteType,
                },
            })

            // cache votes above threshold
            const voteAmount = post.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1
                if (vote.type === "DOWN") return acc - 1
                return acc
            }, 0)

            if(voteAmount>=CACHE_AFTER_UPVOTES){
                const cachePayload :CachedPost = {
                    authorUsername:post.author.username??'',
                    content:JSON.stringify(post.content),
                    id:post.id,
                    title:post.title,
                    currentVote:voteType,
                    createdAt:post.createdAt,
                }

                await redis.hset(`post:${postId}`,cachePayload)
            }
            return new Response('ok',{status:200})
        }

        await db.vote.create({
            data:{
                type:voteType,
                // @ts-ignore
                userId:session.user.id,
                postId,
            },
        })

        const voteAmount = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1
            if (vote.type === "DOWN") return acc - 1
            return acc
        }, 0)

        if(voteAmount>=CACHE_AFTER_UPVOTES){
            const cachePayload :CachedPost = {
                authorUsername:post.author.username??'',
                content:JSON.stringify(post.content),
                id:post.id,
                title:post.title,
                currentVote:voteType,
                createdAt:post.createdAt,
            }

            await redis.hset(`post:${postId}`,cachePayload)
        }
        return new Response('ok',{status:200})



    } catch (error) {
        (error)
        if (error instanceof z.ZodError)
            return new Response(error.message, { status: 422 })

        return new Response('Could not register your vote at this moment, please try again later', { status: 500 })
    }
}