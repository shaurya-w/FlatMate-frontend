"use client";

import { useState } from "react";

interface Invoice {
  id: number;
  flat: string;
  amount: number;
}

export default function InvoicePage() {
  const invoices: Invoice[] = [
    { id: 4, flat: "A-203", amount: 2800 },
    { id: 2, flat: "B-104", amount: 3200 },
    { id: 3, flat: "C-302", amount: 2500 },
  ];

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
    if (selectedIds.length === invoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invoices.map((i) => i.id));
    }
  };

  const sendInvoices = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/send-invoices", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ invoiceIds: selectedIds }),
});

      const data = await response.json();

      if (data.success) {
        alert("Invoices sent successfully!");
        setSelectedIds([]);
      } else {
        alert("Failed to send invoices");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending invoices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Invoices</h1>

      <button
        onClick={selectAll}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        {selectedIds.length === invoices.length
          ? "Unselect All"
          : "Select All"}
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3"></th>
              <th className="p-3 text-left">Flat</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(invoice.id)}
                    onChange={() => toggleSelect(invoice.id)}
                  />
                </td>
                <td className="p-3">{invoice.flat}</td>
                <td className="p-3">₹ {invoice.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={sendInvoices}
        disabled={loading || selectedIds.length === 0}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Selected Invoices"}
      </button>
    </div>
  );
}