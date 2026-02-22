import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    title: "",
    location: "",
    salary: "",
    experience: "",
    type: "",
    skills: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const generateJobId = () =>
    "JOB-" + Math.floor(100000 + Math.random() * 900000);

  const validate = () => {
    let newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required";
    } else if (!/^\d+(\.\d+)?\s*(LPA|lpa)?$/.test(formData.salary.trim())) {
      newErrors.salary = "Salary must be a number optionally followed by 'LPA', e.g., 4 LPA";
    }

    if (!formData.experience.trim()) newErrors.experience = "Experience is required";
    if (!formData.type.trim()) newErrors.type = "Job type is required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      alert("Please login first.");
      return;
    }

    if (currentUser.role?.toUpperCase() !== "RECRUITER") {
      alert("Only recruiters can post jobs.");
      return;
    }

    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const newJob = {
      id: generateJobId(),
      ...formData,

      // ✅ IMPORTANT FIX
      recruiterId: currentUser.id,   // used for filtering MyJobs & Applicants
      recruiterEmail: currentUser.email,

      status: "Active",
      createdDate: new Date().toISOString()
    };

    // prepend new job
    localStorage.setItem("jobs", JSON.stringify([newJob, ...storedJobs]));

    setSuccess("✅ Job posted successfully!");
    setFormData({
      companyName: "",
      title: "",
      location: "",
      salary: "",
      experience: "",
      type: "",
      skills: "",
      description: ""
    });

    setTimeout(() => {
      navigate("/my-jobs");
    }, 1500);
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-1 font-medium">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="companyName" value={formData.companyName}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"/>
              {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input type="text" name="title" value={formData.title}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"/>
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <input type="text" name="location" value={formData.location}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"/>
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Salary <span className="text-red-500">*</span>
              </label>
              <input type="text" name="salary" value={formData.salary}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="e.g., 4 LPA"/>
              {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Experience <span className="text-red-500">*</span>
              </label>
              <input type="text" name="experience" value={formData.experience}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"/>
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select name="type" value={formData.type}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg">
                <option value="">Select Type</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Remote</option>
                <option>Internship</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Skills <span className="text-red-500">*</span>
              </label>
              <input type="text" name="skills" value={formData.skills}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="Comma separated"/>
              {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea name="description" rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"/>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="text-right">
            <button type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition">
              Post Job
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;