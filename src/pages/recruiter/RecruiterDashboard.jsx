import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const RecruiterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")); // current recruiter
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Get all jobs posted by this recruiter
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const myJobs = storedJobs.filter(
      (job) => job.recruiterEmail === user?.email
    );
    setJobs(myJobs);

    // Get all applications for this recruiter's jobs
    const storedApplications =
      JSON.parse(localStorage.getItem("applications")) || [];
    const myApplications = storedApplications.filter((app) =>
      myJobs.some((job) => job.id === app.jobId)
    );
    setApplications(myApplications);
  }, [user?.email]);

  // Stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status !== "Closed").length;
  const totalApplicants = applications.length;

  // Get recent jobs (last 5)
  const recentJobs = [...jobs].sort((a, b) => b.id - a.id).slice(0, 5);

  // Get recent applicants (last 5)
  const recentApplicants = [...applications]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome,{" "}
            <span className="text-blue-600">
              {user?.username || user?.name || "Recruiter"}
            </span>
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your job postings and applicants
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Total Jobs</p>
            <h2 className="text-3xl font-bold mt-2">{totalJobs}</h2>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Active Jobs</p>
            <h2 className="text-3xl font-bold mt-2">{activeJobs}</h2>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Total Applicants</p>
            <h2 className="text-3xl font-bold mt-2">{totalApplicants}</h2>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">

          {/* Recent Jobs */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
            <ul className="space-y-3 text-gray-700">
              {recentJobs.map((job) => (
                <li key={job.id} className="flex justify-between border-b pb-2">
                  <span>{job.title || job.role}</span>
                  <span
                    className={`font-medium ${
                      job.status === "Closed"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {job.status || "Active"}
                  </span>
                </li>
              ))}
              {recentJobs.length === 0 && <li>No jobs posted yet.</li>}
            </ul>
          </div>

          {/* Recent Applicants */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Recent Applicants
            </h3>
            <ul className="space-y-3 text-gray-700">
              {recentApplicants.map((app) => {
                const job = jobs.find((job) => job.id === app.jobId);
                return (
                  <li
                    key={app.id}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{app.name || app.applicant}</span>
                    <span className="text-sm text-gray-500">
                      {job?.title || "Job"}
                    </span>
                  </li>
                );
              })}
              {recentApplicants.length === 0 && (
                <li>No applicants yet.</li>
              )}
            </ul>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;