import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const initialStudents = [
  {
    id: "ST-1042",
    name: "Amelia Rivers",
    email: "amelia.rivers@northstar.edu",
    course: "Computer Science",
    year: "3rd year",
    status: "Active",
    joined: "Sep 12, 2023",
    phone: "+1 555 014 8291",
  },
  {
    id: "ST-1041",
    name: "Noah Bennett",
    email: "noah.bennett@northstar.edu",
    course: "Business Analytics",
    year: "2nd year",
    status: "Active",
    joined: "Sep 12, 2023",
    phone: "+1 555 014 2280",
  },
  {
    id: "ST-1040",
    name: "Sofia Chen",
    email: "sofia.chen@northstar.edu",
    course: "Visual Design",
    year: "4th year",
    status: "Active",
    joined: "Sep 11, 2023",
    phone: "+1 555 014 6512",
  },
  {
    id: "ST-1039",
    name: "Ethan Williams",
    email: "ethan.williams@northstar.edu",
    course: "Mechanical Engineering",
    year: "1st year",
    status: "On leave",
    joined: "Sep 08, 2023",
    phone: "+1 555 014 4901",
  },
  {
    id: "ST-1038",
    name: "Maya Patel",
    email: "maya.patel@northstar.edu",
    course: "Psychology",
    year: "3rd year",
    status: "Active",
    joined: "Sep 07, 2023",
    phone: "+1 555 014 1039",
  },
];

const studentApi = axios.create({ baseURL: "/api" });

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    studentApi
      .get("/students")
      .then(({ data }) => {
        if (mounted && Array.isArray(data)) setStudents(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout students={students} loading={loading} />}>
          <Route path="/" element={<Home students={students} />} />
          <Route path="/students" element={<Students students={students} />} />
          <Route
            path="/students/new"
            element={
              <AddStudent
                students={students}
                onCreate={(student) =>
                  setStudents((current) => [student, ...current])
                }
              />
            }
          />
          <Route
            path="/students/:studentId"
            element={<StudentDetails students={students} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout({ students, loading }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-mark">N</span>
          <span>
            northstar<span className="brand-dot">.</span>
          </span>
        </Link>
        <p className="eyebrow side-label">Workspace</p>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink className="nav-item" to="/">
            <span className="nav-icon">+</span> Overview
          </NavLink>
          <NavLink className="nav-item" to="/students">
            <span className="nav-icon">#</span> Students{" "}
            <span className="nav-count">{students.length}</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-box">
            <span className="help-icon">?</span>
            <div>
              <strong>Need a hand?</strong>
              <span>Visit the help center</span>
            </div>
          </div>
          <div className="profile">
            <span className="avatar avatar-small">F</span>
            <div>
              <strong>Froylan and Jazmine</strong>
              <span>Administrator</span>
            </div>
            <span className="more">...</span>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span>/</span>
            <strong>{loading ? "Loading" : "Student portal"}</strong>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              o<span className="notification-dot" />
            </button>
            <button className="avatar avatar-small" aria-label="Open profile">
              F
            </button>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Home({ students }) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Monday, September 12, 2023</p>
          <h1>
            Good morning, Everyone <span className="wave">*</span>
          </h1>
          <p className="intro">
            Here is what is happening across your student community today.
          </p>
        </div>
      </section>
      <section className="stat-grid">
        <article className="stat-card highlight">
          <span className="stat-icon">#</span>
          <p>Total students</p>
          <strong>{students.length}</strong>
          <small>
            <b>+8.2%</b> from last month
          </small>
        </article>
        <article className="stat-card">
          <span className="stat-icon green">&#10003;</span>
          <p>Active students</p>
          <strong>
            {students.filter((student) => student.status === "Active").length}
          </strong>
          <small>
            <b>+4.6%</b> from last month
          </small>
        </article>
        <article className="stat-card">
          <span className="stat-icon orange">!</span>
          <p>On leave</p>
          <strong>
            {students.filter((student) => student.status === "On leave").length}
          </strong>
          <small className="muted">No change this month</small>
        </article>
      </section>
      <section className="content-panel recent-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Directory</p>
            <h2>Recently added</h2>
          </div>
          <Link className="text-button" to="/students">
            View all <span>-&gt;</span>
          </Link>
        </div>
        <div className="student-table compact">
          <div className="table-head">
            <span>Student</span>
            <span>Course</span>
            <span>Status</span>
            <span>Added</span>
          </div>
          {students.slice(0, 4).map((student) => (
            <div className="table-row" key={student.id}>
              <StudentCell student={student} />
              <span>{student.course}</span>
              <span>
                <Status student={student} />
              </span>
              <span>{student.joined}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function StudentCell({ student }) {
  return (
    <span className="student-cell">
      <span className="avatar">{initials(student.name)}</span>
      <span>
        <Link className="student-name-link" to={`/students/${student.id}`}>
          {student.name}
        </Link>
        <small>{student.email}</small>
      </span>
    </span>
  );
}

function Status({ student }) {
  return (
    <span
      className={`status ${student.status === "Active" ? "active-status" : "leave-status"}`}
    >
      {student.status}
    </span>
  );
}

function Students({ students }) {
  const [query, setQuery] = useState("");
  const filteredStudents = useMemo(() => {
    const term = query.toLowerCase().trim();
    return term
      ? students.filter((student) =>
          Object.values(student).some((value) =>
            value.toLowerCase().includes(term),
          ),
        )
      : students;
  }, [query, students]);
  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Directory</p>
          <h1>Students</h1>
          <p className="intro">
            Manage your student records and keep everyone on track.
          </p>
        </div>
        <Link className="primary-button" to="/students/new">
          <span>+</span> Add student
        </Link>
      </section>
      <section className="content-panel directory-panel">
        <div className="directory-toolbar">
          <label className="search-box">
            <span>/</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email, or course..."
              aria-label="Search students"
            />
          </label>
          <button className="filter-button" type="button">
            Filter <span>v</span>
          </button>
        </div>
        <div className="result-count">{filteredStudents.length} students</div>
        <div className="student-table">
          <div className="table-head">
            <span>Student</span>
            <span>Course</span>
            <span>Year</span>
            <span>Status</span>
            <span>Added</span>
          </div>
          {filteredStudents.map((student) => (
            <div className="table-row" key={student.id}>
              <StudentCell student={student} />
              <span>{student.course}</span>
              <span>{student.year}</span>
              <span>
                <Status student={student} />
              </span>
              <span>{student.joined}</span>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="empty-state">
              <strong>No students found</strong>
              <span>Try a different search term.</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function AddStudent({ students, onCreate }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    year: "1st year",
    phone: "",
    status: "Active",
  });

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextId = `ST-${1043 + students.length - initialStudents.length}`;
    onCreate({
      ...form,
      id: nextId,
      joined: "Sep 12, 2023",
    });
    navigate(`/students/${nextId}`);
  }

  return (
    <div className="form-page">
      <Link className="back-button" to="/students">
        &lt;- Back to students
      </Link>
      <section className="form-heading">
        <p className="eyebrow">Directory</p>
        <h1>Add student</h1>
        <p className="intro">Create a new student record for your community.</p>
      </section>
      <form className="content-panel student-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div>
            <h2>Student information</h2>
            <p>Keep contact details and academic information up to date.</p>
          </div>
          <div className="form-fields">
            <label>
              Full name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                required
                placeholder="e.g. Jordan Lee"
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                required
                placeholder="jordan.lee@northstar.edu"
              />
            </label>
            <label>
              Course
              <input
                name="course"
                value={form.course}
                onChange={updateField}
                required
                placeholder="e.g. Computer Science"
              />
            </label>
            <label>
              Year
              <select name="year" value={form.year} onChange={updateField}>
                <option>1st year</option>
                <option>2nd year</option>
                <option>3rd year</option>
                <option>4th year</option>
              </select>
            </label>
            <label>
              Phone number <span className="optional">(optional)</span>
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="+1 555 014 0000"
              />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={updateField}>
                <option>Active</option>
                <option>On leave</option>
              </select>
            </label>
          </div>
        </div>
        <div className="form-actions">
          <Link className="secondary-button" to="/students">
            Cancel
          </Link>
          <button className="primary-button" type="submit">
            Save student
          </button>
        </div>
      </form>
    </div>
  );
}

function StudentDetails({ students }) {
  const { studentId } = useParams();
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return (
      <div className="empty-state">
        <strong>Student not found</strong>
        <Link className="text-button" to="/students">
          Return to students
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Link className="back-button" to="/students">
        &lt;- Back to students
      </Link>
      <section className="detail-header">
        <span className="avatar avatar-large">{initials(student.name)}</span>
        <div>
          <p className="eyebrow">Student profile</p>
          <h1>{student.name}</h1>
          <p className="intro">
            {student.id}
            <span className="divider">|</span>
            {student.course}
          </p>
        </div>
        <Status student={student} />
      </section>
      <div className="detail-grid">
        <section className="content-panel info-panel">
          <p className="eyebrow">Overview</p>
          <h2>Personal details</h2>
          <div className="info-list">
            <div>
              <span>Email address</span>
              <strong>{student.email}</strong>
            </div>
            <div>
              <span>Phone number</span>
              <strong>{student.phone || "Not provided"}</strong>
            </div>
            <div>
              <span>Course</span>
              <strong>{student.course}</strong>
            </div>
            <div>
              <span>Year</span>
              <strong>{student.year}</strong>
            </div>
            <div>
              <span>Joined</span>
              <strong>{student.joined}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{student.status}</strong>
            </div>
          </div>
        </section>
        <section className="content-panel activity-panel">
          <p className="eyebrow">Activity</p>
          <h2>Recent updates</h2>
          <div className="timeline">
            <div>
              <span className="timeline-dot" />
              <p>
                <strong>Student record created</strong>
                <small>{student.joined}</small>
              </p>
            </div>
            <div>
              <span className="timeline-dot pale" />
              <p>
                <strong>Profile information updated</strong>
                <small>Today</small>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
