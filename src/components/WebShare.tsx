'use client'
import { toast } from '@/hooks/use-toast'
import { WebShareRequest } from '@/lib/validators/webshare'
import { Post, User, Vote } from '@prisma/client'
import { Share2Icon } from 'lucide-react'
import { Button, buttonVariants } from './ui/Button'

interface WebShareProps {
  subredditName: string,
  post: (Post & {
    author: User,
    votes: Vote[]
  })| null ,
}

export default function WebShare({ subredditName, post }: WebShareProps) {

  const webShare = async ()=>{
    const payload: WebShareRequest = {
      title:`Check out this Post in /hub/${subredditName} on Hive`,
      url: `${window.location.origin}/hub/${subredditName}/post/${post?.id}`,
      text:`user ${post?.author.username} posted "${post?.title}" on the hub/${subredditName} on Hive. Check it out!`
    }
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${window.location.origin}/hub/${subredditName}/post/${post?.id}`);
        return toast({
          title:'Copied to clipboard',
        })
      } else {
        return toast({
          title:'Could not copy to clipboard',
          variant:'destructive'
        })
      }
    } catch (error) {
      return toast({
        title:'An unknown error occured :(',
        description:'Could not share this post or successfully copy it to clipboard',
        variant:'destructive'
      })
    }
  }




  return (
    <Button variant={'ghost'} onClick={webShare}>
      <Share2Icon className="h-4 w-5 cursor-pointer"/>
      <h1 className='hidden lg:flex font-semibold'>share</h1>
    </Button>
  )
}
