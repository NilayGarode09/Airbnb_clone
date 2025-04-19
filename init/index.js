const mongoose=require("mongoose");
const initData =require("./data.js");
const Listings = require("../models/listings.js");

main().then(()=>{
    console.log("connected to DB")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');

}
const initDB =async ()=>{
    await Listings.deleteMany({});
    initData.data =initData.data.map((obj)=>({...obj,owner:"67ffc8f407cb2aa9166edeb3"}))
    await Listings.insertMany(initData.data);
    console.log("eklcece");
    
};
initDB();