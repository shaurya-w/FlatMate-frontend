"use client";

import { useState } from "react";
import axios from "axios";
import Modal from "./Modal";

interface NoticeModalProps {
societyId: number;
}

interface NoticeRequest {
  title: string;
  content: string;
  societyId: number;
  durationInDays: number | "";
  tags: string[];
}

export default function NoticeModal({ societyId }: NoticeModalProps) {

const [isOpen, setIsOpen] = useState(false);
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [duration, setDuration] = useState<number | "">("");
const [tags, setTags] = useState("");
const [loading, setLoading] = useState(false);

const submitNotice = async () => {
  try {
    console.log("Submitting notice...");

    const payload: NoticeRequest = {
      title,
      content,
      societyId,
      durationInDays: duration,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    console.log("Payload:", payload);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/notices`,
      payload,
      { withCredentials: true }
    );

    console.log("Notice created:", response.data);

  } catch (error: any) {
    console.error("Error submitting notice:", error);

    if (error.response) {
      console.error("Backend response:", error.response.data);
    }
  }
};

return (
<>
<button
onClick={() => setIsOpen(true)}
className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
>
Create Notice </button>

  <Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Create Notice"
  >
    <div className="space-y-4">

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Title
        </label>
        <input
          className="text-black w-full border rounded-md p-2"
          placeholder="Enter notice title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Content
        </label>
        <textarea
          rows={4}
          className="text-black w-full border rounded-md p-2"
          placeholder="Enter notice content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Duration (days)
        </label>
        <input
          type="number"
          min={1}
          className="text-black w-full border rounded-md p-2"
          placeholder="Enter duration in days"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input
          className="text-black w-full border rounded-md p-2"
          placeholder="maintenance, water, meeting"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <button
        onClick={submitNotice}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Notice"}
      </button>

    </div>
  </Modal>
</>


);
}
