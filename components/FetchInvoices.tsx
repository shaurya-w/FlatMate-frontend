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

  return (
    <div className="space-y-3 text-black">

      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="border p-4 rounded flex justify-between"
        >

          <div>
            <p>Invoice #{invoice.id}</p>
            <p>₹{invoice.totalAmount}</p>
            <p>Status: {invoice.status}</p>
          </div>

          {invoice.status !== "PAID" && (
            <PayButton invoiceId={invoice.id} />
          )}

        </div>
      ))}

    </div>
  )
}