const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for quick setup
const courses = [
  {
    id: 1,
    title: "React Fundamentals",
    description: "Learn React from scratch",
    instructor: "John Doe",
    duration: "8 hours",
    category: "Programming",
    students: 150,
    rating: 4.5,
    progress: 65,
  },
  {
    id: 2,
    title: "JavaScript Advanced",
    description: "Master JavaScript concepts",
    instructor: "Jane Smith",
    duration: "10 hours",
    category: "Programming",
    students: 89,
    rating: 4.7,
    progress: 30,
  },
];

// Routes
app.get("/api/courses", (req, res) => {
  res.json(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

// User routes (mock)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  // Mock authentication
  res.json({
    user: {
      id: 1,
      name: "Student User",
      email: email,
      role: "student",
    },
    token: "mock-jwt-token",
  });
});

// Add to your existing server.js after the other routes

let nextCourseId = 3; // Since we have 2 mock courses

// Create new course
app.post('/api/courses', (req, res) => {
  const { title, description, instructor, duration, category } = req.body;
  
  const newCourse = {
    id: nextCourseId++,
    title,
    description,
    instructor,
    duration,
    category,
    students: 0,
    rating: 0,
    progress: 0,
    createdAt: new Date().toISOString()
  };
  
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// Get courses by instructor (mock)
app.get('/api/instructor/courses', (req, res) => {
  const instructorCourses = courses.filter(course => course.instructor === 'Jane Smith');
  res.json(instructorCourses);
});

// Add after existing routes in server.js

let enrollments = [
  { id: 1, studentId: 1, courseId: 1, progress: 65, completed: false },
  { id: 2, studentId: 1, courseId: 2, progress: 30, completed: false }
];

let nextEnrollmentId = 3;

// Enroll in course
app.post('/api/enroll/:courseId', (req, res) => {
  const { courseId } = req.params;
  const studentId = 1; // Mock student ID
  
  const course = courses.find(c => c.id === parseInt(courseId));
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Check if already enrolled
  const existingEnrollment = enrollments.find(e => 
    e.studentId === studentId && e.courseId === parseInt(courseId)
  );
  
  if (existingEnrollment) {
    return res.status(400).json({ message: 'Already enrolled in this course' });
  }

  const newEnrollment = {
    id: nextEnrollmentId++,
    studentId,
    courseId: parseInt(courseId),
    progress: 0,
    completed: false,
    enrolledAt: new Date().toISOString()
  };

  enrollments.push(newEnrollment);
  course.students += 1; // Increment student count
  
  res.status(201).json(newEnrollment);
});

// Get student enrollments
app.get('/api/student/enrollments', (req, res) => {
  const studentId = 1; // Mock student ID
  const studentEnrollments = enrollments
    .filter(e => e.studentId === studentId)
    .map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      return { ...enrollment, course };
    });
  
  res.json(studentEnrollments);
});

// Update progress
app.patch('/api/enrollments/:enrollmentId/progress', (req, res) => {
  const { enrollmentId } = req.params;
  const { progress } = req.body;
  
  const enrollment = enrollments.find(e => e.id === parseInt(enrollmentId));
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }
  
  enrollment.progress = Math.min(100, Math.max(0, progress));
  enrollment.completed = enrollment.progress === 100;
  
  res.json(enrollment);
});

// Add after existing routes in server.js

// Admin statistics
app.get('/api/admin/stats', (req, res) => {
  const totalCourses = courses.length;
  const totalStudents = enrollments.reduce((sum, enrollment) => sum + 1, 0);
  const totalEnrollments = enrollments.length;
  
  // Calculate completion rate
  const completedCourses = enrollments.filter(e => e.completed).length;
  const completionRate = totalEnrollments > 0 ? (completedCourses / totalEnrollments * 100).toFixed(1) : 0;

  // Course categories count
  const categories = {};
  courses.forEach(course => {
    categories[course.category] = (categories[course.category] || 0) + 1;
  });

  res.json({
    totalCourses,
    totalStudents,
    totalEnrollments,
    completionRate,
    categories,
    recentCourses: courses.slice(-5).reverse() // Last 5 courses
  });
});

// Get all users (mock data)
app.get('/api/admin/users', (req, res) => {
  const users = [
    { id: 1, name: 'Student User', email: 'student@skillbridge.com', role: 'student', joined: '2024-01-15', status: 'active' },
    { id: 2, name: 'Instructor User', email: 'instructor@skillbridge.com', role: 'instructor', joined: '2024-01-10', status: 'active' },
    { id: 3, name: 'John Doe', email: 'john@skillbridge.com', role: 'student', joined: '2024-01-20', status: 'active' },
    { id: 4, name: 'Jane Smith', email: 'jane@skillbridge.com', role: 'instructor', joined: '2024-01-05', status: 'pending' }
  ];
  res.json(users);
});

// Approve instructor
app.patch('/api/admin/users/:userId/approve', (req, res) => {
  const { userId } = req.params;
  res.json({ message: `User ${userId} approved successfully`, status: 'active' });
});

// Get all courses for admin
app.get('/api/admin/courses', (req, res) => {
  const coursesWithDetails = courses.map(course => {
    const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
    return {
      ...course,
      totalEnrollments: courseEnrollments.length,
      completedEnrollments: courseEnrollments.filter(e => e.completed).length,
      averageProgress: courseEnrollments.length > 0 
        ? (courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length).toFixed(1)
        : 0
    };
  });
  res.json(coursesWithDetails);
});

// Add after existing routes in server.js

// Generate certificate
app.get('/api/certificate/:enrollmentId', (req, res) => {
  const { enrollmentId } = req.params;
  
  const enrollment = enrollments.find(e => e.id === parseInt(enrollmentId));
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  if (!enrollment.completed) {
    return res.status(400).json({ message: 'Course not completed' });
  }

  const course = courses.find(c => c.id === enrollment.courseId);
  
  const certificate = {
    id: `CERT-${Date.now()}`,
    studentName: 'Student User', // Mock student name
    courseTitle: course.title,
    instructor: course.instructor,
    completionDate: new Date().toISOString().split('T')[0],
    duration: course.duration,
    certificateUrl: `/certificates/${enrollmentId}.pdf`
  };

  res.json(certificate);
});

// Get student certificates
app.get('/api/student/certificates', (req, res) => {
  const studentId = 1; // Mock student ID
  const studentCertificates = enrollments
    .filter(e => e.studentId === studentId && e.completed)
    .map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      return {
        id: `CERT-${enrollment.id}`,
        courseTitle: course.title,
        completedDate: new Date().toISOString().split('T')[0],
        instructor: course.instructor
      };
    });

  res.json(studentCertificates);
});

// Add after existing routes in server.js

// Mock user database
let users = [
  { id: 1, name: 'Student User', email: 'student@skillbridge.com', password: 'password', role: 'student', status: 'active' },
  { id: 2, name: 'Instructor User', email: 'instructor@skillbridge.com', password: 'password', role: 'instructor', status: 'active' },
  { id: 3, name: 'Admin User', email: 'admin@skillbridge.com', password: 'password', role: 'admin', status: 'active' }
];

let nextUserId = 4;

// Signup endpoint
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role = 'student' } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // Create new user
  const newUser = {
    id: nextUserId++,
    name,
    email,
    password, // In real app, hash this password
    role,
    status: role === 'instructor' ? 'pending' : 'active',
    joined: new Date().toISOString()
  };

  users.push(newUser);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: userWithoutPassword,
    token: `mock-jwt-token-${newUser.id}`
  });
});

// Update login endpoint to use mock users
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (user.status !== 'active') {
    return res.status(401).json({ message: 'Account pending approval' });
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    user: userWithoutPassword,
    token: `mock-jwt-token-${user.id}`
  });
});

// Get user profile
app.get('/api/auth/me', (req, res) => {
  // Mock authentication - in real app, verify JWT token
  const userId = 1; // Mock user ID
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Backend API ready! Use: http://localhost:${PORT}/api/courses`);
});
