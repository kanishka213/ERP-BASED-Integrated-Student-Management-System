const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/studentERP")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String, // "admin" or "student"
  roll: String,
  department: String,
  semester: String,
  skills: { type: Array, default: [] },
  documents: { type: Array, default: [] },
  cgpa: { type: Number, default: 0 },
  attendance: { type: Array, default: [] },
  fees: {
    total: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  notices: { type: Array, default: [] },
  examResults: { type: Array, default: [] }
});

const User = mongoose.model("users", userSchema);

// REGISTER (optional)
app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });
  if (user.password === password) res.json({ success: true, user });
  else res.json({ success: false });
});

// ADD SKILL
app.post("/add-skill", async (req, res) => {
  const { email, skill } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });
  user.skills.push(skill);
  await user.save();
  res.json({ success: true, skills: user.skills });
});

// ADD DOCUMENT
app.post("/add-document", async (req, res) => {
  const { email, document } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });
  user.documents.push(document);
  await user.save();
  res.json({ success: true, documents: user.documents });
});

// UPDATE CGPA
app.post("/update-cgpa", async (req, res) => {
  const { email, cgpa } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });
  user.cgpa = cgpa;
  await user.save();
  res.json({ success: true, cgpa: user.cgpa });
});

// UPDATE ATTENDANCE
app.post("/update-attendance", async (req, res) => {
  const { email, subject, present, teacher } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });
  let sub = user.attendance.find(s => s.subject === subject);
  if (sub) {
    sub.total += 1;
    if (present) sub.present += 1;
  } else {
    user.attendance.push({ subject, present: present ? 1 : 0, total: 1, teacher });
  }
  await user.save();
  res.json({ success: true, attendance: user.attendance });
});

// GET all students (admin)
app.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json({ success: true, students });
  } catch {
    res.json({ success: false });
  }
});

// UPDATE FEES (admin)
app.post("/update-fees", async (req, res) => {
  const { studentEmail, paid } = req.body;
  const student = await User.findOne({ email: studentEmail });
  if (!student) return res.json({ success: false });
  student.fees.paid += paid;
  student.fees.pending = student.fees.total - student.fees.paid;
  await student.save();
  res.json({ success: true, fees: student.fees });
});

// ADD NOTICE (admin)
app.post("/add-notice", async (req, res) => {
  const { studentEmail, notice } = req.body;
  const student = await User.findOne({ email: studentEmail });
  if (!student) return res.json({ success: false });
  student.notices.push(notice);
  await student.save();
  res.json({ success: true });
});

// ADD EXAM RESULT (admin)
app.post("/add-result", async (req, res) => {
  const { studentEmail, result } = req.body;
  const student = await User.findOne({ email: studentEmail });
  if (!student) return res.json({ success: false });
  student.examResults.push(result);
  await student.save();
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));