'use client'

import { ReactNode, useState } from "react"
import { Button } from "./ui/Button"

interface CommentRepliesProps {
    children: React.ReactNode,
}

export default function CommentReplies({ children }: CommentRepliesProps) {

    const [showReplies, setShowReplies] = useState<boolean>(false)
    return (
        <div className="pl-4">
            <Button className="text-sm font-light" variant={'link'} size={'xs'} onClick={() => setShowReplies(!showReplies)}>
                {!showReplies ? 'show replies' : 'hide replies'}
            </Button>
            <div>
                {showReplies ? children : null}
            </div>
        </div>
    )
}
