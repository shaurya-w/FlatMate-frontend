"use client";

import { useState } from "react";
import Modal from "./ui/Modal";

export default function ComplaintModal() {

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComplaint = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error();

      setIsOpen(false);
      setTitle("");
      setDescription("");

    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 border rounded-md hover:bg-gray-100"
      >
        Raise Complaint
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Raise Complaint"
      >

        <div className="space-y-4">

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Title
            </label>
            <input
              className="w-full border rounded-md p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full border rounded-md p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={submitComplaint}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>

        </div>

      </Modal>
    </>
  );
}