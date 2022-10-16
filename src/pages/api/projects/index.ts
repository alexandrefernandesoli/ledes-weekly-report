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

  res.json({ projects: data });
});
