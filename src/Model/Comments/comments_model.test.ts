export {};
var mongoose = require("mongoose");
var mongoDb = "mongodb://127.0.0.1:27017/bugTracker_test";
mongoose.connect(mongoDb);
const Comments = require("./index.ts");

describe("Comment Model Test", () => {
    // before all clear db
    beforeAll(async () => {
        await Comments.remove({});
    });

    afterEach(async () => {
        await Comments.remove({});
    });

    // disconnect
    afterAll(async () => {
        await Comments.remove({});
        await mongoose.disconnect();
    });

    it("has a module", () => {
        expect(Comments).toBeDefined();
    });

    test("Create Comment", async () => {
        const comment = new Comments({
            commentId: "1",
            dateCreated: "09/25/00",
            userId: "2",
            ticketID: "3",
            comment: "This is a test",
        });
        const savedComment = await comment.save();

        const expectedCommentId = "1";
        const actualCommentId = savedComment.commentId;
        expect(actualCommentId).toBe(expectedCommentId);
    });

    test("Get Comment", async () => {
        const comment = new Comments({
            commentId: "1",
            dateCreated: "09/25/00",
            userId: "2",
            ticketId: "3",
            comment: "This is a test",
        });
        await comment.save();

        const foundComment = await Comments.findOne({
            commentId: "1",
        });

        const expectedTicketId = "3";
        const actualTicketId = foundComment.ticketId;

        expect(actualTicketId).toBe(expectedTicketId);
    });

    test("Update Comment", async () => {
        const comment = new Comments({
            commentId: "1",
            dateCreated: "09/25/00",
            userId: "2",
            ticketId: "3",
            comment: "This is a test",
        });
        await comment.save();

        await Comments.updateOne(
            {
                commentId: "1",
            },
            { comment: "This was a success" }
        );

        const foundComment = await Comments.findOne({
            commentId: "1",
        });

        const expectedComment = "This was a success";
        const actualComment = foundComment.comment;

        expect(actualComment).toBe(expectedComment);
    });

    test("Deleting comment", async () => {
        const comment = new Comments({
            commentId: "1",
            dateCreated: "09/25/00",
            userId: "2",
            ticketId: "3",
            comment: "This is a test",
        });
        await comment.save();

        await Comments.deleteOne({ commentId: "1" });

        const foundComment = await Comments.findOne({ commentId: "1" });

        const expected = null;
        const actual = foundComment;

        expect(actual).toBe(expected);
    });

    test("Adding reply to another comment", async () => {
        const comment = new Comments({
            commentId: "1",
            dateCreated: "09/25/00",
            userId: "2",
            ticketId: "3",
            comment: "This is a test",
        });
        await comment.save();

        const comment2 = new Comments({
            commentId: "2",
            dateCreated: "09/25/00",
            userId: "3",
            ticketId: "4",
            comment: "This is a reply",
        });
        await comment2.save();

        await Comments.updateOne({ commentId: "1" }, { reply: ["2"] });
        const reply = await Comments.findOne({ commentId: "1" });

        const expectedReplyComment = "This is a reply";
        const actualReplyComment = (
            await Comments.findOne({
                commentId: reply.reply[0],
            })
        ).comment;

        expect(actualReplyComment).toBe(expectedReplyComment);
    });
});
