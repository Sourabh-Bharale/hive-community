'use client'
import { cn } from "@/lib/utils"
import { Button } from "./ui/Button"
import { FC, useState } from "react"
import { signIn } from 'next-auth/react'
import {  useToast } from "@/hooks/use-toast"
import { error } from "console"
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement>{}
const UserAuthForm:FC<UserAuthFormProps> =({className,...props})=>{

    const [isLoading,setIsLoading] = useState<boolean>(false)
    const {toast} = useToast()
    const loginWithGoogle = async ()=>{
        setIsLoading(true)
        try{
            await signIn('google')
        }catch(error){
            // throw error toast
            toast({
                title:'An error occured :(',
                description:'There was an problem while signing in, please try again ',
                variant:'destructive'
            })
        } finally{
            setIsLoading(false)
        }
    }

    return(
        <div className={cn('flex justify-center',className)} {...props}>
            <Button size='sm' onClick={loginWithGoogle} className="w-full" isLoading={isLoading}>
                Google
            </Button>
        </div>
    )
}
export default UserAuthForm