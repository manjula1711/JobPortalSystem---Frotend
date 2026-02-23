/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const RecruiterProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    companyName: "",
    companyLocation: "",
    companyWebsite: "",
    companyDescription: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Load profile
  useEffect(() => {
    if (!currentUser) return;

    const stored = localStorage.getItem(
      `recruiter_profile_${currentUser.email}`
    );

    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      setProfile({
        name: currentUser.username || "",
        email: currentUser.email || "",
        companyName: "",
        companyLocation: "",
        companyWebsite: "",
        companyDescription: "",
      });
    }
  }, []);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!profile.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!profile.companyLocation.trim()) {
      newErrors.companyLocation = "Company location is required";
    }

    if (!profile.companyDescription.trim()) {
      newErrors.companyDescription = "Company description is required";
    }

    if (profile.companyWebsite) {
  try {
    new URL(profile.companyWebsite);
  } catch {
    newErrors.companyWebsite = "Enter valid website URL";
  }
}

    return newErrors;
  };

  // Save
  const handleSave = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    localStorage.setItem(
      `recruiter_profile_${profile.email}`,
      JSON.stringify(profile)
    );

    setIsEditing(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Company Profile</h2>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 text-white px-5 py-2 rounded"
            >
              Save Changes
            </button>
          )}
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
            Profile updated successfully ✅
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label>Name</label>
            <input
              type="text"
              value={profile.name}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Company Name */}
          <div>
            <label>Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyName}
              </p>
            )}
          </div>

          {/* Company Location */}
          <div>
            <label>Company Location *</label>
            <input
              type="text"
              name="companyLocation"
              value={profile.companyLocation}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded"
            />
            {errors.companyLocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyLocation}
              </p>
            )}
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label>Company Website</label>
            <input
              type="text"
              name="companyWebsite"
              value={profile.companyWebsite}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded"
            />
            {errors.companyWebsite && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyWebsite}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label>Description *</label>
            <textarea
              name="companyDescription"
              value={profile.companyDescription}
              onChange={handleChange}
              disabled={!isEditing}
              rows="4"
              className="w-full border p-2 rounded"
            />
            {errors.companyDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyDescription}
              </p>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterProfile;
