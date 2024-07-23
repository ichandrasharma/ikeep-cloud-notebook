const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/ikeep"

const connectToMongo = () => {
    mongoose.connect(mongoURI)
    console.log("Connection successful");
}

module.exports = connectToMongo;