"use client";

import DashboardLayout from "@/components/layout/dashboardlayout";
import ComplaintModal from "@/components/ComplaintFormModal";

export default function UserDashboardTest() {
  const mockUser = {
    name: "Aayush Yadav",
    role: "USER",
  };

  const notices = [
    {
      id: 1,
      title: "Diwali Festival Celebration",
      content:
        "Join us for the Grand Diwali Celebration in the central park.",
      tag: "EVENT",
      date: "Nov 12, 2024",
    },
    {
      id: 2,
      title: "Elevator Maintenance",
      content:
        "Tower A elevators will be down for maintenance tomorrow.",
      tag: "MAINTENANCE",
      date: "Oct 25, 2024",
    },
    {
      id: 3,
      title: "Water Supply Cut",
      content:
        "Water supply interruption from 12 PM to 4 PM.",
      tag: "ALERT",
      date: "Oct 28, 2024",
    },
  ];

  return (
    <DashboardLayout name={mockUser.name}>

      {/* Welcome Section */}
      <div className="mb-8">
        <p className="text-orange-500 text-sm">Welcome back,</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {mockUser.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening in Sunrise Apartments
        </p>
      </div>

      {/* Notice Board */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Notice Board
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-500">
                  {notice.date}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900">
                {notice.title}
              </h3>

              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {notice.content}
              </p>

              <div className="mt-4 text-xs text-gray-400">
                {notice.tag}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Flat Details */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              A-404
            </h2>
            <p className="text-gray-600">
              Tower A, Sunrise Apartments
            </p>
          </div>

          <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
            OWNER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

          <div>
            <p className="text-gray-500">Floor</p>
            <p className="font-medium text-gray-900">4th Floor</p>
          </div>

          <div>
            <p className="text-gray-500">Residents</p>
            <p className="font-medium text-gray-900">4 Members</p>
          </div>

          <div>
            <p className="text-gray-500">Registered Owner</p>
            <p className="font-medium text-gray-900">
              {mockUser.name}
            </p>
          </div>

        </div>

      </div>

      {/* Complaint Button */}
      <div className="flex justify-end">
        <ComplaintModal />
      </div>

    </DashboardLayout>
  );
}