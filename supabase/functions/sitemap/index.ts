// Public sitemap.xml generator — listing all products + main routes
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const origin = url.searchParams.get("origin") || "https://thewomen.lovable.app";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: products } = await supabase
      .from("products")
      .select("id, updated_at, category")
      .order("updated_at", { ascending: false });

    const today = new Date().toISOString().slice(0, 10);
    const staticUrls = [
      "", "/shop", "/tailor-made", "/login", "/signup",
      "/shop?category=Kurtis",
      "/shop?category=Ethnic%20Dresses",
      "/shop?category=Co-ord%20Sets",
      "/shop?category=Tailor%20Made",
      "/shop?filter=new",
      "/shop?filter=bestseller",
    ];

    const urls = [
      ...staticUrls.map((p) => `<url><loc>${origin}${p}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq></url>`),
      ...(products || []).map((p: any) =>
        `<url><loc>${origin}/product/${p.id}</loc><lastmod>${(p.updated_at || today).slice(0, 10)}</lastmod><changefreq>weekly</changefreq></url>`,
      ),
    ].join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

    return new Response(xml, {
      headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  } catch (e: any) {
    console.error("sitemap error:", e);
    return new Response(`<?xml version="1.0"?><error>${e.message}</error>`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
    });
  }
});
