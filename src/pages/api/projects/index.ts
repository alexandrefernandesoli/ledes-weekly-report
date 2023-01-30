import {
  withApiAuth,
  getUser,
  supabaseServerClient,
} from '@supabase/auth-helpers-nextjs';

export default withApiAuth(async function ProtectedRoute(req, res) {
  const { user } = await getUser({ req, res });

  const supabase = supabaseServerClient({ req, res });

  const { data, error } = await supabase
    .from('projects')
    .select('*, users!inner(*), projects_users(role)')
    .eq('users.id', user.id);

  const projects = data?.map((project) => {
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

  res.json({ projects });
});
