import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Balancer from 'react-wrap-balancer'
export default async function Home() {

  const session = await getAuthSession()

  return (
    <>
      <div className="font-bold text-3xl md:text-4xl">Feed</div>
      <div className="flex md:flex-row flex-col gap-y-4 md:gap-x-4 py-6">
      {/* @ts-expect-error server component */}
      {session?<CustomFeed/>:<GeneralFeed />}
        {/* subreddit info */}
        <div className="overflow-hidden h-fit rounded-lg border order-first md:order-last">
          <div className="select-none rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="w-6 h-6"/>
              Home
            </p>
          </div>

          <div className="-my-3 divide-y px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="flex w-full">
                <Balancer>
                  your own personalised suc-it . check out latest activity in your favourite suc communities
                </Balancer>
              </p>
            </div>

            <Link className={buttonVariants({className:'w-full mt-4 mb-6'})} href={'/r/create'}>
              Create Suc
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
