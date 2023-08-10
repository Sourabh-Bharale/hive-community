import { z } from 'zod'

export const SubredditValidator = z.object({
    name: z.string().min(3).max(21).trim().regex(/^[a-z0-9]+$/i),
})

export const SubredditSubscriptionValidator = z.object({
    subredditId:z.string()
})

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>
export type SubscribeToSubredditPayload = z.infer<typeof SubredditSubscriptionValidator>