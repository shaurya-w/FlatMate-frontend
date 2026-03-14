"use client"

import { useRouter } from "next/navigation"

interface Props {
  invoiceId: number
}

export default function PayButton({ invoiceId }: Props) {

  const router = useRouter()

  const handleClick = () => {
    router.push(`/pay/${invoiceId}`)
  }

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 text-white px-4 py-1 rounded"
    >
      Pay Now
    </button>
  )
}