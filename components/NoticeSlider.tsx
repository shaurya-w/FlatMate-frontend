"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export interface Notice {
  id: number
  title: string
  content: string
  authorName: string
  createdAt: string
  expirationDate: string
}

export default function NoticeSlider({ societyId }: { societyId: number }) {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notices/society/${societyId}`, {
          withCredentials: true
        })

        setNotices(res.data)
      } catch (error) {
        console.error("Failed to fetch notices", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  if (loading) {
    return (
      <div
        className="h-36 flex items-center justify-center rounded-xl border"
        style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        <span className="text-sm">Loading notices…</span>
      </div>
    )
  }

  if (notices.length === 0) {
    return (
      <div
        className="h-36 flex items-center justify-center rounded-xl border"
        style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        <span className="text-sm">No notices right now</span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto flex gap-4 py-2 px-0.5 pb-3">
      {notices.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} />
      ))}
    </div>
  )
}

function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <div
      className="min-w-[280px] max-w-[280px] rounded-xl border p-4 flex flex-col justify-between transition-shadow duration-150 hover:shadow-md"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div>
        <h3 className="text-sm font-semibold mb-1.5 leading-snug" style={{ color: "var(--foreground)" }}>
          {notice.title}
        </h3>
        <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: "var(--muted-foreground)" }}>
          {notice.content}
        </p>
      </div>
      <div
        className="flex justify-between items-center text-xs pt-2 border-t"
        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        <span className="font-medium">{notice.authorName}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem" }}>
          {new Date(notice.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}