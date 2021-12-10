const Job = require('../models/jobs');
const geoCoder = require('../utils/geocoder');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

//Get all jobs => /api/v1/jobs
exports.getJobs = catchAsyncErrors( async (req, res, next) => {
    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
});

//Create a new job => /api/v1/jobs/new
exports.newJob = catchAsyncErrors( async (req, res, next) => {
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Job Created.',
        data: job
    });
});

//Update a job => /api/v1/jobs/:id
exports.updateJob = catchAsyncErrors( async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if(!job) {
        return next(new ErrorHandler('Job not found', 404))
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    return res.status(200).json({
        success: true,
        message: 'Job is updated.',
        data: job
    })
});

//Delete job => /api/v1/jobs/:id
exports.deleteJob = catchAsyncErrors( async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if(!job) {
        return next(new ErrorHandler('Job not found', 404))
    }
    job = await Job.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        success: true,
        message: 'Job was deleted.'
    })
});

//Get a single job by Id => api/v1/jobs/:id
exports.getSingleJob = catchAsyncErrors( async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    if(!job){
        return next(new ErrorHandler('Job not found', 404))
    }

    return res.status(200).json({
        success: true,
        data: job
    })
});

//Search jobs with radius => /api/v1/jobs/:zipcode/:distance

exports.getJobsInRadius = catchAsyncErrors( async (req, res, next) => {
    const { zipcode, distance } = req.params;
    //Getting lat and long from geocoder
    const loc = await geoCoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    const radius = distance / 3963;

    const jobs = await Job.find({
        location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
    });
    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    }) 
});

//Get stats about topic => /api/v1/stats/:topic
exports.jobStats = catchAsyncErrors( async (req, res, next) => {
    const stats = await Job.aggregate([
        {
            $match: {$text: {$search: "\"" + req.params.topic + "\""}}
        },
        {
            $group: {
                //What you want to group by
                _id: {$toUpper: '$experience'},
                //key is what you want to name it $operator calls the action you want.
                totalJobs: {$sum: 1},
                avgPositions: {$avg: '$positions'},
                avgSalary: {$avg: '$salary'},
                minSalary: {$min: '$salary'},
                maxSalary: {$max: '$salary'}
            }
        }
    ]);

    if(stats.length === 0) {
        return next(new ErrorHandler(`No stats for ${req.params.topic}`, 200));
    }

    return res.status(200).json({
        success: true,
        data: stats
    })
});