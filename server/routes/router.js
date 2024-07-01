const express = require("express");
const { uploadSingleImage, getAllImages,deleteSingleImage, uploadMultipleImages } = require("../controller/imageController");
const upload=require('../middleware/upload')

const router = express.Router();

router.post("/singleimg", upload.single("avatar"),uploadSingleImage );
router.post("/multipleimg",upload.array("photos"),uploadMultipleImages)
router.get("/allimages", getAllImages);
router.delete("/singleimg/:id", deleteSingleImage);

module.exports = router;
