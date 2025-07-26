import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const isAuthenticated = catchAsyncError(async (req, _res, next) => {
    const { token } = req.cookies;

    console.log("Token in cookies:", token); // Debugging log

    if (!token) {
        return next(new ErrorHandler("User is not authenticated", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token", 401));
    }
});
 
export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `${req.user.role} not allowed to access this resource.`,
                    403
                )
            );
        }
        next();
    };
};