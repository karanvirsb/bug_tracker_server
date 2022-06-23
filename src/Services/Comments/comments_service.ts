import { IComment } from "../../Model/Comments";

const createComment =
    (Comments: any) =>
    async (commentInfo: IComment): Promise<{}> => {
        const comment = new Comments(commentInfo);
        return await comment.save();
    };

const updateComment =
    (Comments: any) => async (commentId: String, updates: {}) => {
        const updatedComment = await Comments.updateOne(
            { commentId: commentId },
            updates
        );
        return updatedComment.acknowledged;
    };

const updateReply = async (
    commentId: String,
    replyId: String,
    Comments: any
) => {
    const comment = await Comments.findOne({
        commentId: commentId,
    }).exec();

    const reply: String[] = comment?.reply || [];
    reply.push(replyId);

    const updatedComment = await Comments.updateOne(
        { commentId: commentId },
        { reply: reply }
    );

    return updatedComment.acknowledged;
};

const deleteComment = (Comments: any) => async (commentId: String) => {
    const deletedComment = await Comments.deleteOne({
        commentId: commentId,
    }).exec();
    return deletedComment.acknowledged;
};

const getComment = (Comments: any) => async (filter: string, val: string) => {
    return await Comments.findOne({
        [filter]: val,
    }).exec();
};

const replyTo =
    (Comments: any) => async (commentId: String, commentInfo: IComment) => {
        const comment = new Comments(commentInfo);
        const createdComment = await comment.save();
        if (!createdComment) return false;

        const updatedComment = await updateReply(
            commentId,
            createdComment.commentId,
            Comments
        );

        return updatedComment;
    };

const getReplyIds = (Comments: any) => async (commentId: String) => {
    const replys = await Comments.find(
        { commentId: commentId },
        `reply`
    ).exec();
    return replys;
};

const getAllComments = (Comments: any) => async (replyArr: []) => {
    const commentsArr = [];
    for (let i = 0; i < replyArr.length; i++) {
        const replyId = replyArr[i];
        const comment = await Comments.getComment({
            filter: "commentId",
            attribute: replyId,
        });
        commentsArr.push(comment[0]);
    }

    return commentsArr;
};

module.exports = (Comment: any) => {
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
