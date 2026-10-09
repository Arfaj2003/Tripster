require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN,
});

main()
  .then(() => {
    console.log("Connected to DB");
    return initDB();
  })
  .then(() => {
    console.log("Data was initialized successfully");
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tripster");
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listingsWithGeometry = [];

  for (const obj of initData.data) {
    const response = await geocodingClient
      .forwardGeocode({
        query: `${obj.location}, ${obj.country}`,
        limit: 1,
      })
      .send();

    if (response.body.features.length === 0) {
      console.log(`Location not found: ${obj.location}`);
      continue;
    }

    listingsWithGeometry.push({
      ...obj,
      owner: "6ac5ebe0a3e8caeedca6531c",
      geometry: response.body.features[0].geometry,
    });
  }

  await Listing.insertMany(listingsWithGeometry);
};
