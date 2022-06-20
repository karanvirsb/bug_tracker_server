import { Schema, model } from "mongoose";

interface IComment {
    commentId: String;
    dateCreated: Date;
    userId: String;
    ticketID: String;
    comment: String;
    reply?: [];
}

const commentSchema = new Schema<IComment>({
    commentId: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
    userId: { type: String },
    ticketID: { type: String },
    comment: { type: String },
    reply: { type: [] },
});

const Comments = model<IComment>("Comments", commentSchema);

// FUNCTIONS

async function createComment(commentInfo: IComment): Promise<Boolean> {
    let comment = null;
    try {
        comment = (await Comments.create(commentInfo)) ? true : false;
    } catch (err) {
        return false;
    }
    return comment ? true : false;
}

async function updateComment(commentId: String, updates: {}) {
    try {
        const updatedComment = await Comments.updateOne(
            { commentId: commentId },
            updates
        );
        return updatedComment.acknowledged;
    } catch (err) {
        return false;
    }
}
async function updateReply(commentId: String, replyId: String) {
    try {
        const comment = await Comments.find({ commentId: commentId }).exec();
        const reply: String[] = comment[0].reply || [];
        reply.push(replyId);

        const updatedComment = await Comments.updateOne(
            { commentId: commentId },
            { reply: reply }
        );

        return updatedComment.acknowledged;
    } catch (err) {
        return false;
    }
}

async function deleteComment(commentId: String) {
    try {
        const deletedComment = await Comments.deleteOne({
            commentId: commentId,
        }).exec();
        return deletedComment.acknowledged;
    } catch (err) {
        return false;
    }
}

async function getComment(commentInfo: { filter: string; attribute: string }) {
    try {
        return await Comments.find({
            [commentInfo.filter]: commentInfo.attribute,
        }).exec();
    } catch (err) {
        return [];
    }
}

async function replyTo(commentId: String, commentInfo: IComment) {
    try {
        const createdComment = await createComment(commentInfo);
        if (!createdComment) return false;

        const updatedComment = await updateReply(
            commentId,
            commentInfo.commentId
        );

        return updatedComment;
    } catch (error) {
        return false;
    }
}

async function getAllReplys(commentId: String) {
    try {
        const replys = await Comments.find(
            { commentId: commentId },
            `reply`
        ).exec();
        return replys;
    } catch (error) {
        return {};
    }
}

async function getAllComments(replyArr: []) {
    try {
        const commentsArr = [];
        for (let i = 0; i < replyArr.length; i++) {
            const replyId = replyArr[i];
            const comment = await getComment({
                filter: "commentId",
                attribute: replyId,
            });
            commentsArr.push(comment[0]);
        }

        return commentsArr;
    } catch (error) {
        return {};
    }
}

export = {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    replyTo,
    getAllReplys,
    getAllComments,
};
