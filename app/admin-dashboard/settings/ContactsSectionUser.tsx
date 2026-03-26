"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ContactModal from "@/components/admin/ContactModal";

interface Contact {
  id: number;
  name: string;
  purpose: string;
  email?: string;
  phoneNumbers: string[];
}

export default function ContactsSectionUser() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchContacts = async () => {
    try {
      console.log("Fetching contacts from backend...");

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts/society/1`;
      console.log("API URL:", url);

      const res = await axios.get<Contact[]>(url, {
        withCredentials: true,
      });

      console.log("Raw response:", res);
      console.log("Response data:", res.data);
      console.log("Number of contacts received:", res.data.length);

      setContacts(res.data);

      console.log("Contacts state updated");

    } catch (err: any) {
      console.error("Failed to fetch contacts");

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Backend response:", err.response.data);
      } else {
        console.error("Error object:", err);
      }

      setAlert({
        message: "Failed to load contacts",
        type: "error",
      });
    }
  };

  useEffect(() => {
    console.log("ContactsSectionUser mounted");
    fetchContacts();
  }, []);

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

      {/* Debug info */}
      <div className="mb-4 text-sm text-gray-500">
        Total contacts loaded: {contacts.length}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((contact, index) => {
          console.log("Rendering contact:", contact);

          return (
            <div
              key={contact.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">
                  {contact.name}
                </h3>
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
                {contact.phoneNumbers.map((p, i) => {
                  console.log(`Phone ${i} for ${contact.name}:`, p);
                  return <div key={i}>{p}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}