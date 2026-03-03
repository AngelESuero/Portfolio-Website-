create or replace function public.admin_resolve_verification_request(
  p_request_id uuid,
  p_reviewer_id uuid,
  p_decision text,
  p_note text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.verification_requests%rowtype;
begin
  if p_decision not in ('approve', 'deny') then
    return 'invalid_decision';
  end if;

  select *
  into v_request
  from public.verification_requests
  where id = p_request_id
  for update;

  if not found then
    return 'not_found';
  end if;

  if v_request.status <> 'pending' then
    return 'already_resolved';
  end if;

  if p_decision = 'approve' then
    update public.users
    set verification_tier = 'light'
    where id = v_request.user_id;
  end if;

  update public.verification_requests
  set
    status = case when p_decision = 'approve' then 'approved' else 'denied' end,
    note = p_note,
    reviewed_by = p_reviewer_id,
    reviewed_at = now()
  where id = p_request_id;

  return 'ok';
end;
$$;

create or replace function public.admin_transition_issue_status(
  p_issue_id uuid,
  p_actor_id uuid,
  p_to_status text,
  p_note text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_from_status text;
begin
  if p_to_status not in ('Submitted', 'Under review', 'Responded', 'In progress', 'Resolved') then
    return 'invalid_status';
  end if;

  select status
  into v_from_status
  from public.issues
  where id = p_issue_id
  for update;

  if not found then
    return 'not_found';
  end if;

  update public.issues
  set status = p_to_status
  where id = p_issue_id;

  insert into public.status_events (
    issue_id,
    actor_id,
    from_status,
    to_status,
    note
  )
  values (
    p_issue_id,
    p_actor_id,
    v_from_status,
    p_to_status,
    p_note
  );

  return 'ok';
end;
$$;

revoke all on function public.admin_resolve_verification_request(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.admin_resolve_verification_request(uuid, uuid, text, text) to service_role;

revoke all on function public.admin_transition_issue_status(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.admin_transition_issue_status(uuid, uuid, text, text) to service_role;
