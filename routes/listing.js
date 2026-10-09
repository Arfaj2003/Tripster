const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { populate } = require("../models/user.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn("Please log in to add a new listing."),
  upload.single("listing[image]"), // multer processing for image
  validateListing,
  wrapAsync(listingController.createListing),
);

// New Route
router.get(
  "/new",
  isLoggedIn("Please log in to add a new listing."),
  listingController.renderNewForm,
);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn("Please log in to update listing."),
    isOwner,
    upload.single("listing[image]"), // multer processing for image
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(
    isLoggedIn("Please log in to delete listing."),
    isOwner,
    wrapAsync(listingController.deleteListing),
  );

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn("Please log in to edit listing."),
  isOwner,
  wrapAsync(listingController.editListing),
);

module.exports = router;
