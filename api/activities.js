const express = require('express');
const { getAllActivities, getPublicRoutinesByActivity } = require('../db');
const router = express.Router();

// GET /api/activities/:activityId/routines

router.get ('/:activityId/routines', async (res, req, next) => {
const { activityId } = req.params;

try {
    const routinesByActivity = await getPublicRoutinesByActivity({id: activityId, });

if (!routinesByActivity.length) {
    next({
        error: '',
        message: `Activity ${activityId} not found`,
        name: 'Activity Not Found'
    });
} else {
    res.send(routinesByActivity);
}

} catch (error) {
    next(error);
}

});

// GET /api/activities

router.get ('/', async (req, res, next) => {
    
    try {

        const getActivities = await getAllActivities()

        res.send(getActivities);
    } catch (error) {
       next(error); 
    }

})

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
