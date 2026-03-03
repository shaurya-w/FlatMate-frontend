"use client";

import { useState } from "react";
import Modal from "./ui/Modal";

interface NoticeModalProps {
  societyId: number;
}

export default function NoticeModal({ societyId }: NoticeModalProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState(1);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addTag = () => {
    if (!tagInput.trim()) return;
    const formatted = tagInput.startsWith("#")
      ? tagInput
      : `#${tagInput}`;
    setTags([...tags, formatted]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const submitNotice = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          societyId,
          durationInDays: duration,
          tags,
        }),
      });

      if (!response.ok) throw new Error();

      setIsOpen(false);
      setTitle("");
      setContent("");
      setDuration(1);
      setTags([]);

    } catch (err) {
      console.error(err);
      alert("Failed to create notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Create Notice
      </button>

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
              className="w-full border rounded-md p-2"
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
              className="w-full border rounded-md p-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Duration (Days)
            </label>
            <input
              type="number"
              className="w-full border rounded-md p-2"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Tags
            </label>

            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-md p-2"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button
                onClick={addTag}
                type="button"
                className="px-3 py-2 bg-gray-200 rounded-md"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="px-2 py-1 bg-gray-200 text-sm rounded-md cursor-pointer"
                >
                  {tag} ✕
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={submitNotice}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Notice"}
          </button>

        </div>

      </Modal>
    </>
  );
}