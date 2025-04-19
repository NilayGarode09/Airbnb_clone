const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// Define schema
const userSchema = new mongoose.Schema({
    // email :{
    //     type:String,
    //     required:true,
    // },
    email: { 
        type: String,
        required: true,
    },
});
// Plug in passport-local-mongoose to the schema
userSchema.plugin(passportLocalMongoose);
// Create the model from the schema
// Export the model
module.exports=mongoose.model("User", userSchema);
 