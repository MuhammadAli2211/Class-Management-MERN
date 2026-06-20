const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


app.use(cors({
  origin: ["https://class-management-mern.vercel.app/"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());


mongoose.connect(
    "mongodb://moon:moon2211@ac-l2ejgmi-shard-00-00.koufj2e.mongodb.net:27017,ac-l2ejgmi-shard-00-01.koufj2e.mongodb.net:27017,ac-l2ejgmi-shard-00-02.koufj2e.mongodb.net:27017/?ssl=true&replicaSet=atlas-fic7lp-shard-0&authSource=admin&appName=Cluster0"
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });
  

const classSchema = new mongoose.Schema({
  name: String,
});

const ClassModel = mongoose.model("Class", classSchema);



const studentSchema = new mongoose.Schema({
  name: String,
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
});

const Student = mongoose.model("Student", studentSchema);



app.post("/classes", async (req, res) => {
  const newClass = new ClassModel(req.body);
  await newClass.save();
  res.json(newClass);
});


app.get("/classes", async (req, res) => {
  const classes = await ClassModel.find();
  res.json(classes);
});


app.delete("/classes/:id", async (req, res) => {
  await ClassModel.findByIdAndDelete(req.params.id);
  await Student.deleteMany({ classId: req.params.id }); // also delete students
  res.json({ message: "Class deleted" });
});



app.post("/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json(student);
});


app.get("/students", async (req, res) => {
  const students = await Student.find().populate("classId");
  res.json(students);
});



app.get("/students/class/:id", async (req, res) => {
  const students = await Student.find({ classId: req.params.id });
  res.json(students);
});


app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  