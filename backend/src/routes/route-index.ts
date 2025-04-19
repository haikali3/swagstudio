import { Router } from "express";
import captionRouter from "../routes/image/caption-image.route";
import generateRouter from "../routes/image/generate-image.route";
import editRouter from "../routes/image/edit-image.route";

const router = Router();

router.use("/caption-image", captionRouter);
router.use("/generate-image", generateRouter);
router.use("/edit-image", editRouter);

export default router;
