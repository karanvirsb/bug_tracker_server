import { NextFunction, Request, Response } from "express";

export {};
const CommentService = require("../Services/Comments");

const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { commentId, userId, ticketId, comment } = req.body;

    try {
        const createdComment = await CommentService.createComment({
            commentId,
            userId,
            ticketId,
            comment,
        });
        if (createdComment) return res.sendStatus(200);
        res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const deleteComment = async () => {};
const updateComment = async () => {};
const getComment = async () => {};
const replyTo = async () => {};

// questionable may not be needed
const getReplyIds = async () => {};
const getAllComments = async () => {};

module.exports = {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    replyTo,
    getReplyIds,
    getAllComments,
};
