/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";

const Jobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const loadData = () => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const storedApplications =
      JSON.parse(localStorage.getItem("applications")) || [];

    setApplications(storedApplications);

    const isAppliedByUser = (jobId) =>
      storedApplications.some(
        (app) =>
          app.jobId?.toString() === jobId?.toString() &&
          app.email === currentUser.email
      );

    const sortedJobs = [...storedJobs].sort((a, b) => {
      const aApplied = isAppliedByUser(a.id);
      const bApplied = isAppliedByUser(b.id);

      const aNew =
        new Date() - new Date(a.createdDate) <
        3 * 24 * 60 * 60 * 1000;
      const bNew =
        new Date() - new Date(b.createdDate) <
        3 * 24 * 60 * 60 * 1000;

      if (aApplied && !bApplied) return 1;
      if (!aApplied && bApplied) return -1;

      if (!aApplied && !bApplied) {
        if (aNew && !bNew) return -1;
        if (!aNew && bNew) return 1;
        return (
          new Date(b.createdDate) -
          new Date(a.createdDate)
        );
      }

      return (
        new Date(b.createdDate) -
        new Date(a.createdDate)
      );
    });

    setJobs(sortedJobs);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Listen for success message
  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success);
      loadData(); // reload jobs after apply

      // Clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [location.state]);

  const isApplied = (jobId) => {
    return applications.some(
      (app) =>
        app.jobId?.toString() === jobId?.toString() &&
        app.email === currentUser.email
    );
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar role={currentUser?.role || "SEEKER"} />
      <div className="flex-1 bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6">
          Available Jobs
        </h1>

        {/* ✅ GREEN SUCCESS MESSAGE */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 text-center font-medium">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          {currentJobs.map((job) => {
            const applied = isApplied(job.id);
            const isNew =
              !applied &&
              new Date() - new Date(job.createdDate) <
                3 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.title || job.role}
                  {isNew && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs ml-2">
                      New
                    </span>
                  )}
                </h2>

                <p className="text-blue-600 font-medium mt-1">
                  {job.companyName || job.company}
                </p>

                <p className="text-gray-500 mt-1">
                  {job.location} • {job.type || "Full Time"}
                </p>

                <p className="text-green-600 font-semibold mt-2">
                  {job.salary}
                </p>

                <div className="mt-6">
                  {applied ? (
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
                      ✓ Applied
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/apply/${job.id}`)
                      }
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
