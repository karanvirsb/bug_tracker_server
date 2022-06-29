import express from "express";
const router = express.Router();
import { handleLogin } from "../Controllers/authController";

router.post("/", handleLogin);

export default router;
