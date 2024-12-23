const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/venturevista";

main()
    .then(() => {
        console.log("Connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongoUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    const dataWithOwner = initData.data.map((obj) => ({ ...obj, owner: "67667f7c183d0ca4df1813a0" }));
    await Listing.insertMany(dataWithOwner);
    console.log("Data was initialized");
};

initDB();
