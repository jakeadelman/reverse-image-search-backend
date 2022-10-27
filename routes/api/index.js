import express from "express";
import basicRoutes from "./basicRoutes.js";
const router = express.Router();

router.use("/basic", basicRoutes);

export default router;
