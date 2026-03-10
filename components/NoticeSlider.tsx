"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export interface Notice {
  id: number
  title: string
  content: string
  authorName: string
  tags: string[]
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
      <div className="h-[35vh] flex items-center justify-center">
        Loading notices...
      </div>
    )
  }

  return (
    <div className="h-[35vh] w-full overflow-x-auto flex gap-4 py-4 px-2">
      {notices.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} />
      ))}
    </div>
  )
}

function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <div className="min-w-[300px] bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border">
      
      <div>
        <h3 className="text-lg text-black font-semibold mb-2">
          {notice.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          {notice.content}
        </p>

        <div className="flex flex-wrap gap-2 mb-2">
          {notice.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 flex justify-between mt-2">
        <span>{notice.authorName}</span>
        <span>
          {new Date(notice.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}