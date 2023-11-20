create table public.project (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  type text not null,
  created_at timestamp default now() not null
);

create table public.profile (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text not null,
  role text,
  created_at timestamp default now() not null
);

create table public.report (
  id uuid default uuid_generate_v4() primary key,
  content json,
  user_id uuid references profile (id),
  project_id uuid references project (id),
  created_at timestamp default now() not null
);

create table public.project_member (
  user_id uuid references public.profile (id),
  project_id uuid references public.project (id),
  role text not null,
  assigned_at timestamp default now() not null,
  primary key (user_id, project_id)
);