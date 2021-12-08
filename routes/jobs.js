const express = require('express');
const router = express.Router();

// Importing jobs controller method
const {
    getJobs,
    newJob,
    getJobsInRadius
} = require('../controllers/jobsController');

router.route('/jobs').get(getJobs);
router.route('/jobs/new').post(newJob);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);
module.exports = router;