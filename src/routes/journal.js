import {Router} from "express";
import journalControllers from "../controllers/journalController";

const router = Router();

router.get("/", journalControllers.journal_list);

router.post("/", journalControllers.journal_post);

router.get("/:entryId", journalControllers.journal_detail);

router.delete("/:entryId", journalControllers.journal_delete_post);

export default router;