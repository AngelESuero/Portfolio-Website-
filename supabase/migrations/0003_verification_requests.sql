create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  requested_tier text not null default 'light',
  zipcode text not null,
  status text not null default 'pending',
  note text,
  reviewed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint verification_requests_requested_tier_check check (requested_tier in ('light', 'strong')),
  constraint verification_requests_status_check check (status in ('pending', 'approved', 'denied'))
);

create unique index if not exists idx_verification_requests_pending_user
  on public.verification_requests (user_id)
  where status = 'pending';

alter table public.verification_requests enable row level security;

drop policy if exists "Users can view their verification requests" on public.verification_requests;
create policy "Users can view their verification requests"
  on public.verification_requests for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create pending verification requests" on public.verification_requests;
create policy "Users can create pending verification requests"
  on public.verification_requests for insert
  with check (
    auth.uid() = user_id
    and requested_tier = 'light'
    and status = 'pending'
  );

drop policy if exists "Service role can update verification requests" on public.verification_requests;
create policy "Service role can update verification requests"
  on public.verification_requests for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

revoke all on public.verification_requests from anon, authenticated;
grant select, insert on public.verification_requests to authenticated;
grant select, insert, update on public.verification_requests to service_role;

drop policy if exists "Users can insert their profile" on public.users;
drop policy if exists "Users can update their profile" on public.users;

create policy "Users can insert their profile"
  on public.users for insert
  with check (
    auth.uid() = id
    and verification_tier = 'unverified'
    and zipcode is null
    and ward is null
    and neighborhood is null
  );

revoke all on public.users from authenticated;
grant select on public.users to authenticated;
grant insert (id) on public.users to authenticated;

grant select, insert on public.users to service_role;
grant update (verification_tier) on public.users to service_role;
