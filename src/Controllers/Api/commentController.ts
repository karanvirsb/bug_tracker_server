import { NextFunction, Request, Response } from "express";

import CommentService from "../../Services/Comments";
import { IComment, commentType } from "../../Model/Comments";
import { ZodError } from "zod";
import generate from "../../Helper/generateId";

const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let { commentId, userId, ticketId, comment } = req.body;

    try {
        // checking to see if the id exists
        if (!commentId) {
            // generating and finding comment
            let generatedId = await generate();
            let foundComment: commentType | null =
                await CommentService.getComment({
                    filter: "commentId",
                    val: generatedId,
                });
            // while comment does not exist keep generating
            while (foundComment) {
                generatedId = await generate();
                foundComment = await CommentService.getComment({
                    filter: "commentId",
                    val: generatedId,
                });
            }
            commentId = generatedId;
        }

        // checking if the comment is correct
        await IComment.parseAsync({ commentId, userId, ticketId, comment });
        const createdComment = await CommentService.createComment({
            commentId,
            userId,
            ticketId,
            comment,
        });
        if (createdComment) return res.sendStatus(200);

        // if comment wasnt created successfully
        res.sendStatus(204);
    } catch (error) {
        if (error instanceof ZodError)
            return res.status(400).json({ message: error.message });
        next(error);
    }
};
const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { commentId } = req.body;

    try {
        if (!commentId) throw Error("Invalid Id");
        // find comment
        const foundComment: commentType | null =
            await CommentService.getComment({
                filter: "commentId",
                val: commentId,
            });
        let deletedAll = true;
        // after found if it has replies purge all of them
        if (foundComment && foundComment.reply) {
            try {
                foundComment.reply.forEach(async (commentId) => {
                    await CommentService.deleteComment(commentId);
                });
            } catch (error) {
                console.log(
                    "🚀 ~ file: commentController.ts ~ line 72 ~ error",
                    error
                );
                deletedAll = false;
            }
        }
        // else delete the top level comment
        const deletedComment = await CommentService.deleteComment(commentId);
        let updatedTopLevelComment;
        // remove reply from other comment
        if (deletedComment) {
            const topLevelComment: commentType | null =
                await CommentService.getComment({
                    filter: "commentId",
                    val: foundComment?.repliedTo ?? "",
                });

            if (topLevelComment) {
                const replys = topLevelComment?.reply?.filter(
                    (id) => id !== commentId
                );
                updatedTopLevelComment = await CommentService.updateComment(
                    topLevelComment.commentId,
                    { reply: replys }
                );
            }
        }
        if (deletedComment && deletedAll && updatedTopLevelComment)
            return res.sendStatus(200);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { commentId, updates } = req.body;
    try {
        if (!commentId) throw Error("Invalid Id");
    } catch (err) {
        next(err);
    }

    const updatesKeys = Object.keys(updates);

    // checking if the update keys actually exist
    for (let i = 0; i < updatesKeys.length; i++) {
        if (!IComment._getCached().keys.includes(updatesKeys[i])) {
            return res.status(400).json({
                message: `Update property ${updatesKeys[i]} does not exist`,
            });
        }
    }

    try {
        const updatedComment = await CommentService.updateComment(
            commentId,
            updates
        );

        if (updatedComment) return res.sendStatus(200);
        res.sendStatus(204); // if unsuccessful
    } catch (error) {
        next(error);
    }
};

const getComment = async (req: Request, res: Response, next: NextFunction) => {
    const { filterValue, filter } = req.body;
    try {
        if (!filterValue) throw Error("Invalid filter");
        const comment: commentType | null = await CommentService.getComment({
            filter: filter ?? "commentId",
            val: filterValue,
        });

        if (comment) return res.status(200).json(comment);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
const replyTo = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId, reply } = req.body;
    try {
        if (!commentId) throw Error("Invalid Id");
        // checking to see if the id exists
        if (!reply.commentId) {
            // generating and finding comment
            let generatedId = await generate();
            let foundComment: commentType | null =
                await CommentService.getComment({
                    filter: "commentId",
                    val: generatedId,
                });
            // while comment exists keep generating
            while (foundComment) {
                generatedId = await generate();
                foundComment = await CommentService.getComment({
                    filter: "commentId",
                    val: generatedId,
                });
            }
            reply.commentId = generatedId;
        }
        // parse the comment to make sure its up to standards
        await IComment.parseAsync(reply);

        const comment = await CommentService.replyTo(commentId, reply);

        if (comment) return res.sendStatus(200);
        res.sendStatus(410);
    } catch (error) {
        next(error);
    }
};

const getCommentsByTicketId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const page: any = req.query.page;
    const limit: any = req.query.limit || 10;
    try {
        const comments = await CommentService.getCommentsByTicketId({
            ticketId: id,
            page: parseInt(page),
            limit: parseInt(limit),
        });

        if (comments) return res.status(200).json(comments);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const getAllComments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { replyIdArr } = req.body;

    try {
        const comments = await CommentService.getAllComments(replyIdArr);

        if (comments) return res.status(200).json(comments);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    replyTo,
    getAllComments,
    getCommentsByTicketId,
};
