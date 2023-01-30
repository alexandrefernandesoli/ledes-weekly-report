import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const ProtectedRoute: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    await insertReport(req, res);
  } else if (req.method === 'GET') {
    await getReports(req, res);
  } else {
    return res.status(404).json({ error: 'Not found' });
  }
};

const getReports = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.query.projectId) {
    const { data: reports } = await supabase
      .from('reports')
      .select()
      .eq('projectId', req.query.projectId)
      .eq('userId', session?.user.id);
  }

  const { data, error } = await supabase
    .from('reports')
    .select('*, projects ( name )')
    .eq('userId', session?.user.id)
    .range(0, 4)
    .order('createdAt', { ascending: false });

  if (error) {
    return res.status(500).json({ error });
  }

  const reports = data.map((entry) => ({
    id: entry.id,
    content: entry.content,
    projectName: entry.projects.name,
    userId: entry.userId,
    projectId: entry.projectId,
    createdAt: entry.createdAt,
  }));

  return res.json({ reports });
};

const insertReport = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: report, error } = await supabase.from('reports').insert({
    userId: session?.user.id,
    content: req.body.content,
    projectId: req.body.projectId,
  });

  if (error) {
    return res.status(500).json({ error });
  }

  return res.json({ report });
};

export default ProtectedRoute;
