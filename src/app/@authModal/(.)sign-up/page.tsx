import CloseModal from "@/components/CloseModal"
import SignUp from "@/components/SignUp"
import { Metadata } from "next"

export const metadata:Metadata={
    title:'Sign up to Hive',
    description:'Sign up to create a new account to Hive',
    creator:'Hive',
    openGraph:{
        images:''
    }
}

export default function page(){
    return (
        <div className="fixed inset-0 backdrop-blur-2xl  z-10 ">
            <div className="container flex items-center h-full max-w-lg mx-auto">
                <div className="relative w-full h-fit py-12 px-2 rounded-lg">
                    <div className="absolute top-0 right-4">
                        <CloseModal/>
                    </div>
                    <SignUp/>
                </div>
            </div>
        </div>
    )
}