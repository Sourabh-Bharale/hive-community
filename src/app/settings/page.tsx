import { UserNameForm } from "@/components/UserNameForm"
import { getAuthSession } from "@/lib/auth"
import { SettingsIcon } from "lucide-react"
import { Metadata } from "next"

export const metadata:Metadata={
    title:'Settings',
    description:'Manage your Account & Username in your settings',
    }

export default async function Page() {

    const session = await getAuthSession()

  return (
    <div className="flex flex-col gap-4 md:max-w-4xl mx-auto py-12">
        <div className="grid items-start">
            <h1 className="flex items-center gap-2 font-bold text-3xl md:text-4xl">
                <SettingsIcon className="w-6 h-6"/>
                Settings
            </h1>
        </div>

        <div className="grid gap-10">
            <UserNameForm user={{
                // @ts-ignore
                id:session.user.id,
                // @ts-ignore
                username:session.user.username||''
            }

            }/>
        </div>
    </div>
  )
}
