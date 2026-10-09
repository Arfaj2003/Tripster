const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tripster_DEV",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
// const upload = multer({ storage });
// And your .env would contain:

// CLOUDINARY_CLOUD_NAME=your_cloud_name
// CLOUDINARY_KEY=your_api_key
// CLOUDINARY_SECRET=your_api_secret
