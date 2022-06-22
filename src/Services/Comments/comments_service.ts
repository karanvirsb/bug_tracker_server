import { IComment } from "../../Model/Comments";

const createComment =
    (Comments: any) =>
    async (commentInfo: IComment): Promise<{}> => {
        return await Comments.create(commentInfo).exec();
    };

const updateComment =
    (Comments: any) => async (commentId: String, updates: {}) => {
        const updatedComment = await Comments.updateOne(
            { commentId: commentId },
            updates
        );
        return updatedComment.acknowledged;
    };

const updateReply = async (commentId: String, replyId: String) => {
    const comment = await Comments.find({
        commentId: commentId,
    }).exec();
    const reply: String[] = comment[0].reply || [];
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

const getComment =
    (Comments: any) =>
    async (commentInfo: { filter: string; attribute: string }) => {
        return await Comments.find({
            [commentInfo.filter]: commentInfo.attribute,
        }).exec();
    };

const replyTo =
    (Comments: any) => async (commentId: String, commentInfo: IComment) => {
        const createdComment = await Comments.create(commentInfo).exec();
        if (!createdComment) return false;

        const updatedComment = await updateReply(
            commentId,
            commentInfo.commentId
        );

        return updatedComment;
    };

const getAllReplys = (Comments: any) => async (commentId: String) => {
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
        getAllReplys: getAllReplys(Comment),
        getAllComments: getAllComments(Comment),
    };
};
