import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import Link from "next/link";

export const metadata:Metadata={
    title:'Sign in to Hive',
    description:'Sign in to your Hive account',
    creator:'Hive',
    openGraph:{
        images:''
    }
}

export default function page  () {
    return(

    <div className="absolute inset-0">
        <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4">
        <SignIn/>
            <Link
                href={'/'}
                className={cn(
                    buttonVariants({ variant: "secondary" }),
                     'self-center  gap-2'
                    )}>
                        <ChevronLeftIcon className="w-4 h-4"/>Home
            </Link>
        </div>
    </div>
    )
}
