import express from "express";
import auth from "./auth.routes.js";
import user from "./user.routes.js";
import room from "./room.routes.js";
const router = express.Router({ mergeParams: true });
router.use("/auth", auth);
router.use("/user", user);
router.use("/room", room);
export default router;
//# sourceMappingURL=index.js.map