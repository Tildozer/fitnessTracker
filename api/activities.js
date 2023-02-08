const express = require("express");
const { response } = require("../app");
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  createActivity,
  updateActivity,
  getActivityByName,
} = require("../db");
const router = express.Router();

// GET /api/activities/:activityId/routines

router.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;

  try {
    const routinesByActivity = await getPublicRoutinesByActivity({
      id: activityId,
    });

    if (!routinesByActivity.length) {
      res.status(400).send({
        error: "Failed to get activities",
        message: `Activity ${activityId} not found`,
        name: "Activity Not Found",
      });
    } else {
      res.send(routinesByActivity);
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/activities

router.get("/", async (req, res, next) => {
  try {
    const getActivities = await getAllActivities();

    res.send(getActivities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities

router.post("/", async (req, res, next) => {
  const { name, description } = req.body;

  try {
    if (!name || !description) {
      res.status(418).send({
        error: "teapot",
        message: "name or description was not found",
        name: "more teapots",
      });
    } else {
      const activity = await createActivity(req.body);

      if (!activity) {
        res.status(418).send({
          error: "teapot",
          message: "An activity with name Push Ups already exists",
          name: "more teapots",
        });
      }

      res.send(activity);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId

router.patch("/:id", async (req, res, next) => {
  try {
    if (req.body.name) {
      const activityName = await getActivityByName(req.body.name);

      if (activityName) {
        res.send({
          error: "you shall not edit",
          name: "Unable to edit",
          message: "An activity with name Aerobics already exists",
        });
      }
    }

    const activity = await updateActivity({ id: req.params.id, ...req.body });

    if (!activity) {
      res.status(404).send({
        error: "you shall not edit",
        name: "Unable to edit",
        message: "Activity 10000 not found",
      });
    }

    res.send(activity);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
