import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserNameValidator } from "@/lib/validators/username";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user)
            return new Response('Unauthorized', { status: 401 })

        const body = await req.json()

        const { name } = UserNameValidator.parse(body)

        const usernameTaken = await db.user.findFirst({
            where:{
                username:name
            },
        })

        if(usernameTaken)
            return new Response('Username already taken',{status:409})


        await db.user.update({
            where:{
                // @ts-ignore
                id:session.user.id,
            },
            data:{
                username:name,
            }
        })

        return new Response(name)
    } catch (error) {
        (error)
        if (error instanceof z.ZodError)
            return new Response(error.message, { status: 422 })

        return new Response('Could not update username at this moment, please try again later', { status: 500 })
    }
}