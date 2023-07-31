import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  try {

    const url = new URL(req.url)

    const session = await getAuthSession()

    let followedCommunitiesIds: string[] = []

    if (session) {
      const followedCommunities = await db.subscription.findMany({
        where: {
          // @ts-ignore
          userId: session.user.id,
        },
        include: {
          subreddit: true,
        },
      })

      followedCommunitiesIds = followedCommunities.map((sub) => sub.subreddit.id)
    }
    const { limit, page, subredditName, tabType } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
        tabType: z.string().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        tabType: url.searchParams.get('tabType'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })

    let whereClause = {}


    if (tabType==='true') {
      whereClause = {}
    }
    else if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      }
    }
    else if (session && tabType==='false') {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }


    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt:'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })



    return new Response(JSON.stringify(posts))
  } catch (error) {
    if(error instanceof z.ZodError)
            return new Response(error.message,{status:422})

    return new Response('Could not fetch posts', { status: 500 })
  }
}