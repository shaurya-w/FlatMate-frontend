"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import AlertCard from "@/components/ui/AlertCard";

interface Props {
  onSuccess: (data: any) => void;
  editingCharge?: any;
  onCloseEdit?: () => void;
}


export default function ChargeModal({
  onSuccess,
  editingCharge,
  onCloseEdit
}: Props) {

useEffect(() => {
  if (editingCharge) {
    console.log("🧠 Prefilling edit data:", editingCharge);

    setIsOpen(true);
    setName(editingCharge.chargeTypeName);
    setDescription(editingCharge.chargeTypeDescription);
    setAmount(editingCharge.amount);
    setEffectiveFrom(editingCharge.effectiveFrom?.split("T")[0] || "");
    setEffectiveTo(editingCharge.effectiveTo?.split("T")[0] || "");
  }
}, [editingCharge]);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async () => {
    try {
      console.log("🚀 Creating charge...");

      setLoading(true);

      const payload = {
        chargeTypeName: name,
        chargeTypeDescription: description,
        amount: Number(amount),
        calculationType: "FIXED",
        effectiveFrom,
        effectiveTo: effectiveTo || null,
      };

      console.log("📦 Payload:", payload);

      let res;

if (editingCharge) {
  console.log("✏️ Updating charge...");

  res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/charges/society/1/${editingCharge.societyChargeId}`,
    {
      amount: Number(amount),
      calculationType: "FIXED",
      effectiveFrom,
      effectiveTo: effectiveTo || null,
    },
    { withCredentials: true }
  );

    } else {
    console.log("➕ Creating charge...");

    res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/charges/society/1/7`,
        {
        chargeTypeName: name,
        chargeTypeDescription: description,
        amount: Number(amount),
        calculationType: "FIXED",
        effectiveFrom,
        effectiveTo: effectiveTo || null,
        },
        { withCredentials: true }
    );
    }

      console.log("✅ Charge created:", res.data);

      onSuccess(res.data);

    setAlert({
    message: editingCharge
        ? "Charge updated successfully"
        : "Charge added successfully",
    type: "success",
    });

    if (onCloseEdit) onCloseEdit();

      // reset form
      setName("");
      setDescription("");
      setAmount("");
      setEffectiveFrom("");
      setEffectiveTo("");

      setTimeout(() => {
        setIsOpen(false);
      }, 1500);

    } catch (err: any) {
      console.error("❌ Error creating charge:", err);

      setAlert({
        message: "Failed to add charge",
        type: "error",
      });

      if (err.response) {
        console.error("📛 Backend:", err.response.data);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Charge
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Charge"
      >
        <div className="space-y-4">

          {alert && (
            <AlertCard
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}

          <input
            className="w-full border p-2 rounded"
            placeholder="Charge Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={effectiveTo}
            onChange={(e) => setEffectiveTo(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Charge"}
          </button>

        </div>
      </Modal>
    </>
  );
}