const { Router } = require("express");
const videoResultController = require("../controllers/videoResultController");
const router = Router();
const multerMemoryStorage = require("../middlewares/multerMiddleware").memoryStorage;

router.get("/videoResults", videoResultController.videoResults_get);
router.get("/videoResults/:id", videoResultController.videoResult_get);
router.patch(
  "/videoResults/:id",
  multerMemoryStorage.single("file"),
  videoResultController.videoResult_patch
);
router.post(
  "/initiateVideoResultRecord",
  videoResultController.initateVideoResultRecord_post
);

router.get("/:id/analysis", videoResultController.videoResultAnalysis);
router.post("/uploadPicture", multerMemoryStorage.single("file"), videoResultController.uploadPhoto_post);
module.exports = router;
