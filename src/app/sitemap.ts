import { db } from "@/lib/db";
const URL = "https://onhive.vercel.app";

export default async function sitemap(){
    // routes
    const routes = ["","/sign-in","/sign-up","/settings","/hub/create"].map((route) => ({
        url: `${URL}${route}`,
        lastModified: new Date().toISOString(),
      }));

    // hubs
    const hubsReq = await db.subreddit.findMany()
    const allHubs = hubsReq.map(({name,updatedAt})=>({
        url:`${URL}/hubs/${name}`,
        lastModified:updatedAt,
    }))

    // posts
    const postsInsideHub = await db.post.findMany({
        include:{
            subreddit:true,
        }})
        // @ts-ignore
    const allPosts = postsInsideHub.map(({id,updatedAt,subreddit})=>({
        url:`${URL}/hubs/${subreddit.name}/${id}`,
        lastModified:updatedAt,
    }))

      return [...routes,...allHubs,...allPosts];
}