import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Job from "../models/jobSchema.js"; // Correct Job schema import

export const postJob = catchAsyncError(async (req, res, next) => {
    const {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsiteTitle,
        personalWebsiteUrl,
        jobNiche,
    } = req.body;

    // Validate required fields
    if (
        !title ||
        !jobType ||
        !location ||
        !companyName ||
        !introduction ||
        !qualifications ||
        !responsibilities ||
        !salary ||
        !jobNiche
    ) {
        return next(new ErrorHandler("Please provide full job details", 400));
    }

    // Validate personal website fields
    if (
        (personalWebsiteTitle && !personalWebsiteUrl) ||
        (!personalWebsiteTitle && personalWebsiteUrl)
    ) {
        return next(
            new ErrorHandler(
                "Provide both title and URL, or leave both blank.",
                400
            )
        );
    }

    // Check if user is authenticated
    if (!req.user) {
        return next(new ErrorHandler("User is not authenticated.", 401));
    }

    const postedBy = req.user._id;

    // Create job
    const job = await Job.create({
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsite: {
            title: personalWebsiteTitle,
            url: personalWebsiteUrl,
        },
        jobNiche,
        postedBy, 
    });

    // Respond to client
    res.status(201).json({
        success: true,
        message: "Job posted successfully",
        job,
    });
});

//getalljob function
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const { city, niche, searchKeyword } = req.query;

  const query = {};

  if (city && city !== "All") {
    query.location = city;
  }

  if (niche && niche !== "All") {
    query.jobNiche = niche;
  }

  const keyword = searchKeyword?.trim();
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { companyName: { $regex: keyword, $options: "i" } },
      { introduction: { $regex: keyword, $options: "i" } },
    ];
  }

  const jobs = await Job.find(query);

  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});


export const getMyJobs = catchAsyncError(async(req,res,next)=>{
    const myJobs = await Job.find({postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs,
    });
    
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("Oops! Job not found.", 404));
  }

  console.log("Logged in user:", req.user._id);
  console.log("Job posted by:", job.postedBy);

  if (
    job.postedBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("Unauthorized to delete this job", 403));
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted.",
  });
});



export const getASingleJob = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
   
    
        const job = await Job.findById(id);
    
    
    if(!job) {
        return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
        success: true,
        job,
    });

})
