import { Router } from "express";
import moodControllers from "../controllers/moodController";
import passport from "passport";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  moodControllers.mood_list
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  moodControllers.mood_post
);

router.get(
  "/:entryId",
  passport.authenticate("jwt", { session: false }),
  moodControllers.mood_detail
);

router.get(
  "/monthly/:year",
  passport.authenticate("jwt", { session: false }),
  moodControllers.moods_monthly
);

router.delete(
  "/:entryId",
  passport.authenticate("jwt", { session: false }),
  moodControllers.mood_delete_post
);

export default router;
