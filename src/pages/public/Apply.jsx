/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Apply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });

  // Load job & prefill user info
  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const foundJob = storedJobs.find(
      (j) => j.id?.toString() === id?.toString()
    );
    setJob(foundJob);

    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.username || "",
        email: currentUser.email || "",
      }));
    }
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "resume") {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!formData.resume) {
      setError("Resume is required.");
      return;
    }

    const storedApplications =
      JSON.parse(localStorage.getItem("applications")) || [];

    const alreadyApplied = storedApplications.some(
      (app) =>
        app.jobId?.toString() === id?.toString() &&
        app.email === currentUser?.email
    );

    if (alreadyApplied) {
      setError("You have already applied for this job.");
      return;
    }

    setIsSubmitting(true);

    const resumeURL = URL.createObjectURL(formData.resume);

    const newApplication = {
      id: "APP-" + Date.now(),
      jobId: id,
      jobTitle: job?.title || job?.role,
      recruiterId: job?.recruiterId,
      applicant: currentUser?.username,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      coverLetter: formData.coverLetter,
      resumeName: formData.resume.name,
      resumeURL: resumeURL,
      status: "Pending",
      appliedDate: new Date().toISOString(),
    };

    const updatedApplications = [
      ...storedApplications,
      newApplication,
    ];

    localStorage.setItem(
      "applications",
      JSON.stringify(updatedApplications)
    );

    setIsSubmitting(false);

    // ✅ Navigate with success message
    navigate("/jobs", {
      state: {
        success: "Application submitted successfully!",
      },
    });
  };

  if (!job)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <DashboardLayout role="SEEKER">
      <div className="min-h-screen flex justify-center py-10 bg-gray-50">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            Apply for {job.title || job.role}
          </h1>

          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Cover Letter
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 h-28"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Resume{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="resume"
                accept="application/pdf"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Apply;
