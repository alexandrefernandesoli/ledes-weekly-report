import { jsPDF } from 'jspdf'
import moment from 'moment/moment'
import slugify from 'slugify'
import { Database } from '@/lib/database.types'
import 'moment/locale/pt-br'
moment.locale('pt-br')

type ReportType = Database['public']['Tables']['report']['Row'] & {
  project: Database['public']['Tables']['project']['Row'] | null
  profile: Database['public']['Tables']['profile']['Row'] | null
}
export const generatePDFDownload = (report: ReportType) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16, // or "smart", default is 16
  })

  const reportDate = moment(report.created_at).local().format('LLLL')

  let currentLine = 25
  doc.setFontSize(28)
  doc.text(`Relatório Ledes Weekly Report`, 20, currentLine)

  currentLine += 12
  doc.setFontSize(16)
  doc.text(`Projeto: ${report.project!.name}`, 20, currentLine)

  currentLine += 8
  doc.text(`Autor: ${report.profile!.name}`, 20, currentLine)

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
      `${moment(report.created_at).format(
        'YYYY/MM/DD',
      )} relatório ${report.project!.name!.toLowerCase()} `,
      '_',
    ) + '.pdf'

  doc.save(docName)
}
