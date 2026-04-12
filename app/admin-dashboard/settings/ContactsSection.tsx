"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AlertCard from "@/components/ui/AlertCard";
import ContactModal from "@/components/admin/ContactModal";

interface Contact {
  id: number;
  name: string;
  purpose: string;
  email?: string;
  phoneNumbers: string[];
}

export default function ContactsSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchContacts = async () => {
    try {
      console.log("📡 Fetching contacts...");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts/society/1`,
        { withCredentials: true }
      );

      console.log("✅ Contacts:", res.data);

      setContacts(res.data);

    } catch (err) {
      console.error("❌ Failed to fetch contacts");

      setAlert({
        message: "Failed to load contacts",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      console.log("🗑 Deleting contact:", id);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts/${id}`,
        { withCredentials: true }
      );

      setContacts((prev) => prev.filter((c) => c.id !== id));

      setAlert({
        message: "Contact deleted",
        type: "success",
      });

    } catch (err) {
      console.error("❌ Delete failed");

      setAlert({
        message: "Failed to delete contact",
        type: "error",
      });
    }
  };

  return (
    <div className="mt-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Society Contacts
        </h2>

        <ContactModal
        onSuccess={fetchContacts}
        editingContact={editingContact}
        onCloseEdit={() => setEditingContact(null)}
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

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >

            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">
                {contact.name}
              </h3>

              <div className="flex gap-3">

                {/* Edit */}
                <button
                    onClick={() => {
                    console.log("✏️ Editing contact:", contact);
                    setEditingContact(contact);
                    }}
                    className="text-blue-600 text-sm hover:underline"
                >
                    Edit
                </button>

                {/* Delete */}
                <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-500 text-sm hover:underline"
                >
                    Delete
                </button>

                </div>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {contact.purpose}
            </p>

            {contact.email && (
              <p className="text-sm text-gray-500"> 
                {contact.email}
              </p>
            )}

            <div className="mt-2 text-sm text-gray-700">
              {contact.phoneNumbers.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}