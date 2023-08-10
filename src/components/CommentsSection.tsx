import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Separator } from "./ui/separator"
import PostComment from "./PostComment"
import CreateComment from "./CreateComment"
import { Button } from "./ui/Button"
import CommentReplies from "./CommentReplies"

interface CommentsSectionProps {
    postId: string
}

export default async function CommentsSection({ postId }: CommentsSectionProps) {
    const session = await getAuthSession()
    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null,
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true,
                }
            }
        }
    })

    return (
        <div className="flex flex-col gap-y-4">
            <Separator className="my-6" />

            {/* create comment */}
            <CreateComment postId={postId}/>

            <div className="flex flex-col gap-y-6 mt-4">
                {comments
                    .filter((comment) => !comment.replyToId)
                    .map((topLevelComment) => {
                        const topLevelCommentVotesAmount = topLevelComment.votes.reduce((acc, vote) => {
                            if (vote.type === "UP") return acc + 1
                            if (vote.type === "DOWN") return acc - 1
                            return acc
                        }, 0)

                        const topLevelCommentVote = topLevelComment.votes.find(
                            // @ts-ignore
                            (vote) => vote.userId === session?.user.id
                        )

                        return (
                            <div key={topLevelComment.id} className="flex flex-col">
                                <div className="mb-2">
                                    <PostComment
                                        postId={postId}
                                        currentVote={topLevelCommentVote}
                                        votesAmount={topLevelCommentVotesAmount}
                                        comment={topLevelComment}
                                    />
                                </div>

                                {topLevelComment.replies.length>0 ? (
                                    <CommentReplies>
                                        {topLevelComment.replies
                                            .sort((a, b) => b.votes.length - a.votes.length)
                                            .map((reply) => {

                                                const replyVotesAmount = reply.votes.reduce((acc, vote) => {
                                                    if (vote.type === "UP") return acc + 1
                                                    if (vote.type === "DOWN") return acc - 1
                                                    return acc
                                                }, 0)

                                                const replyVote = reply.votes.find(
                                                    // @ts-ignore
                                                    (vote) => vote.userId === session?.user.id
                                                )

                                                return (
                                                    <div key={reply.id} className="relative gap-2 py-2 border-l-2">
                                                        <PostComment
                                                            className="relative -left-3 pt-4"
                                                            comment={reply}
                                                            postId={postId}
                                                            votesAmount={replyVotesAmount}
                                                            currentVote={replyVote}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </CommentReplies>
                                ) : null}

                            </div>
                        )
                    })}
            </div>
        </div>
    )
}
