import express from "express";

import chatRoute from "./chat.route.js";

const router = express.Router();


router.use("/chats", chatRoute);

export default router;