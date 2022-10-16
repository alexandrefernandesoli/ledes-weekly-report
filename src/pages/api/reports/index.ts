import {
  withApiAuth,
  getUser,
  supabaseServerClient,
} from '@supabase/auth-helpers-nextjs';

export default withApiAuth(async function ProtectedRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }

  const { user } = await getUser({ req, res });

  const supabase = supabaseServerClient({ req, res });

  const report = await supabase.from('reports').insert({
    userId: user.id,
    content: req.body.content,
    projectId: req.body.projectId,
  });

  res.json({ report });
});
