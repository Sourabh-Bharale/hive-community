import { z } from "zod";

export const WebdShareValidator = z.object({
    title:z.string(),
    url:z.string(),
    text:z.string(),
})

export type WebShareRequest = z.infer<typeof WebdShareValidator>