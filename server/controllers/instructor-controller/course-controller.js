const Course = require("../../models/Course");
const mongoose = require("mongoose");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add a New Course
const addNewCourse = async (req, res) => {
  try {
    const { title, description } = req.body; // Example required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title and description",
      });
    }

    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const savedCourse = await newlyCreatedCourse.save();

    res.status(201).json({
      success: true,
      message: "Course saved successfully",
      data: savedCourse,
    });
  } catch (e) {
    console.error("Error adding course:", e.message);
    res.status(500).json({
      success: false,
      message: "Some error occurred while saving the course.",
    });
  }
};

// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});
    if (coursesList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No courses found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.error("Error fetching courses:", e.message);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching courses.",
    });
  }
};

// Get Course Details by ID
const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching course details:", error.message);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching course details.",
    });
  }
};

// Update Course by ID
const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    if (!updatedCourseData || Object.keys(updatedCourseData).length === 0) {
      return res.status(400).json({ success: false, message: "No data provided to update" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.error("Error updating course:", e.message);
    res.status(500).json({
      success: false,
      message: "Some error occurred while updating the course.",
    });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
};
