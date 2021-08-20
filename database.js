const mongoose = require("mongoose");

function getConnection() {
    function connect(uri) {

        return mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }, err => console.log(err || "Mongodb connected successfully"))
    }
    return { connect }
}
module.exports = getConnection();