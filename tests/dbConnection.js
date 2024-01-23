const mongoose = require('mongoose');


const connectDatabase = async () => {
    const DB_URL = (process.env.DB_URL || 'mongodb://localhost/test');
    console.log("Connecting to db for tests: %s", DB_URL)

    await mongoose.connect(DB_URL)
    const db = mongoose.connection
    console.log("Connected to db to tests")
};

const closeDatabase = async () => {
    await mongoose.connection.close();
};

module.exports = { connectDatabase, closeDatabase };
