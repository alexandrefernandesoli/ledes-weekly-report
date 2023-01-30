import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler } from 'next';

const ProtectedRoute: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({
      error: 'not_authenticated',
      description:
        'The user does not have an active session or is not authenticated',
    });
  }

  if (req.query.projectId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, users!inner(*, projects_users(role)), projects_users(role)')
      .eq('id', req.query.projectId)
      .eq('users.id', session.user.id)
      .limit(1)
      .single();

    if (error) {
      return res.status(500).json({ error });
    }

    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select()
      .eq('projectId', req.query.projectId)
      .eq('userId', session.user.id)
      .order('createdAt', { ascending: false });

    if (reportsError) {
      return res.status(500).json({ reportsError });
    }

    const project = {
      id: data.id,
      name: data.name,
      myRole: data.projects_users[0].role,
      description: data.description,
      type: data.type,
      users: data.users,
      reports: reports,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return res.json({ project });
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*, users!inner(*, projects_users(role)), projects_users(role)')
    .eq('users.id', session.user.id);

  if (error) {
    return res.status(500).json({ error });
  }

  const projects = data.map((project) => {
    return {
      id: project.id,
      name: project.name,
      myRole: project.projects_users[0].role,
      description: project.description,
      type: project.type,
      users: project.users,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  });

  return res.json({ projects });
};

export default ProtectedRoute;
