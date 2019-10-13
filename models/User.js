/**
let mongoose = require('mongoose');

mongoose.connect('mongodb+srv://arcab-new:admin123@cluster0-wyosa.mongodb.net/test?retryWrites=true');

let UserSchema = mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	phone_number: String,
	date: String
});

let User = mongoose.model('user', UserSchema);

module.exports = User;
 */