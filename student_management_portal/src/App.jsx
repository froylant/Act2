import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
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
              <strong>Froylan</strong>
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
            Good morning, Froylan <span className="wave">*</span>
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
        <strong>{student.name}</strong>
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

export default App;
