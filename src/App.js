import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [className, setClassName] = useState("");

  const [studentName, setStudentName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    getClasses();
    getStudents();
  }, []);

  

  const getClasses = async () => {
    const res = await axios.get(`${API}/classes`);
    setClasses(res.data);
  };

  const addClass = async () => {
    if (!className) return;

    await axios.post(`${API}/classes`, {
      name: className,
    });

    setClassName("");
    getClasses();
  };

  const deleteClass = async (id) => {
    await axios.delete(`${API}/classes/${id}`);
    getClasses();
    getStudents();
  };

  
  
  const getStudents = async () => {
    const res = await axios.get(`${API}/students`);
    setStudents(res.data);
  };

  const addStudent = async () => {
    if (!studentName || !selectedClass) return;

    await axios.post(`${API}/students`, {
      name: studentName,
      classId: selectedClass,
    });

    setStudentName("");
    setSelectedClass("");
    getStudents();
  };

  const deleteStudent = async (id) => {
    await axios.delete(`${API}/students/${id}`);
    getStudents();
  };

  return (
    <div className="container">
      <h1> Class Management System</h1>


      <div className="card">
        <h2>Add Class</h2>

        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <button onClick={addClass}>Add Class</button>
      </div>


      <div className="card">
        <h2>Classes</h2>

        {classes.map((cls) => (
          <div key={cls._id} className="item">
            <span>{cls.name}</span>

            <button
              className="delete"
              onClick={() => deleteClass(cls._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>


      <div className="card">
        <h2>Add Student</h2>

        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <button onClick={addStudent}>Add Student</button>
      </div>


      <div className="card">
        <h2>Students</h2>

        {students.map((student) => (
          <div key={student._id} className="item">
            <span>
              <h3>Student Name:</h3>
              {student.name} 
                <h3>Student ID</h3>
              {student.classId ? student.classId.name : "No Class"}
            </span>

            <button
              className="delete"
              onClick={() => deleteStudent(student._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;