'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaAngleDown,
  FaAngleUp,
  FaCalendarAlt,
  FaDownload,
  FaFile,
} from 'react-icons/fa';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import moment from 'moment';
import { useReports } from '../lib/useReports';

export const ReportsList = () => {
  const [isReportsOpen, setIsReportsOpen] = useState(true);
  const { reports, error, isLoading } = useReports();

  return (
    <CollapsiblePrimitive.Collapsible
      open={isReportsOpen}
      onOpenChange={setIsReportsOpen}
    >
      <CollapsiblePrimitive.CollapsibleTrigger asChild>
        <h1 className="text-xl mt-4 mb-4 flex items-center gap-1 cursor-pointer">
          Histórico de Relatórios{' '}
          {isReportsOpen ? (
            <FaAngleDown className="text-gray-800" size={24} />
          ) : (
            <FaAngleUp className="text-gray-800" size={24} />
          )}
        </h1>
      </CollapsiblePrimitive.CollapsibleTrigger>

      <CollapsiblePrimitive.CollapsibleContent>
        {!isLoading &&
          !error &&
          reports.map((report, arrayId) => (
            <div
              key={report.id}
              className=" rounded-lg mb-2 border-gray-800 border-2 w-full grid grid-cols-3 px-4 py-2 text-base items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FaFile className="text-gray-800" size={28} />
                <Link href={`/report/${report.id}`}>{report.projectName}</Link>
              </div>

              <div className="justify-self-center flex items-center text-sm gap-1">
                <FaCalendarAlt />
                {moment(report.createdAt).format('DD/MM/YYYY')}
              </div>
              {/* <div className="w-full justify-self-center">Orientador: Hudson</div> */}

              <div className="justify-self-end">
                <FaDownload className="text-gray-800" size={28} />
              </div>
            </div>
          ))}
      </CollapsiblePrimitive.CollapsibleContent>
    </CollapsiblePrimitive.Collapsible>
  );
};
