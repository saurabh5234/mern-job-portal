import mongoose from "mongoose";

export const connection = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            dbName: "JOB_PORTAL_WITH_AUTHENTICATION",
        })
        .then(() => {
            console.log("Connected to the database successfully");
        })
        .catch((err) => {
            console.error(`An error occurred while connecting to the database: ${err.message}`);
        });
};
