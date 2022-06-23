const CommentService = require("./comments_service");
const Comments = require("../../Model/Comments");
import { IComment } from "../../Model/Comments";
// const sinon = require("sinon");
export {};
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_serviceTest";
mongoose.connect(mongodb);

describe("CommentService tests", () => {
    beforeAll(async () => {
        await Comments.remove({});
    });

    afterAll(async () => {
        await Comments.remove({});
        await mongoose.disconnect();
    });

    it("has been defined", () => {
        expect(CommentService).toBeDefined();
        expect(Comments).toBeDefined();
    });

    const commentData: IComment[] = [
        {
            commentId: "1",
            userId: "1",
            ticketId: "1",
            comment: "I think you should do this ...",
        },
        {
            commentId: "2",
            userId: "2",
            ticketId: "2",
            comment: "I think it should be ...",
        },
    ];

    test("create comment", async () => {
        const commentService = CommentService(Comments);
        const createdComment = await commentService.createComment(
            commentData[0]
        );
        const expectedComment = commentData[0];
        const actualComment = createdComment;

        expect(actualComment).toMatchObject(expectedComment);
    });

    test("update comment", async () => {
        const commentService = CommentService(Comments);
        const updatedComment = await commentService.updateComment(
            commentData[0].commentId,
            {
                comment: "I think you should have done ...",
            }
        );

        expect(updatedComment).toBe(true);
    });

    test("Getting comment", async () => {
        const commentService = CommentService(Comments);
        const foundComment = await commentService.getComment(
            "commentId",
            commentData[0].commentId
        );

        expect(foundComment.comment).toBe("I think you should have done ...");
    });

    test("replying to a comment", async () => {
        const commentService = CommentService(Comments);
        const addedReply = await commentService.replyTo(
            commentData[0].commentId,
            commentData[1]
        );

        expect(addedReply.reply).toStrictEqual(["2"]);
    });

    test("Getting reply Ids", async () => {
        const commentService = CommentService(Comments);
        const replys = await commentService.getReplyIds(
            commentData[0].commentId
        );
        expect(replys.reply).toStrictEqual(["2"]);
    });

    test("Get reply comments", async () => {
        const commentService = CommentService(Comments);
        const replys = await commentService.getAllComments(["2"]);
        expect(replys[0].commentId).toBe(commentData[1].commentId);
    });

    test("deleting comment", async () => {
        const commentService = CommentService(Comments);
        const deletedComment = await commentService.deleteComment(
            commentData[0].commentId
        );

        expect(deletedComment).toBe(true);
    });
});
