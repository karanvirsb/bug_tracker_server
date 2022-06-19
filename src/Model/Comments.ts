const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    commentId: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
    userId: { type: String },
    ticketID: { type: String },
    comment: { type: String },
    reply: { type: String },
});

const Comments = mongoose.model("Comments", commentSchema);

export = { Comments };
