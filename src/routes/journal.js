import {Router} from "express";
import journalControllers from "../controllers/journalController";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("jwt", {session: false}),journalControllers.journal_list);

router.post("/", passport.authenticate("jwt", {session: false}), journalControllers.journal_post);

router.get("/:entryId", passport.authenticate("jwt", {session: false}), journalControllers.journal_detail);

router.delete("/:entryId", passport.authenticate("jwt", {session: false}), journalControllers.journal_delete_post);

export default router;