"use client";

import ChargesSection from "../../../app/admin-dashboard/settings/ChargesSection";
import ContactsSection from "../../../app/admin-dashboard/settings/ContactsSection";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-10">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage charges and society contacts
        </p>
      </div>

      <ChargesSection />

      <ContactsSection />

    </div>
  );
}