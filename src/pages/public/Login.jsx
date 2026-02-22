import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showForgot, setShowForgot] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({});
  };

  // ==============================
  // LOGIN LOGIC
  // ==============================
  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // 1️⃣ ADMIN LOGIN
    if (email === "admin@gmail.com" && password === "admin123") {
      const adminUser = {
        username: "Admin",
        email: "admin@gmail.com",
        role: "ADMIN",
      };

      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("loggedInUser", adminUser.username);

      navigate("/admin-dashboard");
      return;
    }

    // 2️⃣ NORMAL USER LOGIN
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setErrors({ email: "Invalid email or password" });
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("loggedInUser", user.username);

    if (user.role === "SEEKER") {
      navigate("/seeker-dashboard");
    } else if (user.role === "RECRUITER") {
      navigate("/recruiter-dashboard");
    }
  };

  // ==============================
  // FORGOT PASSWORD LOGIC
  // ==============================
  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!forgotEmail || !newPassword || !confirmPassword) {
      setForgotMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotMessage("Passwords do not match.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userIndex = users.findIndex((u) => u.email === forgotEmail);

    if (userIndex === -1) {
      setForgotMessage("Email not found.");
      return;
    }

    // Update password
    users[userIndex].password = newPassword;

    localStorage.setItem("users", JSON.stringify(users));

    setForgotMessage("Password updated successfully!");

    setTimeout(() => {
      setShowForgot(false);
      setForgotEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setForgotMessage("");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        {/* ================= LOGIN FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <p
          className="text-sm text-blue-600 text-center mt-3 cursor-pointer hover:underline"
          onClick={() => setShowForgot(true)}
        >
          Forgot Password?
        </p>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>

        {/* ================= FORGOT PASSWORD MODAL ================= */}
        {showForgot && (
          <div className="absolute inset-0 bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-center">
              Reset Password
            </h3>

            {forgotMessage && (
              <p className="text-sm text-green-600 mb-3 text-center">
                {forgotMessage}
              </p>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Update Password
              </button>
            </form>

            <button
              onClick={() => setShowForgot(false)}
              className="text-red-500 text-sm mt-3 block mx-auto"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;