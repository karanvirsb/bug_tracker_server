import express from "express";
const router = express.Router();
import { handleRefreshToken } from "../Controllers/refreshTokenController";

router.get("/", handleRefreshToken);

export default router;
