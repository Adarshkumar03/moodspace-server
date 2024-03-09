import {Router} from "express";
import moodControllers from "../controllers/moodController";

const router = Router();

router.get("/", moodControllers.mood_list);

router.post("/", moodControllers.mood_post);

router.get("/:entryId", moodControllers.mood_detail);

router.delete("/:entryId", moodControllers.mood_delete_post);

export default router;