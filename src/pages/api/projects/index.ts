import {
  createServerSupabaseClient,
  Session,
  SupabaseClient
} from '@supabase/auth-helpers-nextjs';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { Database } from '../../../../types/supabase';

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.string(),
});

const ProtectedRoute: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res });

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

  if (req.method === 'GET') {
    if (req.query.projectId) {
      await getProject({ req, res, supabase, session });
    } else {
      await getProjects({ req, res, supabase, session });
    }
  } else if (req.method === 'POST') {
    await newProject({ req, res, supabase, session });
  } else if (req.method === 'PUT') {
    await updateProject({ req, res, supabase, session });
  } else {
    return res.status(404).json({ error: 'Not Found' });
  }
};

type NecessaryHeaders = {
  req: NextApiRequest;
  res: NextApiResponse;
  supabase: SupabaseClient<Database>;
  session: Session;
};

async function newProject({ req, res, supabase, session }: NecessaryHeaders) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .limit(1)
    .single();

  if (error || !['SUPERVISOR', 'ADMIN'].includes(user.role)) {
    return res.status(500).json({ error });
  }

  const data = {
    name: req.body.name,
    description: req.body.description,
    type: req.body.type
  }

  const { data: project, error: projectCreateError } = await supabase
    .from('projects')
    .insert(data)
    .select()
    .single();

  if (!projectCreateError) {
    await supabase.from('projects_users').insert({
      projectId: project.id,
      userId: session.user.id,
      role: 'SUPERVISOR'
    });
  }

  return res.json({ project })
}

async function updateProject({
  req,
  res,
  supabase,
  session,
}: NecessaryHeaders) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*, projects_users(*)')
    .eq('id', req.body.id)
    .limit(1)
    .single();

  if (projectError) {
    return res.status(500).json({ error: projectError });
  }

  console.log(project);

  const supervisors =
    project?.projects_users as Database['public']['Tables']['projects_users']['Row'][];

  const isSupervisor = !!supervisors.find(
    (user) => user.userId === session.user.id && user.role === 'SUPERVISOR'
  );

  if (!isSupervisor) {
    return res.status(403).json({ error: 'Não autorizado' });
  }

  try {
    console.log(req.body);
    const projectData = projectSchema
      .extend({ id: z.string(), type: z.string().optional() })
      .parse(req.body);

    const { data, error } = await supabase
      .from('projects')
      .update({ name: projectData.name, description: projectData.description })
      .eq('id', projectData.id);

    if (error) {
      return res.status(500).json({ error });
    }

    return res.json({ ok: 'Updated' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function getProjects({ req, res, supabase, session }: NecessaryHeaders) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, users!inner(*, projects_users(role)), projects_users(role)')
    .eq('users.id', session.user.id);

  if (error) {
    return res.status(500).json({ error });
  }

  const projects = data.map((project) => {
    const myRole = project.projects_users as { role: string }[];

    return {
      id: project.id,
      name: project.name,
      myRole: myRole[0].role,
      description: project.description,
      type: project.type,
      users: project.users,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  });

  return res.json({ projects });
}

async function getProject({ req, res, supabase, session }: NecessaryHeaders) {
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

  const myRole = data.projects_users as { role: string }[];

  const project = {
    id: data.id,
    name: data.name,
    myRole: myRole[0].role,
    description: data.description,
    type: data.type,
    users: data.users,
    reports: reports,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return res.json({ project });
}

export default ProtectedRoute;
