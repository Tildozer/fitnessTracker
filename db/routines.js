const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows : [routine] } = await client.query(`
    INSERT into routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `, [creatorId, isPublic, name, goal])

    return routine;
  } catch (error) {
    console.error(error);
  }
}

async function getRoutineById(id) {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

async function getRoutinesWithoutActivities() {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

async function getAllRoutines() {
  try {
    const {rows : routines} = await client.query(`
    SELECT DISTINCT routines.*, duration, routine_activities.count, activities.id AS "activityId", activities.name, description, username AS "creatorName"
    FROM routines 
    JOIN routine_activities ON routines.id=routine_activities."routineId"
    JOIN activities ON routine_activities."activityId"=activities.id
    JOIN users ON users.id=routines."creatorId"
    `)
    console.log(routines)
    return routines;
  } catch (error) {
    console.error(error);
  }
}

async function getAllPublicRoutines() {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

async function updateRoutine({ id, ...fields }) {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

async function destroyRoutine(id) {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
