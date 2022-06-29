import express from "express";
const router = express.Router();
import { handleLogout } from "../Controllers/logoutController";

router.delete("/", handleLogout);

export default router;
