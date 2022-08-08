import mongoose from "mongoose";
import { commentType } from "../../Model/Comments";

const createComment =
    (Comments: mongoose.PaginateModel<commentType>) =>
    async (commentInfo: commentType): Promise<{}> => {
        const comment = new Comments(commentInfo);
        return await comment.save();
    };

const updateComment =
    (Comments: mongoose.PaginateModel<commentType>) =>
    async (commentId: string, updates: { [key: string]: any }) => {
        const updatedComment = await Comments.updateOne(
            { commentId: commentId },
            updates
        );
        // checking if it was updated and matched one
        return updatedComment.acknowledged && updatedComment.matchedCount === 1;
    };

const updateReply = async (
    commentId: string,
    replyId: string,
    Comments: mongoose.PaginateModel<commentType>
) => {
    /*
     * adds reply to a comment
     */
    const comment = await Comments.findOne({
        commentId: commentId,
    }).exec();

    // getting the reply arr to store id
    const reply: string[] = comment?.reply || [];
    reply.push(replyId);

    const updatedComment = await Comments.updateOne(
        { commentId: commentId },
        { reply: reply }
    ).exec();

    return updatedComment.acknowledged && updatedComment.matchedCount === 1;
};

const deleteComment =
    (Comments: mongoose.PaginateModel<commentType>) =>
    async (commentId: string) => {
        const deletedComment = await Comments.deleteOne({
            commentId: commentId,
        }).exec();
        return deletedComment.acknowledged && deletedComment.deletedCount === 1;
    };

const getComment =
    (Comments: mongoose.PaginateModel<commentType>) =>
    async (commentInfo: { filter: "commentId"; val: string }) => {
        return Comments.findOne({
            [commentInfo.filter]: commentInfo.val,
        }).exec();
    };

const replyTo =
    (Comments: mongoose.PaginateModel<commentType>) =>
    async (commentId: string, commentInfo: commentType) => {
        /*
         * adds commentID to comment for a reply
         */
        const comment = new Comments(commentInfo);
        const foundComment: commentType | null = await Comments.findOne({
            commentId: commentId,
        });
        // if the original comment isnt found return false
        if (!foundComment) return false;

        const createdComment = await comment.save();
        if (!createdComment) return false;

        // update reply with the replyid
        await updateReply(commentId, createdComment.commentId, Comments);

        // returning an updated comment
        return Comments.findOne({
            commentId: commentId,
        }).exec();
    };

const getReplyIds =
    (Comments: mongoose.PaginateModel<commentType>) =>
    async (commentId: string) => {
        // returning replys
        return Comments.findOne({ commentId: commentId }, `reply`).exec();
    };

const getAllComments =
    (Comments: mongoose.PaginateModel<commentType>) =>
    async (replyArr: string[]) => {
        const commentsArr = [];
        for (let i = 0; i < replyArr.length; i++) {
            // going through each reply id to get the comment
            const replyId = replyArr[i];
            const comment = await Comments.findOne({
                commentId: replyId,
            }).exec();
            commentsArr.push(comment);
        }

        return commentsArr;
    };

const getCommentsByTicketId =
    (Comments: mongoose.PaginateModel<commentType>) =>
    async ({
        ticketId,
        page,
        limit = 10,
    }: {
        ticketId: string;
        page: number;
        limit: number;
    }) => {
        return Comments.paginate(
            { ticketId: ticketId },
            { page: page, limit: limit }
        );
    };

export default (Comment: mongoose.PaginateModel<commentType>) => {
    return {
        createComment: createComment(Comment),
        deleteComment: deleteComment(Comment),
        updateComment: updateComment(Comment),
        getComment: getComment(Comment),
        replyTo: replyTo(Comment),
        getReplyIds: getReplyIds(Comment),
        getAllComments: getAllComments(Comment),
        getCommentsByTicketId: getCommentsByTicketId(Comment),
    };
};
