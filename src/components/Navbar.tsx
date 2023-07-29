import Link from "next/link"
import { ThemeToggle } from "./themeToggle"
import {ChatBubbleLeftEllipsisIcon} from '@heroicons/react/24/outline'
import { buttonVariants } from "./ui/Button"
import { cn } from "@/lib/utils"
import { getAuthSession } from "@/lib/auth"
import UserAccountNav from "./UserAccountNav"
import SearchBar from "./SearchBar"
import { Input } from "./ui/input"
const Navbar = async () => {

    const session = await getAuthSession()


    return (
        <div className="fixed top-0 inset-x-0 h-fit z-[10] py-2 backdrop-blur-2xl">
            <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
                {/* Logo */}
                <Link href={'/'} className="flex gap-2 items-center">
                    <ChatBubbleLeftEllipsisIcon className={cn(buttonVariants({variant:"ghost",className:'rounded-full'}))}/>
                    <p className="hidden md:flex font-medium ">Suc-it</p>
                </Link>


                <SearchBar/>

                {/* signin */}
                <div className="flex items-center gap-2">

                {session?.user ? (
                        <UserAccountNav user={session.user}/>
                    ):(
                        <Link href={'/sign-in'} className={buttonVariants()}>Sign In</Link>
                    )
                }

                {/* themeToggle */}
                <ThemeToggle />
                </div>

            </div>
        </div>
    )
}
export default Navbar