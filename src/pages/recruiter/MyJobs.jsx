import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState, useEffect } from "react";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // ✅ Message State
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Load recruiter jobs
  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const myJobs = storedJobs.filter(
      (job) => job.recruiterEmail === currentUser?.email
    );

    setJobs(myJobs);
  }, [currentUser?.email]);

  // ✅ Reset page if jobs reduced
  useEffect(() => {
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    if (currentPage > totalPages && totalPages !== 0) {
      setCurrentPage(totalPages);
    }
  }, [jobs, currentPage]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  // ✅ DELETE (No confirm popup)
  const handleDelete = (id) => {
    const allJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const updatedAllJobs = allJobs.filter((job) => job.id !== id);
    localStorage.setItem("jobs", JSON.stringify(updatedAllJobs));

    const myJobs = updatedAllJobs.filter(
      (job) => job.recruiterEmail === currentUser?.email
    );

    setJobs(myJobs);

    // ✅ Show red message
    setMessage("Job deleted successfully.");
    setMessageType("error");

    setTimeout(() => setMessage(""), 2000);
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setIsEdit(false);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsEdit(true);
  };

  const handleChange = (e) => {
    setSelectedJob({
      ...selectedJob,
      [e.target.name]: e.target.value
    });
  };

  // ✅ SAVE EDIT
  const handleSave = () => {
    const allJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const updatedAllJobs = allJobs.map((job) =>
      job.id === selectedJob.id ? selectedJob : job
    );

    localStorage.setItem("jobs", JSON.stringify(updatedAllJobs));

    const myJobs = updatedAllJobs.filter(
      (job) => job.recruiterEmail === currentUser?.email
    );

    setJobs(myJobs);
    setSelectedJob(null);

    // ✅ Green message
    setMessage("Job updated successfully.");
    setMessageType("success");

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">My Jobs</h1>

        {/* ✅ MESSAGE */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-white ${
              messageType === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <>
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-xl p-5 mb-4 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-blue-600 font-medium">
                    {job.companyName}
                  </p>
                  <p className="text-gray-600">{job.location}</p>
                  <span className="text-green-600 text-sm">
                    {job.status}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleView(job)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleEdit(job)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-3 right-4 text-gray-500 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {isEdit ? "Edit Job" : "Job Details"}
            </h2>

            <div className="space-y-4">
              {[
                "companyName",
                "title",
                "location",
                "salary",
                "experience",
                "type",
                "skills",
                "description"
              ].map((field) => (
                <div key={field}>
                  <label className="block font-medium capitalize">
                    {field}
                  </label>

                  {isEdit ? (
                    <input
                      type="text"
                      name={field}
                      value={selectedJob[field] || ""}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {selectedJob[field]}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <label className="block font-medium">Status</label>
                <p className="text-green-600">
                  {selectedJob.status}
                </p>
              </div>

              {isEdit && (
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyJobs;