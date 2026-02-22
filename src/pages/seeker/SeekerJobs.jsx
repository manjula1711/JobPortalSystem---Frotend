import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";


const SeekerJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const storedJobs =
      JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);
  }, []);

  const handleApply = (job) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      alert("Please login first.");
      return;
    }

    const applications =
      JSON.parse(localStorage.getItem("applications")) || [];

    // Prevent duplicate apply
    const alreadyApplied = applications.find(
      (app) =>
        app.jobId === job.id &&
        app.applicantEmail === currentUser.email
    );

    if (alreadyApplied) {
      alert("You already applied to this job.");
      return;
    }

    const newApplication = {
      jobId: job.id,
      jobTitle: job.title,
      location: job.location,
      applicantEmail: currentUser.email,
      status: "Pending",
      appliedDate: new Date().toLocaleDateString(),
    };

    applications.push(newApplication);

    localStorage.setItem(
      "applications",
      JSON.stringify(applications)
    );

    alert("Application submitted successfully!");
  };

  return (
    <DashboardLayout role="SEEKER">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Available Jobs
        </h1>

        {jobs.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-500">
            No jobs available right now.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-xl shadow-sm border"
              >
                <h2 className="text-lg font-semibold capitalize">
                  {job.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {job.location}
                </p>

                <p className="text-sm text-gray-500">
                  💼 {job.type}
                </p>

                <p className="text-sm text-gray-500">
                  🧠 {job.experience}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  💰 {job.salary}
                </p>

                <button
                  onClick={() => handleApply(job)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeekerJobs;