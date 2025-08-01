 import mongoose from "mongoose";

 const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ["Full-time", "part-time"]
    },
    location: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true,
    },
    introduction: {
        type: String,
        required: true
    },
    responsibilities: {
        type: String,
        required: true,
    },
    qualifications: {
        type: String,
        required: true
    },
    offers: {
        type: String
    },
    salary: {
        type: String,
        required: true
    },
    hiringMultipleCandidates: {
        type: String,
        default: "No",
        enum: ["Yes", "No"]
    },
    personalWebsite: {
       title: String,
       url: String
    },
    jobNiche: {
        type: String,
        required: true
    },
    newsLettersSent : {
        type: Boolean,
        default: false
    },
    jobpostedon: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export default mongoose.model("Job", jobSchema);
