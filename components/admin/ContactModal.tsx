"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import AlertCard from "@/components/ui/AlertCard";

interface Props {
  onSuccess: () => void;
  editingContact?: any;
  onCloseEdit?: () => void;
}

export default function ContactModal({
  onSuccess,
  editingContact,
  onCloseEdit,
}: Props) {

  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [email, setEmail] = useState("");
  const [phones, setPhones] = useState("");

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 🔹 Prefill for edit
  useEffect(() => {
    if (editingContact) {
      console.log("🧠 Editing contact:", editingContact);

      setIsOpen(true);
      setName(editingContact.name);
      setPurpose(editingContact.purpose);
      setEmail(editingContact.email || "");
      setPhones(editingContact.phoneNumbers.join(", "));
    }
  }, [editingContact]);

  // 🔹 Auto-hide alert
  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        name,
        purpose,
        email: email || null,
        phoneNumbers: phones
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
      };

      console.log("📦 Payload:", payload);

      if (editingContact) {
        console.log("✏️ Updating contact...");

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts/${editingContact.id}`,
          payload,
          { withCredentials: true }
        );

      } else {
        console.log("➕ Creating contact...");

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts`,
          payload,
          { withCredentials: true }
        );
      }

      setAlert({
        message: editingContact
          ? "Contact updated"
          : "Contact added",
        type: "success",
      });

      // reset
      setName("");
      setPurpose("");
      setEmail("");
      setPhones("");

      onSuccess();

      if (onCloseEdit) onCloseEdit();

      setTimeout(() => setIsOpen(false), 1500);

    } catch (err: any) {
      console.error("❌ Error:", err);

      if (err.response) {
        console.error("📛 Backend:", err.response.data);
      }

      setAlert({
        message: "Failed to save contact",
        type: "error",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button (only for add) */}
      {!editingContact && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Contact
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          if (onCloseEdit) onCloseEdit();
        }}
        title={editingContact ? "Edit Contact" : "Add Contact"}
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
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Purpose (e.g. Plumber)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Phone numbers (comma separated)"
            value={phones}
            onChange={(e) => setPhones(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingContact
              ? "Update Contact"
              : "Add Contact"}
          </button>

        </div>
      </Modal>
    </>
  );
}