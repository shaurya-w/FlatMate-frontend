"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AlertCard from "@/components/ui/AlertCard";
import ChargeModal from "@/components/admin/ChargeModal";

interface Charge {
  societyChargeId: number;
  chargeTypeName: string;
  chargeTypeDescription: string;
  amount: number;
  calculationType: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  active: boolean;
}

export default function ChargesSection() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [editingCharge, setEditingCharge] = useState<any | null>(null);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        console.log("📡 Fetching charges...");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/charges/society/1`,
          { withCredentials: true }
        );

        console.log("✅ Charges response:", res.data);

        setCharges(res.data.charges);
        setTotal(res.data.totalMonthlyCharges);

      } catch (err: any) {
        console.error("❌ Failed to fetch charges:", err);

        setAlert({
          message: "Failed to load charges",
          type: "error",
        });

      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
  }, []);

  useEffect(() => {
  if (!alert) return;

  const timer = setTimeout(() => {
    console.log("🧹 Clearing alert");
    setAlert(null);
  }, 3000);

  return () => clearTimeout(timer);
}, [alert]);

  const handleDelete = async (id: number) => {
  try {
    console.log("🗑 Deleting charge:", id);

    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/charges/society/1/${id}`,
      { withCredentials: true }
    );

    console.log("✅ Deleted. Updated data:", res.data);

    setCharges(res.data.charges);
    setTotal(res.data.totalMonthlyCharges);

    setAlert({
      message: "Charge deleted",
      type: "success",
    });

    } catch (err: any) {
        console.error("❌ Delete failed:", err);

        setAlert({
        message: "Failed to delete charge",
        type: "error",
        });
    }
    };

  return (
    <div className="mt-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <div>
            <h2 className="text-xl font-semibold text-gray-900">
            Charge Management
            </h2>
            <p className="text-sm text-gray-600">
            View and manage all society charges
            </p>
        </div>

        <ChargeModal
        onSuccess={(data) => {
            setCharges(data.charges);
            setTotal(data.totalMonthlyCharges);
        }}
        editingCharge={editingCharge}
        onCloseEdit={() => setEditingCharge(null)}
        />

        </div>

      {/* Alert */}
      {alert && (
        <div className="mb-4">
          <AlertCard
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Total */}
      <div className="mb-4 text-sm text-gray-700">
        Total Monthly Charges:{" "}
        <span className="font-semibold text-gray-900">
          ₹{total}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">

        <table className="min-w-full border-collapse">

          <thead className="bg-gray-100 text-sm text-gray-800">
            <tr>
              <th className="p-3 text-left">Charge</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Loading charges...
                </td>
              </tr>
            ) : charges.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No charges found
                </td>
              </tr>
            ) : (
              charges.map((charge) => (
                <tr
                  key={charge.societyChargeId}
                  className={`border-t ${
                    !charge.active ? "opacity-50" : ""
                  }`}
                >

                  <td className="p-3 font-medium text-gray-900">
                    {charge.chargeTypeName}
                  </td>

                  <td className="p-3 text-sm text-gray-600">
                    {charge.chargeTypeDescription}
                  </td>

                  <td className="p-3 font-semibold text-gray-900">
                    ₹{charge.amount}
                  </td>

                  <td className="p-3 text-sm">
                    {charge.calculationType}
                  </td>

                  <td className="p-3">
                    {charge.active ? (
                      <span className="text-green-600 text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-500 text-sm">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-3 space-x-2">

                    {/* Edit */}
                    <button
                        onClick={() => {
                        console.log("✏️ Editing:", charge);
                        setEditingCharge(charge);
                        }}
                        
                        className="text-blue-600 text-sm hover:underline"
                    >
                        Edit
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => handleDelete(charge.societyChargeId)}
                        className="text-red-600 text-sm hover:underline"
                    >
                        Delete
                    </button>

                    </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}