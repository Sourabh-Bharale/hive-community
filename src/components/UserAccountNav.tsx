'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { User } from "next-auth"
import UserAvatar from "./UserAvatar"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/Button"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface UserAccountNavProps {
    user: Pick<User, 'name' | 'email' | 'image'>
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger>
                <UserAvatar
                    className={cn('h-8 w-8')}
                    user={{
                        name: user.name || null,
                        image: user.image || null
                    }} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
                <div className="flex  items-center justify-start gap-2">
                    <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user.email && <p className="w-[200px] truncate text-sm ">{user.email}</p>}
                    </div>
                </div>
                <DropdownMenuSeparator/>

                <DropdownMenuItem asChild>
                    <Link href={'/'}>Feed</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={'/suc/create'}>create new suc</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={'/settings'}>settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem
                onSelect={(e)=>{
                    e.preventDefault()
                    signOut({
                        callbackUrl: `${window.location.origin}/sign-in`,
                    })
                }}
                  className={cn('cursor-pointer')}>
                    Sign out
                </DropdownMenuItem>


            </DropdownMenuContent>
        </DropdownMenu>
    )
}