'use client'

import { Project, Report, User } from '@prisma/client'
import { jsPDF } from 'jspdf'
import { DownloadIcon } from 'lucide-react'
import moment from 'moment'
import slugify from 'slugify'

export const MyDocument = ({
  report,
}: {
  report: Report & { project: Project; user: User }
}) => {
  const onClickButton = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16, // or "smart", default is 16
    })

    const reportDate = moment(report.createdAt).format('DD/MM/YYYY HH:mm:ss')

    let currentLine = 25
    doc.setFontSize(28)
    doc.text(`Relatório Ledes Weekly Report`, 20, currentLine)

    currentLine += 12
    doc.setFontSize(16)
    doc.text(`Projeto: ${report.project.name}`, 20, currentLine)

    currentLine += 8
    doc.text(`Autor: ${report.user.name}`, 20, currentLine)

    currentLine += 8
    doc.text(`Data de submissão: ${reportDate}`, 20, currentLine)

    const content = report.content as {
      tasksThisWeek: string[]
      tasksNextWeek: string[]
    }

    currentLine += 10
    doc.setFontSize(14).setFont(doc.getFont().fontName, 'normal', 'bold')
    doc.text('Tarefas realizadas na semana:', 20, currentLine)

    doc.setFontSize(12).setFont(doc.getFont().fontName, 'normal', 'normal')

    content.tasksThisWeek.forEach((linha, index) => {
      currentLine += 6
      doc.text(`${index + 1}. ${linha}`, 20, currentLine)
    })

    currentLine += 10
    doc.setFontSize(14).setFont(doc.getFont().fontName, 'normal', 'bold')
    doc.text('Tarefas planejadas para a próxima semana:', 20, currentLine)

    doc.setFontSize(12).setFont(doc.getFont().fontName, 'normal', 'normal')

    content.tasksNextWeek.forEach((linha, index) => {
      currentLine += 6
      doc.text(`${index + 1}. ${linha}`, 20, currentLine)
    })

    const docName =
      slugify(
        `${moment(report.createdAt).format(
          'DD/MM/YYYY',
        )} relatório ${report.project.name.toLowerCase()} `,
        '_',
      ) + '.pdf'

    doc.save(docName)
  }

  return (
    <>
      <button
        className="flex w-fit gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-zinc-50 hover:bg-zinc-800"
        onClick={onClickButton}
      >
        <DownloadIcon />
        Baixar relatório
      </button>
    </>
  )
}
