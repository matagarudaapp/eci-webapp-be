const { Router } = require("express");
const multer = require("multer");
const videoResultController = require("../controllers/videoResultController");

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/videoResults", videoResultController.videoResults_get);
router.get("/videoResults/:id", videoResultController.videoResult_get);
router.patch(
  "/videoResults/:id",
  upload.single("file"),
  videoResultController.videoResult_patch
);
router.post(
  "/initiateVideoResultRecord",
  videoResultController.initateVideoResultRecord_post
);

router.get("/:id/analysis", videoResultController.videoResultAnalysis);
module.exports = router;
