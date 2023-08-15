'use client'

import { Session } from "next-auth"
import UserAvatar from "./UserAvatar"
import { Input } from "./ui/input"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/Button"
import { LinkIcon, PhotoIcon } from "@heroicons/react/24/outline"

interface MiniCreatePostProps{
    session: Session| null
}
export default function MiniCreatePost({session}:MiniCreatePostProps) {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <>
        <li className="overflow-hidden select-none rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
            <div className="h-full  px-6 py-4 flex justify-between gap-6">
                <div className="relative h-fit">
                    <UserAvatar user={{
                        name:session?.user?.name || null,
                        image:session?.user?.image || null,
                    }}
                     />

                     <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-400 outline outline-2"/>

                </div>
                <Input
                 readOnly
                 onClick={()=>router.push(`${pathname}/submit`)}
                 placeholder="create post"
                />

                <Button
                 onClick={()=>router.push(`${pathname}/submit`)}
                 variant={"ghost"}
                 className="md:flex hidden"
                >
                    <PhotoIcon className="w-6 h-6"/>
                </Button>

                <Button
                 onClick={()=>router.push(`${pathname}/submit`)}
                 variant={"ghost"}
                 className="md:flex hidden"
                >
                    <LinkIcon className="w-6 h-6"/>
                </Button>
            </div>
        </li>
        </>
    )
}