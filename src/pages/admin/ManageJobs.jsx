import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const jobsPerPage = 5;

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);
  }, []);

  // Open confirm modal
  const handleDeleteClick = (id) => {
    setSelectedJobId(id);
    setShowConfirm(true);
  };

  // ✅ Confirm delete with cascade logic
  const confirmDeleteJob = () => {
    // 1️⃣ Remove job
    const updatedJobs = jobs.filter(
      (job) => job.id !== selectedJobId
    );

    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);

    // 2️⃣ 🔥 Remove related applications
    const storedApplications =
      JSON.parse(localStorage.getItem("applications")) || [];

    const updatedApplications = storedApplications.filter(
      (app) => app.jobId !== selectedJobId
    );

    localStorage.setItem(
      "applications",
      JSON.stringify(updatedApplications)
    );

    // Close modal
    setShowConfirm(false);

    // Show success message
    setSuccessMessage(
      "Job and related applications deleted successfully!"
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    // Adjust pagination if needed
    if (
      (currentPage - 1) * jobsPerPage >= updatedJobs.length &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <DashboardLayout role="ADMIN">
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Manage Jobs
        </h1>

        {/* ✅ Green Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">
              No jobs available.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Posted By</th>
                    <th className="p-4 text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium">
                        {job.title}
                      </td>

                      <td className="p-4 text-gray-600">
                        {job.companyName}
                      </td>

                      <td className="p-4 text-gray-600">
                        {job.location}
                      </td>

                      <td className="p-4 text-gray-600">
                        {job.recruiterEmail}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            handleDeleteClick(job.id)
                          }
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-3">
              {[...Array(totalPages)].map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </>
        )}

        {/* ✅ Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">
                Confirm Delete
              </h2>

              <p className="mb-6">
                Are you sure you want to delete
                this job?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteJob}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;