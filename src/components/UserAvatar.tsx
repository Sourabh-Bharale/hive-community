import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import { AvatarProps } from "@radix-ui/react-avatar";


interface UserAvatarProps extends AvatarProps {
    user: Pick<User, 'name' | 'image'>
}

export default function UserAvatar({ user , ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {
                user.image ? (
                    <div className="relative aspect-square h-full w-full">
                        <Image
                            fill
                            src={user.image}
                            alt='profile picture'
                            referrerPolicy="no-referrer"
                        />
                    </div>
                ) : (
                    <AvatarFallback>
                        <span className="sr-only">{user.name}</span>
                        <UserIcon className="w-4 h-4" />
                    </AvatarFallback>

                )
            }
        </Avatar>

    )
}