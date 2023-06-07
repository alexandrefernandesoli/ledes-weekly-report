'use client'

import { Project, Report, User } from '@prisma/client'
import { jsPDF } from 'jspdf'
import { ArrowDownToLineIcon } from 'lucide-react'
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

    const reportDate = moment(report.createdAt).format('DD/MM/YYYY')

    let currentLine = 25
    doc.setFontSize(28)
    doc.text(`Relatório LWR`, 20, currentLine)

    currentLine += 12
    doc.setFontSize(16)
    doc.text(`Projeto: ${report.project.name}`, 20, currentLine)

    currentLine += 6
    doc.text(`Data: ${reportDate}`, 20, currentLine)

    currentLine += 6
    doc.text(`Autor: ${report.user.name}`, 20, currentLine)

    const content = report.content as {
      tasksThisWeek: string[]
      tasksNextWeek: string[]
    }

    currentLine += 10
    doc.setFontSize(14).setFont(doc.getFont().fontName, 'normal', 'bold')
    doc.text('Tarefas realizadas na semana:', 20, currentLine)

    doc.setFontSize(12).setFont(doc.getFont().fontName, 'normal', 'normal')
    for (const linha of content.tasksThisWeek) {
      currentLine += 6
      doc.text(linha, 20, currentLine)
    }

    currentLine += 10
    doc.setFontSize(14).setFont(doc.getFont().fontName, 'normal', 'bold')
    doc.text('Tarefas planejadas para a próxima semana:', 20, currentLine)

    doc.setFontSize(12).setFont(doc.getFont().fontName, 'normal', 'normal')
    for (const linha of content.tasksNextWeek) {
      currentLine += 6
      doc.text(linha, 20, currentLine)
    }

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
        className="flex w-fit gap-2 rounded-lg bg-zinc-700 px-2 py-1 text-zinc-50"
        onClick={onClickButton}
      >
        <ArrowDownToLineIcon />
        Baixar relatório
      </button>
    </>
  )
}
