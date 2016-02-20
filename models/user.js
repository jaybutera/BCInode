// Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Passport-local-mongoose
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema ({
    name : String,
    /*
    username : { type : String, required : true, unique : true },
    password : { type : String, required : true},
    */
    username : String,
    password : String,
    address : String,
    email : String,
    //meta : {
        firstName : String,
        lastName : String,
        age : Number,
        //website : String,
    //},
    profile_pic : {
        path : String,
        originalname : String,
        name : String,
        size : Number,
        contentType : String,
    },
    created_at : Date,
    updated_at : Date,
});

// Sets date parameters before saving to database
userSchema.pre ('save', function (next) {
    var currentDate = new Date();

    // Always update this date
    this.updated_at = currentDate;

    // If user was just created
    if ( !this.created_at )
        this.created_at = currentDate;

    next();

});

// Adds attributes to user model such as password hash and id
userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);

module.exports = User;
