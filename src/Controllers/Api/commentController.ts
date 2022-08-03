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
            let foundComment = await CommentService.getComment({
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
    if (!commentId) throw Error("Invalid Id");

    try {
        const deletedComment = await CommentService.deleteComment(commentId);

        if (deletedComment) return res.sendStatus(200);
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
    if (!commentId) throw Error("Invalid Id");

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
    if (!filterValue) throw Error("Invalid parameter");
    try {
        const comment = await CommentService.getComment({
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
    if (!commentId) throw Error("Invalid Id");
    try {
        const comment = await CommentService.replyTo(commentId, reply);

        if (comment) return res.sendStatus(200);
        res.sendStatus(410);
    } catch (error) {
        next(error);
    }
};

// questionable may not be needed
const getReplyIds = async () => {};

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
    getReplyIds,
    getAllComments,
    getCommentsByTicketId,
};
