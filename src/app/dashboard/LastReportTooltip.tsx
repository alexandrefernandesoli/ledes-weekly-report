'use client'

import moment from 'moment'
import * as Tooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'

export const LastReportTooltip = ({
  reports,
}: {
  reports: { created_at: string }[]
}) => {
  reports.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
  const lastReportDateToNow = reports[0]
    ? moment().diff(moment(reports[0].created_at), 'days')
    : -1

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            className={clsx(
              'min-h-4 min-w-4 md:min-h-6 md:min-w-6 h-4 w-4 rounded-full drop-shadow-md md:h-6 md:w-6',
              lastReportDateToNow === -1 && 'bg-zinc-800',
              lastReportDateToNow < 5 && 'bg-green-500',
              lastReportDateToNow >= 5 &&
                lastReportDateToNow < 7 &&
                'bg-yellow-500',
              lastReportDateToNow >= 7 && 'bg-red-500',
            )}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-40 rounded-lg bg-zinc-50 px-4 py-3 drop-shadow-lg"
            sideOffset={5}
          >
            {lastReportDateToNow === -1
              ? 'Nenhum relatório enviado para esse projeto'
              : lastReportDateToNow < 5
              ? 'Ultimo relatório há menos de 5 dias atrás'
              : lastReportDateToNow >= 5 && lastReportDateToNow < 7
              ? 'Ultimo relatório há mais de 5 dias atrás'
              : 'Ultimo relatório há mais de uma semana'}

            <Tooltip.Arrow className=" fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
