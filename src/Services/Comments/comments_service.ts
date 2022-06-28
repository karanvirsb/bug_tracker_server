import { Model } from "mongoose";
import { commentType } from "../../Model/Comments";

const createComment =
    (Comments: typeof Model<commentType>) =>
    async (commentInfo: commentType): Promise<{}> => {
        const comment = new Comments(commentInfo);
        return await comment.save();
    };

const updateComment =
    (Comments: typeof Model<commentType>) => async (commentId: String, updates: {}) => {
        const updatedComment = await Comments.updateOne(
            { commentId: commentId },
            updates
        );
        // checking if it was updated and matched one
        return updatedComment.acknowledged && updatedComment.matchedCount === 1; 
    };

const updateReply = async (
    commentId: String,
    replyId: String,
    Comments: typeof Model<commentType>
) => {
    /* 
    * adds reply to a comment 
    */
    const comment = await Comments.findOne({
        commentId: commentId,
    }).exec();

    // getting the reply arr to store id
    const reply: String[] = comment?.reply || [];
    reply.push(replyId);

    const updatedComment = await Comments.updateOne(
        { commentId: commentId },
        { reply: reply }
    ).exec();

    return updatedComment.acknowledged && updatedComment.matchedCount === 1;
};

const deleteComment = (Comments: typeof Model<commentType>) => async (commentId: String) => {
    const deletedComment = await Comments.deleteOne({
        commentId: commentId,
    }).exec();
    return deletedComment.acknowledged && deletedComment.deletedCount === 1;
};

const getComment = (Comments: typeof Model<commentType>) => async (commentInfo: {filter: "commentId", val: string}) => {
    return await Comments.findOne({
        [commentInfo.filter]: commentInfo.val,
    }).exec();
};

const replyTo =
    (Comments: typeof Model<commentType>) => async (commentId: String, commentInfo: commentType) => {
        /*
 * adds commentID to comment for a reply
 */
        const comment = new Comments(commentInfo);
        const foundComment = await Comments.findOne({commentId: commentId});
        // if the original comment isnt found return false
        if(!foundComment) return false;

        const createdComment = await comment.save();
        if (!createdComment) return false;

        // update reply with the replyid
        await updateReply(
            commentId,
            createdComment.commentId,
            Comments
        );

        const updatedComment = await Comments.findOne({
            commentId: commentId,
        }).exec();

        return updatedComment;
    };

const getReplyIds = (Comments: typeof Model<commentType>) => async (commentId: String) => {
    const replys = await Comments.findOne(
        { commentId: commentId },
        `reply`
    ).exec();
    return replys;
};

const getAllComments = (Comments: typeof Model<commentType>) => async (replyArr: string[]) => {
    const commentsArr = [];
    for (let i = 0; i < replyArr.length; i++) {
        const replyId = replyArr[i];
        const comment = await Comments.findOne({ commentId: replyId }).exec();
        commentsArr.push(comment);
    }

    return commentsArr;
};

export default (Comment: typeof Model<commentType>) => {
    return {
        createComment: createComment(Comment),
        deleteComment: deleteComment(Comment),
        updateComment: updateComment(Comment),
        getComment: getComment(Comment),
        replyTo: replyTo(Comment),
        getReplyIds: getReplyIds(Comment),
        getAllComments: getAllComments(Comment),
    };
};
