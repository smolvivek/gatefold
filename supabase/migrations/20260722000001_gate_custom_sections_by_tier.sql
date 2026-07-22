-- Custom sections (custom_1/2/3) are a Pro/Studio feature. The only place
-- this was enforced was the edit page's Sidebar UI (tier === "free" check in
-- components/layout/Sidebar.tsx) — a client-side gate. Every write to
-- pitch_sections happens directly from the browser via supabase-js
-- (DEBT.md D-03), so any authenticated free-tier user could bypass the UI
-- entirely (devtools console, or a tampered localStorage draft) and insert
-- custom_1/2/3 rows themselves. RLS never checked tier at all.
--
-- This moves the enforcement to the only real trust boundary: the database.
--
-- Depends on public.user_owns_pitch(), added in FIX_RLS_RECURSION.sql —
-- apply that first if it hasn't been run against this project yet.

CREATE OR REPLACE FUNCTION public.pitch_owner_tier(p_pitch_id UUID)
RETURNS TEXT AS $$
  SELECT COALESCE(
    CASE
      WHEN s.tier IS NULL THEN 'free'
      WHEN s.status = 'cancelled'
        AND s.current_period_end IS NOT NULL
        AND s.current_period_end < now()
        THEN 'free'
      ELSE s.tier
    END,
    'free'
  )
  FROM public.pitches p
  JOIN public.users u ON u.id = p.user_id
  LEFT JOIN public.subscriptions s ON s.user_id = u.auth_id
  WHERE p.id = p_pitch_id
$$ LANGUAGE sql SECURITY DEFINER STABLE;

DROP POLICY IF EXISTS "pitch_sections_insert_own" ON pitch_sections;
CREATE POLICY "pitch_sections_insert_own" ON pitch_sections FOR INSERT
  WITH CHECK (
    public.user_owns_pitch(pitch_id)
    AND (
      section_name NOT IN ('custom_1', 'custom_2', 'custom_3')
      OR public.pitch_owner_tier(pitch_id) != 'free'
    )
  );

DROP POLICY IF EXISTS "pitch_sections_update_own" ON pitch_sections;
CREATE POLICY "pitch_sections_update_own" ON pitch_sections FOR UPDATE
  USING (public.user_owns_pitch(pitch_id))
  WITH CHECK (
    public.user_owns_pitch(pitch_id)
    AND (
      section_name NOT IN ('custom_1', 'custom_2', 'custom_3')
      OR public.pitch_owner_tier(pitch_id) != 'free'
    )
  );
