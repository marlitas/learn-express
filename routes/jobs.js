const express = require('express');
const router = express.Router();

// Importing jobs controller method
const {
    getJobs,
    newJob,
    getJobsInRadius,
    updateJob,
    deleteJob,
    getSingleJob,
    jobStats
} = require('../controllers/jobsController');

router.route('/jobs').get(getJobs);
router.route('/jobs/:id').get(getSingleJob)
router.route('/jobs/new').post(newJob);
router.route('/jobs/:id').put(updateJob);
router.route('/jobs/:id').delete(deleteJob);
router.route('/stats/:topic').get(jobStats);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);
module.exports = router;