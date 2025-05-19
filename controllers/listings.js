const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const Listing = require('../models/listing');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
}


module.exports.showListings=async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const list = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!list) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
}

module.exports.createListing= async (req, res) => {
    let response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();
   

    let url = req.file.path;
    let filename= req.file.filename;
    console.log(url ,"    ",filename);
    const newListing = new Listing(req.body.listing);
    newListing.image ={filename,url};
    newListing.owner =req.user._id;
    newListing.geometry=response.body.features[0].geometry;
   let savedlist= await newListing.save();
//    console.log(savedlist);
    req.flash("sucess","New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error","Listing you requersted for dose not exist!");
        res.redirect("/listings");
    }

    let orig= list.image.url;
    orig=orig.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { list,orig });
}

module.exports.updatingListing =async (req, res) => {
    const { id } = req.params;
    let newListing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename= req.file.filename;
    newListing.image ={filename,url};
    await newListing.save();
    }
    req.flash("sucess", "Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing= async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("sucess","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}

// const Listing = require('../models/listing'); // adjust path if needed

module.exports.searchListing = async (req, res) => {
  const { name } = req.query;
//   console.log(name)
  if (!name) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings"); 
  }
  
  // Case-insensitive search
const listing = await Listing.findOne({ title: new RegExp(name, 'i') });

//   console.log(listing)
  if (!listing) {
    req.flash("error","Listing dose not exist!");
   return res.redirect("/listings");  }

  // Redirect to the listing's detail page
  res.redirect(`/listings/${listing._id}`);
};
module.exports.getSpacility = async(req, res ,next) => {  
    const { speciality } = req.params;  
    // console.log(speciality);
    const allListings = await Listing.find({ speciality });
    res.render("listings/speciality", { allListings, speciality });

};
