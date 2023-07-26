import Editor from "@/components/Editor"
import { Button } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        slug: string
    }
}



export default async function page({ params }: PageProps) {
    const subreddit = await db.subreddit.findFirst({
        where : {
            name : params.slug,
        }
    })

    if(!subreddit) return notFound()

    return (
    <div className="flex flex-col items-start gap-6">
        <div className="border-b pb-5">
            <div className="-ml-2 mt-2 flex flex-wrap items-baseline">
                <h1 className="-ml-2 mt-2 text-base font-semibold leading-6">
                    Create Post
                </h1>
                <p className="ml-2 mt-1 truncate text-sm ">
                    in r/{params.slug}
                </p>
            </div>
        </div>

        {/* form */}
        <Editor subredditId={subreddit.id}/>


    </div>
  )

}

