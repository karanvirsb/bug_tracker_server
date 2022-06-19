import { Schema, model } from "mongoose";

interface IComment {
    commentId: String;
    dateCreated: Date;
    userId: String;
    ticketID: String;
    comment: String;
    reply?: String;
}

const commentSchema = new Schema<IComment>({
    commentId: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
    userId: { type: String },
    ticketID: { type: String },
    comment: { type: String },
    reply: { type: String },
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

async function deleteComment(commentId: String) {
    try {
        const deletedComment = await Comments.deleteOne({
            commentId: commentId,
        });
        return deletedComment.acknowledged;
    } catch (err) {
        return false;
    }
}

async function getComment(commentInfo: { filter: string; attribute: string }) {
    try {
        return await Comments.find({
            [commentInfo.filter]: commentInfo.attribute,
        });
    } catch (err) {
        return [];
    }
}

export = { Comments };
