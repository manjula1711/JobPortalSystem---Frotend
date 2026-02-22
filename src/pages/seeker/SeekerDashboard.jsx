/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [applications, setApplications] = useState([]);

  // Function to load applications dynamically
  const loadApplications = () => {
    const storedApps = JSON.parse(localStorage.getItem("applications")) || [];

    const myApps = storedApps
      .filter((app) => app.email === user?.email)
      .map((app) => ({
        ...app,
        status:
          app.status === "Applied" || !app.status
            ? "Pending"
            : app.status,
      }));

    setApplications(myApps);
  };

  // Load applications on mount
  useEffect(() => {
    loadApplications();
  }, [user?.email]);

  // Listen for changes in localStorage (e.g., new application or status update)
  useEffect(() => {
    const handleStorageChange = () => loadApplications();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Counts
  const total = applications.length;
  const pending = applications.filter((a) => a.status === "Pending").length;
  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

  return (
    <DashboardLayout role="SEEKER">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username}</h1>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-100 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold">{total}</h2>
            <p>Total Applications</p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold">{pending}</h2>
            <p>Pending</p>
          </div>

          <div className="bg-green-100 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold">{shortlisted}</h2>
            <p>Shortlisted</p>
          </div>

          <div className="bg-red-100 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold">{rejected}</h2>
            <p>Rejected</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/jobs")}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-blue-700"
          >
            💼 Browse Jobs
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeekerDashboard;
