const Student = require('../models/Student');

// 1. READ: Fetch all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching roster records.", error: error.message });
  }
};

// 2. CREATE: Add a new student profile
const createStudent = async (req, res) => {
  try {
    // Fallback safeguard: If req.body is completely missing, default to an empty object
    const body = req.body || {};
    const { name, rollNo, department } = body;
    
    if (!name || !rollNo) {
      return res.status(400).json({ 
        message: "Validation Error: Name and Roll Number must be populated in the request body." 
      });
    }

    const newStudent = new Student({ name, rollNo, department });
    await newStudent.save();
    
    res.status(201).json({ message: "Student record added to MongoDB successfully.", student: newStudent });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Conflict Error: A student with this Roll Number already exists." });
    }
    res.status(500).json({ message: "Server error during profile parsing.", error: error.message });
  }
};

// 3. UPDATE: Modify student profile details
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, updates, { 
      new: true, // Returns the modified document instead of old version
      runValidators: true // Enforces our schema string validation rules during updates
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Target profile index not found in system storage map." });
    }

    res.status(200).json({ message: "Profile elements updated successfully.", student: updatedStudent });
  } catch (error) {
    res.status(400).json({ message: "Validation failure during item updates.", error: error.message });
  }
};

// 4. DELETE: Wipe a student record from the database
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Target profile index not found in system storage map." });
    }

    res.status(200).json({ message: `Student profile record with reference id ${id} permanently dropped.` });
  } catch (error) {
    res.status(500).json({ message: "Wipe sequence failed on server array layer.", error: error.message });
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
};