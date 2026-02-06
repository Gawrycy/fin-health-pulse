import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const users = [
      {
        email: "andrzej.juchta@gmail.com",
        password: "testpassword1",
        role: "admin",
      },
      {
        email: "juchta.andrzej@zabka.pl",
        password: "testpassword2",
        role: "client_admin",
      },
    ];

    const results = [];

    for (const u of users) {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((eu) => eu.email === u.email);

      let userId: string;

      if (existing) {
        userId = existing.id;
        results.push({ email: u.email, status: "already_exists", userId });
      } else {
        const { data: created, error: createError } = await supabase.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
        });
        if (createError) {
          results.push({ email: u.email, status: "error", error: createError.message });
          continue;
        }
        userId = created.user.id;
        results.push({ email: u.email, status: "created", userId });
      }

      if (u.role === "admin") {
        // Add as portal_admin
        const { error: staffError } = await supabase
          .from("portal_staff")
          .upsert(
            { user_id: userId, email: u.email, full_name: "Andrzej Juchta", role: "portal_admin", is_active: true },
            { onConflict: "user_id" }
          );
        if (staffError) {
          results.push({ email: u.email, role_status: "error", error: staffError.message });
        }
      } else if (u.role === "client_admin") {
        // Create or find organization
        let orgId: string;
        const { data: existingOrg } = await supabase
          .from("organizations")
          .select("id")
          .eq("name", "Żabka Polska")
          .maybeSingle();

        if (existingOrg) {
          orgId = existingOrg.id;
        } else {
          const { data: newOrg, error: orgError } = await supabase
            .from("organizations")
            .insert({ name: "Żabka Polska", billing_email: u.email })
            .select("id")
            .single();
          if (orgError) {
            results.push({ email: u.email, org_status: "error", error: orgError.message });
            continue;
          }
          orgId = newOrg.id;
        }

        // Add as org_admin
        const { error: memberError } = await supabase
          .from("organization_members")
          .upsert(
            {
              user_id: userId,
              organization_id: orgId,
              email: u.email,
              full_name: "Andrzej Juchta",
              role: "org_admin",
              is_active: true,
            },
            { onConflict: "user_id" }
          );
        if (memberError) {
          results.push({ email: u.email, member_status: "error", error: memberError.message });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
