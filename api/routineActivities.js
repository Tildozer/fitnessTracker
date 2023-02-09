const express = require('express');
const { use } = require('../app');
const { canEditRoutineActivity, updateActivity, updateRoutineActivity, getRoutineActivityById, getRoutineById, destroyRoutineActivity } = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { UnauthorizedUpdateError } = require('../errors');

// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineActivityId', async (req, res, next) => {

const token = req.header("Authorization");
 
try {
    const body = req.body; 

    const {routineActivityId} = req.params;

    const headerToken = token.slice(7);
    const { id: userId, username } = jwt.verify(
        headerToken,
        process.env.JWT_SECRET
      );


      const isUser = await canEditRoutineActivity(routineActivityId, userId);

      
      if (!isUser) {
        const {routineId} = await getRoutineActivityById(routineActivityId)
        
        const {name} = await getRoutineById(routineId)
        console.log(name)

        

        res.status(403).send ({
            error: 'Unauthorized beans',
            message:UnauthorizedUpdateError(username, name) ,
            name: 'beans'
        })
      }
      
      

      const activity = await updateRoutineActivity({id: routineActivityId, ...body});

      res.send(activity)
        
} catch (error) {
    next(error)
}

})

// DELETE /api/routine_activities/:routineActivityId

router.delete('/:routineActivityId', async (req, res, next) => {
    const token = req.header('Authorization');

    try {

        const headerToken = token.slice(7);
        const { id: userId, username } = jwt.verify(
        headerToken,
        process.env.JWT_SECRET
    );

            const { routineActivityId } = req.params;

            console.log(req.body)
            const { id: routineId, name: routineActivityName } = await getRoutineActivityById(routineActivityId)
            const { creatorId } = await getRoutineById(id);

            const deletedRoutineActivity = destro(routineActivityId)

            res.send(deletedRoutineActivity)
    } catch (error) {
        next(error)
    }

})

module.exports = router;
