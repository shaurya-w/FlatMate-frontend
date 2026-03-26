"use client"

import { useEffect, useState } from "react"
import PayButton from "./InvoicePayButton"


export interface Invoice {
  id: number
  totalAmount: number
  status: "ISSUED" | "PAID" | "OVERDUE"
  dueDate: string
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL

export default function FetchInvoices({ userId }: { userId: number }) {

  //const [invoices, setInvoices] = useState<Invoice[]>([])
  //const [loading, setLoading] = useState(true)

          // Mock data for testing
       const invoices: Invoice[] = [
        { id: 1, totalAmount: 500, status: "ISSUED", dueDate: "2024-07-01" },
        { id: 2, totalAmount: 1500, status: "PAID", dueDate: "2024-06-15" },
        { id: 3, totalAmount: 750, status: "OVERDUE", dueDate: "2024-06-10" },
      ]
//   useEffect(() => {

//     async function loadInvoices() {



//       const res = await fetch(`${API}/users/${userId}/invoices`)
//       const data: Invoice[] = await res.json()

//       setInvoices(data)
//       setLoading(false)
//     }

//     loadInvoices()

//   }, [userId])

//   if (loading) return <p>Loading invoices...</p>

//   if (invoices.length === 0) {
//     return <p>No invoices found</p>
//   }

  const statusStyle = (status: string) => {
    if (status === "OVERDUE") return { background: "#fef2f2", color: "#dc2626" };
    if (status === "PAID") return { background: "#f0fdf4", color: "#16a34a" };
    return { background: "#fffbeb", color: "#d97706" };
  };

  return (
    <div className="space-y-2">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex items-center justify-between p-4 rounded-lg border transition-colors duration-100"
          style={{
            background: "var(--secondary)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}
            >
              #{invoice.id}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Space Mono', monospace" }}>
                ₹{invoice.totalAmount}
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Due {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={statusStyle(invoice.status)}
            >
              {invoice.status}
            </span>
            {invoice.status !== "PAID" && (
              <PayButton invoiceId={invoice.id} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}