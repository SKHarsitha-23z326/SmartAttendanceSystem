const express = require('express');
const router = express.Router();
const { 
  getAllStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} = require('../controllers/studentController');

router.get('/', getAllStudents);         // GET /api/db-students
router.post('/', createStudent);       // POST /api/db-students
router.put('/:id', updateStudent);     // PUT /api/db-students/:id
router.delete('/:id', deleteStudent);  // DELETE /api/db-students/:id

module.exports = router;