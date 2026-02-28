"use client";

import { useState, useEffect} from "react";

interface AdminTableRow {
  flatId: number;
  flatNumber: string;
  wing: string;

  userId: number;
  name: string;
  phone: string;
  email: string;

  totalPendingAmount: number;
  status: string;
}

export default function RenderUsers() {

const [users, setUsers] = useState<AdminTableRow[]>([]);
const [loadingUsers, setLoadingUsers] = useState(true);

useEffect(() => {
  let isMounted = true;

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await fetch(
        "http://localhost:8080/api/admin/dashboard",
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();

      if (isMounted) {
        setUsers(data);
      }

    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      if (isMounted) {
        setLoadingUsers(false);
      }
    }
  };

  fetchUsers();

  return () => {
    isMounted = false;
  };
}, []);

 //console.log("Fetched users:", users);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: number) => {
  setSelectedIds((prev) =>
    prev.includes(id)
      ? prev.filter((i) => i !== id)
      : [...prev, id]
  );
};

const selectAll = () => {
  if (selectedIds.length === users.length) {
    setSelectedIds([]);
  } else {
    setSelectedIds(users.map((u) => u.userId));
  }
};

const sendusers = async () => {
    console.log("Selected user IDs:", selectedIds);

  if (selectedIds.length === 0) {
    alert("Select at least one user");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch("/api/send-invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceIds: selectedIds })  //send raw array of IDs to backend
    });

    const data = await response.json();

    if (data.success) {
      alert("Users sent successfully!");
      setSelectedIds([]);
    } else {
      alert("Failed to send users");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending users");
  } finally {
    setLoading(false);
  }
};


// return (
//   <div className="p-10">
//     <h1 className="text-2xl font-semibold mb-6">Manage Residents</h1>

//     <button
//       onClick={selectAll}
//       className="mb-4 px-4 py-2 bg-gray-200 text-black rounded"
//     >
//       {selectedIds.length === users.length
//         ? "Unselect All"
//         : "Select All"}
//     </button>

//     <div className="overflow-x-auto">
//       <table className="min-w-full border border-gray-300">
//         <thead className="bg-gray-100 text-black">
//           <tr>
//             <th className="p-3"></th>
//             <th className="p-3 text-left">Wing</th>
//             <th className="p-3 text-left">Flat Number</th>
//             <th className="p-3 text-left">Name</th>
//             <th className="p-3 text-left">Phone</th>
//             <th className="p-3 text-left">Email</th>
//             <th className="p-3 text-left">Total Pending</th>
//             <th className="p-3 text-left">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.length === 0 ? (
//             <tr>
//               <td colSpan={8} className="text-center p-6 text-gray-500">
//                 No users found
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user.userId} className="border-t hover:bg-gray-50">
//                 <td className="p-3">
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.includes(user.userId)}
//                     onChange={() => toggleSelect(user.userId)}
//                   />
//                 </td>

//                 <td className="p-3">{user.wing}</td>
//                 <td className="p-3">{user.flatNumber}</td>
//                 <td className="p-3">{user.name}</td>
//                 <td className="p-3">{user.phone}</td>
//                 <td className="p-3">{user.email}</td>
//                 <td className="p-3 font-semibold">
//                   ₹ {user.totalPendingAmount}
//                 </td>
//                 <td
//                   className={`p-3 font-medium ${
//                     user.status === "OVERDUE"
//                       ? "text-red-600"
//                       : user.status === "PENDING"
//                       ? "text-yellow-600"
//                       : "text-green-600"
//                   }`}
//                 >
//                   {user.status}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>

//     <button
//       onClick={sendusers}
//       disabled={loading || selectedIds.length === 0}
//       className="mt-6 px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//     >
//       {loading ? "Sending..." : "Send Selected Users"}
//     </button>
//   </div>
// );


return (
  // <div className="p-10 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Residents
        </h1>

        <button
          onClick={selectAll}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
        >
          {selectedIds.length === users.length ? "Unselect All" : "Select All"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-3"></th>
              <th className="p-3 text-left">Wing</th>
              <th className="p-3 text-left">Flat</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Pending</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-10 text-gray-400">
                  No residents found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.userId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.userId)}
                      onChange={() => toggleSelect(user.userId)}
                      className="w-4 h-4"
                    />
                  </td>

                  <td className="p-3 font-medium">{user.wing}</td>
                  <td className="p-3">{user.flatNumber}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">{user.email}</td>

                  <td className="p-3 font-semibold text-gray-800">
                    ₹ {user.totalPendingAmount}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "OVERDUE"
                          ? "bg-red-100 text-red-600"
                          : user.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={sendusers}
          disabled={loading || selectedIds.length === 0}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow disabled:opacity-40 transition"
        >
          {loading ? "Sending..." : "Send Selected Users"}
        </button>
      </div>
    </div>
  // </div>
);
}