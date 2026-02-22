import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 7;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const storedApps = JSON.parse(localStorage.getItem("applications")) || [];
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    // ✅ Step 1: Get jobs posted by this recruiter
    const myJobs = storedJobs.filter(
      (job) => job.recruiterEmail === currentUser?.email
    );

    const myJobIds = myJobs.map((job) => job.id);

    // ✅ Step 2: Get only applications for my jobs
    const myApplicants = storedApps
      .filter((app) => myJobIds.includes(app.jobId))
      .map((app) => {
        const jobDetails = storedJobs.find(
          (job) => job.id === app.jobId
        );

        return {
          ...app,
          jobTitle: jobDetails?.title || jobDetails?.role || "N/A",
          status: app.status || "Pending",
          appliedDate: app.appliedDate || new Date().toISOString(),
        };
      });

    // Sort newest first
    myApplicants.sort(
      (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
    );

    setApplications(myApplicants);
  }, []);

  const updateStatus = (id, newStatus) => {
    const storedApps =
      JSON.parse(localStorage.getItem("applications")) || [];

    const updatedApps = storedApps.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    );

    localStorage.setItem("applications", JSON.stringify(updatedApps));

    // Refresh only current recruiter applications
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleViewResume = (resumeURL) => {
    if (!resumeURL) return alert("No resume uploaded");
    window.open(resumeURL, "_blank");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant =
    indexOfLastApplicant - applicantsPerPage;

  const currentApplicants = applications.slice(
    indexOfFirstApplicant,
    indexOfLastApplicant
  );

  const totalPages = Math.ceil(
    applications.length / applicantsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Applicants</h1>

        {applications.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-10 text-center text-gray-500">
            No applicants yet.
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <tr>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Job Title</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Resume</th>
                    <th className="p-4">Update</th>
                  </tr>
                </thead>

                <tbody>
                  {currentApplicants.map((app) => (
                    <tr
                      key={app.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium">
                        {app.name || app.applicant || "N/A"}
                      </td>

                      <td className="p-4 font-medium">
                        {app.jobTitle}
                      </td>

                      <td className="p-4">
                        {formatDate(app.appliedDate)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            handleViewResume(app.resumeURL)
                          }
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                        >
                          View PDF
                        </button>
                      </td>

                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateStatus(app.id, e.target.value)
                          }
                          className="border px-3 py-1 rounded focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shortlisted">
                            Shortlisted
                          </option>
                          <option value="Rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applicants;