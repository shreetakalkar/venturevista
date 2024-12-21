const mongoose=require("mongoose");
const initData=require("./data.js");

const Listing = require("../models/listing.js");

mongoUrl="mongodb://127.0.0.1:27017/venturevista";


main().then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main()
{
    mongoose.connect(mongoUrl);

}

const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

};

initDB();