'use client'

import { Project, Report } from '@prisma/client'
import { jsPDF } from 'jspdf'
import moment from 'moment'
import slugify from 'slugify'

export const MyDocument = ({
  report,
}: {
  report: Report & { project: Project }
}) => {
  const onClickButton = () => {
    const doc = new jsPDF()

    let line = 0

    const getLine = () => {
      line = line + 8
      return line
    }

    doc.text(
      `Relatório do dia ${moment(report.createdAt).format(
        'DD/MM/YYYY',
      )} do projeto ${report.project.name}`,
      10,
      getLine(),
    )

    const content = report.content as { tasksThisWeek: string[] }

    for (const linha of content.tasksThisWeek) {
      doc.text(linha, 10, getLine())
    }

    const docname =
      slugify(
        `${moment(report.createdAt).format(
          'DD/MM/YYYY',
        )} relatório ${report.project.name.toLowerCase()} `,
        '_',
      ) + '.pdf'

    doc.save(docname)
  }

  return (
    <>
      <button onClick={onClickButton}>Baixar pdf</button>
    </>
  )
}
