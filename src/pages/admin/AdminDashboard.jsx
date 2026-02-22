import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalSeekers: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const applications =
      JSON.parse(localStorage.getItem("applications")) || [];

    const recruiters = users.filter(
      (user) => user.role === "RECRUITER"
    );

    const seekers = users.filter(
      (user) => user.role === "SEEKER"
    );

    setStats({
      totalUsers: users.length,
      totalRecruiters: recruiters.length,
      totalSeekers: seekers.length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
    });
  }, []);

  const Card = ({ title, value, bgColor, borderColor }) => (
    <div
      className={`rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 ${bgColor} border-l-8 ${borderColor}`}
    >
      <h2 className="text-gray-600 text-sm uppercase mb-3 tracking-wide">
        {title}
      </h2>
      <p className="text-4xl font-extrabold text-gray-800">
        {value}
      </p>
    </div>
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="p-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Overview of platform statistics
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            title="Total Users"
            value={stats.totalUsers}
            bgColor="bg-blue-50"
            borderColor="border-blue-500"
          />

          <Card
            title="Total Recruiters"
            value={stats.totalRecruiters}
            bgColor="bg-green-50"
            borderColor="border-green-500"
          />

          <Card
            title="Total Job Seekers"
            value={stats.totalSeekers}
            bgColor="bg-purple-50"
            borderColor="border-purple-500"
          />

          <Card
            title="Total Jobs"
            value={stats.totalJobs}
            bgColor="bg-yellow-50"
            borderColor="border-yellow-500"
          />

          <Card
            title="Total Applications"
            value={stats.totalApplications}
            bgColor="bg-pink-50"
            borderColor="border-pink-500"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;