import express from "express";
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors"
import {connection} from "./database/connection.js"
import { errorMiddleware } from './middlewares/error.js';
import fileUpload from 'express-fileupload';
import userRouter from "./router/userRouter.js";
import jobRouter from "./router/jobRouter.js";
import applicationRouter from "./router/applicationRouter.js";
import {newsLetterCron} from "./automation/newsLetterCron.js";


const app = express();
config({path:"./config/config.env"});

console.log("FRONTEND_URI", process.env.FRONTEND_URI);

app.use(
    cors(
        {
            origin: [process.env.FRONTEND_URI,process.env.FRONTEND_URI2],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
         
        }
    )
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(  
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

newsLetterCron();
connection();
app.use(errorMiddleware)

export default app;