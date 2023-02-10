const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  destroyRoutine,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine,
} = require("../db");
const {
  UnauthorizedError,
  UnauthorizedUpdateError,
  UnauthorizedDeleteError,
  DuplicateRoutineActivityError,
} = require("../errors");
const router = express.Router();
const jwt = require("jsonwebtoken");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const publicRoutines = await getAllPublicRoutines();

    res.send(publicRoutines);
  } catch (error) {
    next(error);
  }
});
// POST /api/routines
router.post("/", async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).send({
      error: "No token found",
      message: UnauthorizedError(),
      name: "tokenless error",
    });
  }

  try {
    const headerToken = token.slice(7);
    const { id: creatorId } = jwt.verify(headerToken, process.env.JWT_SECRET);
    const { isPublic, name, goal } = req.body;

    const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });

    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).send({
      error: "No token found",
      message: UnauthorizedError(),
      name: "tokenless error",
    });
  }

  try {
    const headerToken = token.slice(7);
    const { id: userId, username } = jwt.verify(
      headerToken,
      process.env.JWT_SECRET
    );
    const { routineId } = req.params;
    const { creatorId, name: routineName } = await getRoutineById(routineId);

    if (creatorId !== userId) {
      res.status(403).send({
        error: "Unauthorized User",
        message: UnauthorizedUpdateError(username, routineName),
        name: "Not today, bucko",
      });
    }

    const { isPublic, name, goal } = req.body;
    const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });

    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).send({
      error: "No token found",
      message: UnauthorizedError(),
      name: "tokenless error",
    });
  }
  try {
    const headerToken = token.slice(7);
    const { id: userId, username } = jwt.verify(
      headerToken,
      process.env.JWT_SECRET
    );
    const { routineId } = req.params;
    const { creatorId, name: routineName } = await getRoutineById(routineId);

    if (creatorId !== userId) {
      res.status(403).send({
        error: "Unauthorized User",
        message: UnauthorizedDeleteError(username, routineName),
        name: "Not today, bucko",
      });
    }
    const deletedRoutine = await destroyRoutine(routineId);

    console.log(deletedRoutine);

    res.send(deletedRoutine);
  } catch (error) {
    next(error);
  }
});
// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    const routineActivities = await getRoutineActivitiesByRoutine({
      id: routineId,
    });
    routineActivities.forEach(({ routineId: idCheck, activityId }) => {
      if (idCheck !== routineId) {
        res.send({
          error: "No token found",
          message: DuplicateRoutineActivityError(routineId, activityId),
          name: "tokenless error",
        });
      }
    });
    const addedActivity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });
    res.send(addedActivity);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
