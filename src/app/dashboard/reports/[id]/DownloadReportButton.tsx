'use client'

import { generatePDFDownload } from '@/lib/generatePDFDownload'
import { ReactNode } from 'react'

export const DownloadReportButton = ({
  report,
  className,
  children,
}: {
  report: any
  className: string
  children: ReactNode
}) => {
  return (
    <button className={className} onClick={() => generatePDFDownload(report)}>
      {children}
    </button>
  )
}
