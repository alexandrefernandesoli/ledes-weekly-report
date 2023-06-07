'use client'

import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import moment from 'moment'
import Link from 'next/link'
import { useState } from 'react'

export const ReportsList = ({
  reports,
  isLoading,
}: {
  reports: any[]
  isLoading: boolean
}) => {
  const [isReportsOpen, setIsReportsOpen] = useState(true)

  return (
    <CollapsiblePrimitive.Collapsible
      open={isReportsOpen}
      onOpenChange={setIsReportsOpen}
    >
      <CollapsiblePrimitive.CollapsibleTrigger asChild>
        <h1 className="mb-4 flex cursor-pointer items-center gap-1 text-2xl">
          Histórico de relatórios{' '}
          {isReportsOpen ? (
            <ChevronDownIcon className="w-6 text-gray-800" />
          ) : (
            <ChevronUpIcon className="w-6 text-gray-800" />
          )}
        </h1>
      </CollapsiblePrimitive.CollapsibleTrigger>

      <CollapsiblePrimitive.CollapsibleContent>
        {reports.map((report, arrayId) => (
          <div
            key={report.id}
            className="mb-2 grid w-full grid-cols-3 items-center justify-evenly rounded-lg border-2 border-gray-800 px-4 py-2 text-base"
          >
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="w-6 text-gray-800" />
              <Link href={`/dashboard/reports/${report.id}`}>
                {report.project.name}
              </Link>
            </div>

            <div className="flex items-center gap-1 justify-self-center text-sm">
              <CalendarDaysIcon className="w-6" />
              {moment(report.createdAt).format('DD/MM/YYYY')}
            </div>
            {/* <div className="w-full justify-self-center">Orientador: Hudson</div> */}

            <div className="items-center justify-self-end">
              <button className="flex items-center">
                <ArrowDownTrayIcon className="w-6 text-gray-800" />
                Baixar relatório
              </button>
            </div>
          </div>
        ))}
      </CollapsiblePrimitive.CollapsibleContent>
    </CollapsiblePrimitive.Collapsible>
  )
}
