import express from "express";
const router = express.Router();
import { handleNewUser } from "../Controllers/registerController";

router.post("/", handleNewUser);

export default router;
