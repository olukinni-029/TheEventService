require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require('mongoose');
const connectDB = require('./db.js');

const app = express();

// Connect to MongoDB
connectDB();

// Create a schema and model for the registered users
const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  unit: { type: String, required: true },
  status: { type: String, required: true },
  zodiac: { type: String, required: true },
  workStatus: { type: String, required: true },
});

const Attendee = mongoose.model("Attendee", attendeeSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'../TheEvent', 'public')));
app.use(cors());
// Routes
app.get("/", (req, res) => {
  res.send("GLT Media Hangout");
});

app.post("/registerStudent",async (req, res) => {
  const { name, phone, email, unit, status, zodiac, workStatus } = req.body;
  if (!name || !phone || !email || !unit || !status || !zodiac || !workStatus) {
    return res.status(400).json({ error: "All fields are required" });
    }
    try {
      // Check if attendee with the same name or email already exists
      const existingAttendee = await Attendee.findOne({ $or: [{ name}, { email}] });
      if (existingAttendee) {
        return res.status(400).json({ error: "Attendee with the same name or email already exists" });
      }
  
      // Create a new Attendee instance
      const attendee = new Attendee({
        name,
        phone,
        email,
        unit,
        status,
        zodiac,
        workStatus,
      });
  
      // Save attendee to MongoDB
      await attendee.save();
      console.log("Attendee saved successfully");
      res.status(200).json({ message: "Attendee registered successfully" }); // Redirect upon successful registration
    } catch (err) {
      console.error("Failed to save attendee:", err);
      res.status(500).json({ error: "Failed to register for Student" });
    }
});

app.post("/registerWorkingClass", async (req, res) => {
  const { name1, phone1, email1, unit1, status1, zodiac1, workStatus1 } = req.body;

  // Validate if all required fields are present
  if (!name1 || !phone1 || !email1 || !unit1 || !status1 || !zodiac1 || !workStatus1) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if attendee with the same name or email already exists
    const existingAttendee = await Attendee.findOne({ $or: [{ name: name1 }, { email: email1 }] });
    if (existingAttendee) {
      return res.status(400).json({ error: "Attendee with the same name or email already exists" });
    }

    // Create a new Attendee instance
    const attendee = new Attendee({
      name: name1,
      phone: phone1,
      email: email1,
      unit: unit1,
      status: status1,
      zodiac: zodiac1,
      workStatus: workStatus1,
    });

    // Save attendee to MongoDB
    await attendee.save();
    console.log("Attendee saved successfully");
    res.status(200).json({ message: "Attendee registered successfully" }); // Redirect upon successful registration
  } catch (err) {
    console.error("Failed to save attendee:", err);
    res.status(500).json({ error: "Failed to register for Working class" });
  }
});

app.get('/attendees', async (req, res) => {
  try {
    const attendees = await Attendee.find();
    res.status(200).json(attendees);
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({ error: 'Failed to fetch attendees' });
  }
});

// Start server
const PORT = process.env.PORT || 2440;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
