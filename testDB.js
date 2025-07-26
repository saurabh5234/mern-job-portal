import mongoose from "mongoose";
import User from "./models/userSchema.js";

mongoose.connect("your-mongo-uri", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB Connected");
}).catch(err => {
    console.error("Connection error:", err);
});

const createTestUser = async () => {
    try {
        const testUser = await User.create({
            name: "Test User",
            email: "test@example.com",
            phone: "1234567890",
            address: "123 Test Street",
            password: "password123",
            role: "Job Seeker",
            coverLetter: "Test Cover Letter",
            niches: {
                firstNiche: "Web Development",
                secondNiche: "UI/UX",
                thirdNiche: "AI",
            },
        });
        console.log("User created:", testUser);
    } catch (error) {
        console.error("Error creating user:", error);
    } finally {
        mongoose.connection.close();
    }
};

createTestUser();
