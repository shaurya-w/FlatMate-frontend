import React from 'react'

const AdminMetrics = () => {
  return (
    <>
      {/* Dashboard Summary */}
    <div     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

      {/* Notices */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Notices
        </h3>
        <p className="text-xs text-gray-600">
          2 active announcements
        </p>
      </div>

      {/* Pending Dues */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Pending Dues
        </h3>
        <p className="text-xs text-gray-600">
          ₹4,500 pending
        </p>
      </div>

      {/* Residents */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Residents
        </h3>
        <p className="text-xs text-gray-600">
          120 registered
        </p>
      </div>

      {/* Reports */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Reports
        </h3>
        <p className="text-xs text-gray-600">
          Monthly summary ready
        </p>
      </div>
    </div>
    </>
  )
}

export default AdminMetrics;