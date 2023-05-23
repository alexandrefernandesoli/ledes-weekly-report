import { MyDocument } from './pdfView'
import MainLayout from '@/components/MainLayout'
import prisma from '@/lib/prisma'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

const Report = async ({ params }: { params: { id: string } }) => {
  const supabase = createServerComponentSupabaseClient({ headers, cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const report = await prisma.report.findUnique({
    where: {
      id: params.id,
    },
    include: {
      project: true,
    },
  })

  if (!report) {
    redirect('/')
  }

  return (
    <MainLayout>
      <div>{report.id}</div>
      <MyDocument report={report} />
    </MainLayout>
  )
}

export default Report
