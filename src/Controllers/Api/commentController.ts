import { NextFunction, Request, Response } from "express";

import CommentService from "../../Services/Comments";
import { IComment, commentType } from "../../Model/Comments";
import { ZodError } from "zod";

const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { commentId, userId, ticketId, comment } = req.body;

    try {
        await IComment.parseAsync({ commentId, userId, ticketId, comment });
        const createdComment = await CommentService.createComment({
            commentId,
            userId,
            ticketId,
            comment,
        });
        if (createdComment) return res.sendStatus(200);
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
        const deletedComment = await CommentService.deleteComment(commentId);

        if (deletedComment) return res.sendStatus(200);
        res.sendStatus(502);
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
        const updatedComment = await CommentService.updateComment(
            commentId,
            updates
        );

        if (updatedComment) return res.sendStatus(200);
        res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};

const getComment = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.id;

    try {
        const comment = await CommentService.getComment("commentId", commentId);

        if (comment) return res.status(200).json(comment);
        res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const replyTo = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId, reply } = req.body;

    try {
        const comment = await CommentService.replyTo(commentId, reply);

        if (comment) return res.sendStatus(200);
        res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};

// questionable may not be needed
const getReplyIds = async () => {};
const getAllComments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, replyIdArr } = req.body;

    try {
        const comments = await CommentService.replyTo(id, replyIdArr);

        if (comments) return res.status(200).json(comments);
        res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    replyTo,
    getReplyIds,
    getAllComments,
};
