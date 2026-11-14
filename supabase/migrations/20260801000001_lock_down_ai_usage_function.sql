-- try_increment_ai_usage trusts its p_user_id and p_limit arguments and runs
-- as SECURITY DEFINER. Postgres grants EXECUTE to PUBLIC by default, so any
-- signed-in user could call it through PostgREST with another user's id (to
-- burn their daily quota) or an enormous limit. Only the API routes, which use
-- the service role, may call it.
REVOKE ALL ON FUNCTION try_increment_ai_usage(UUID, DATE, TEXT, INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION try_increment_ai_usage(UUID, DATE, TEXT, INT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION try_increment_ai_usage(UUID, DATE, TEXT, INT) TO service_role;
