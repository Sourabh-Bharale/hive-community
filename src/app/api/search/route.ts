import { db } from "@/lib/db";
import { url } from "inspector";

export async function GET(req:Request){
    const url = new URL(req.url)
    const q = url.searchParams.get('q')

    if(!q) return new Response('Invalid query',{status:400})


    const results = await db.subreddit.findMany({
        where:{
            name : {
                contains:q,
            }
        },
        include:{
            _count:true,
        },
        take:10,
    })

    return new Response(JSON.stringify(results))
}