import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

export default function SignIn() {
    return (
        <div className="container mx-auto flex w-full justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center ">
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6 self-center" />
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm max-w-xs mx-auto">
                    by continuing you agree to our terms and privacy policy.
                </p>

                <UserAuthForm/>

                <p className="px-8 text-center text-sm">
                    New to Suc-it?{' '}
                    <Link
                        href={'/sign-up'}
                        className="text-sm underline underline-offset-4">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}