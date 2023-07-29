
import { Separator } from "@/components/ui/separator"
import CreateNewCommunity from "@/components/CreateNewPost"
import { Metadata } from "next"

export const metadata:Metadata={
    title:'Create community',
    description:'Create a new community and start posting...',
    creator:'Suc-it'
}

export default function Page() {

    return (
        <div className="container flex items-center h-full max-w-3xl m-auto">
            <div className="flex h-full w-full  flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Create a new Suc</h1>
                </div>

                <Separator />
                <CreateNewCommunity/>
            </div>
        </div>
    )
}