import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 7;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const storedApplications =
      JSON.parse(localStorage.getItem("applications")) || [];
    const storedJobs =
      JSON.parse(localStorage.getItem("jobs")) || [];

    const myApps = storedApplications
      .filter((app) => app.email === currentUser?.email)
      .map((app) => {
        const jobDetails = storedJobs.find((job) => job.id === app.jobId);

        return {
          ...app,
          jobTitle: jobDetails?.title || jobDetails?.role,
          companyName: jobDetails?.companyName || jobDetails?.company,
          location: jobDetails?.location,
          appliedDate: app.appliedDate || new Date().toISOString(),
        };
      });

    // Sort newest first
    myApps.sort(
      (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
    );

    setApplications(myApps);
  }, []);

  // ✅ Format Date Properly
  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApps = applications.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <DashboardLayout role="SEEKER">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">My Applications</h1>

        {applications.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-500">
            You have not applied to any jobs yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied On</th>
                </tr>
              </thead>

              <tbody>
                {currentApps.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t text-sm hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{app.jobTitle || "—"}</td>
                    <td className="p-4">{app.companyName || "—"}</td>
                    <td className="p-4">{app.location || "—"}</td>
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
                      {formatDate(app.appliedDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;