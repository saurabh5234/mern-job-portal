import catchAsyncError from "../middlewares/catchAsyncError.js";
console.log(catchAsyncError); // Check if the function is correctly imported
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import pkg from "../../utils/jwtToken.js";
const { sendToken } = pkg;


export const register = catchAsyncError(async (req, res, next) => {
    const {
        name,
        email,
        phone,
        address,
        password,
        role,
        firstNiche,
        secondNiche,
        thirdNiche,
        coverLetter,
    } = req.body;
    // Validate required fields
    if (!name || !email || !phone || !address || !password || !role) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
        return next(new ErrorHandler("Please select your niches", 400));
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email }); // Fixed typo here
    if (existingUser) {
        
        return next(new ErrorHandler("Email already exists", 400));
    }
    // Create user data object
    const userData = {
        name,
        email,
        phone,
        address,
        password,
        role,
        coverLetter,
        niches: {
            firstNiche,
            secondNiche,
            thirdNiche,
        },
    };
    // Handle resume upload
    if (req.files && req.files.resume) {
        const { resume } = req.files;
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, {
                folder: "Job_seekers_Resume",
            });
            userData.resume = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return next(new ErrorHandler("Failed to upload resume to cloud", 500));
        }
    }
    // Save user to the database
    try {
        const user = await User.create(userData);
        sendToken(user, 201, res, "user registered successfully")
        
    } catch (error) {
        return next(new ErrorHandler("Failed to register user", 500));
    }
});

export const login = catchAsyncError(async (req, res, next) => {
    const { role, email, password} = req.body;
    if (!role || !email || !password) {
        return next(new ErrorHandler("Email, password and role are required.", 400)
    );
}
    const user = await User.findOne({ email }).select("+password");
    if (!user){
        return next(new ErrorHandler("Invalid email or password", 400 ))
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400))
    }
    if(user.role !== role){
        return next(new ErrorHandler("Invalid role", 400))
    }
    console.log("User authenticated, generating token...");
    sendToken(user, 200, res, "User logged in successfully.");
});

export const logout = catchAsyncError(async (req, res, next)=>{
    res.status(200).cookie("token", " ",{
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }).json({
        success: true,
        message: "Logged out successfuly"

    });
    });

    export default catchAsyncError;

    export const getUser = catchAsyncError(async (req, res, next) => {
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        });
    });
    //code for updated profile
    export const updateProfile = catchAsyncError(async (req, res, next)=>{
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            coverLetter: req.body.coverLetter,
            niches: {
                firstNiche: req.body.firstNiche,
                secondNiche: req.body.secondNiche,
                thirdNiche: req.body.thirdNiche,
            },
        };

        console.log("New user data:", newUserData); // Debug log

        const {firstNiche, secondNiche, thirdNiche} = newUserData.niches;

        if (
            req.user.role === "Job Seeker" &&
            (!firstNiche || !secondNiche || !thirdNiche)
        ) {
            return next(
                new ErrorHandler("please provide all the niches", 400)
            );
        }
        if(req.files){
            const resume = req.files.resume;  
            if(resume){
                const currentResumeId = req.user.resume.public_id;
                if(currentResumeId){
                    await cloudinary.uploader.destroy(currentResumeId);
                }
                const newResume = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
                    folder: "Job_seekers_Resume",
        
                    
                });
                newUserData.resume = {
                    public_id: newResume.public_id,
                    url: newResume.secure_url,
                };

            }
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).json({
            success: true,
            user,
            message: "profile updated successfully",
        });    
    });


export const updatepassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //console.log("Received body:", req.body);

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword); // ✅ Use CamelCase

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New password & confirm password does not match", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res, "Password updated successfully.");
});

    





