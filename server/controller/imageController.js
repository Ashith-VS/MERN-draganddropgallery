const Imgcollection=require('../model/imageModel')

const uploadSingleImage = async (req, res) => {
  try {
    const { path, filename } = req.file;
    const newImage = new Imgcollection({ path, filename });
    await newImage.save();
    res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const uploadMultipleImages = async (req, res) => {
  try {
    const files = req.files;
    const newImages = files.map(file => ({
      path: file.path,
      filename: file.filename
    }));
    await Imgcollection.insertMany(newImages);
    res.status(200).json({ message: "Multiple images upload successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await Imgcollection.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

const deleteSingleImage=async (req, res) => {
try {
  const { id } = req.params;
  await Imgcollection.findByIdAndDelete(id)
  res.status(200).json({ message: "Image deleted successfully" });
} catch (error) {
  console.error(error)
  res.status(500).json({ message: "Error deleting"});
}
}

module.exports ={uploadSingleImage,getAllImages,deleteSingleImage,uploadMultipleImages}