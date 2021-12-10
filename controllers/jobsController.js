const Job = require('../models/jobs');
const geoCoder = require('../utils/geocoder');

//Get all jobs => /api/v1/jobs
exports.getJobs = async (req, res, next) => {
    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
}

//Create a new job => /api/v1/jobs/new
exports.newJob = async (req, res, next) => {
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Job Created.',
        data: job
    });
}

//Update a job => /api/v1/jobs/:id
exports.updateJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if(!job) {
      return res.status(404).json({
          success: false,
          message: 'Job not found.'
      });
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
}

//Delete job => /api/v1/jobs/:id
exports.deleteJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if(!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }
    job = await Job.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        success: true,
        message: 'Job was deleted.'
    })
}

//Get a single job by Id => api/v1/jobs/:id
exports.getSingleJob = async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    if(!job){
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        })
    }

    return res.status(200).json({
        success: true,
        data: job
    })
}

//Search jobs with radius => /api/v1/jobs/:zipcode/:distance

exports.getJobsInRadius = async (req, res, next) => {
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
};

//Get stats about topic => /api/v1/stats/:topic
exports.jobStats = async (req, res, next) => {
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
        return res.status(404).json({
            success: false,
            message: `No stats for ${req.params.topic}`
        });
    }

    return res.status(200).json({
        success: true,
        data: stats
    })
};