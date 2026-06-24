require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("./userModel");

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to MongoDB for seeding...");
    const existingAdmin = await userModel.findOne({ role: "admin" });
    if (existingAdmin) {
        console.log("Admin already exists:", existingAdmin.email);
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await userModel.create({
        email: "admin@edutrack.com",
        password: hashedPassword,
        role: "admin"
    });
    console.log("Admin user created successfully!");
    process.exit(0);
}).catch(err => {
    console.log("Error:", err);
    process.exit(1);
});
