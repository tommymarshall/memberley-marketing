import type { APIRoute } from 'astro';

// This endpoint must run on the server. The project is currently configured
// for static output, so deploying this route requires an SSR adapter (e.g.
// @astrojs/vercel, @astrojs/netlify, @astrojs/node) wired into astro.config.mjs.
//
// Required env vars:
//   RESEND_API_KEY        — Resend secret API key
//   RESEND_AUDIENCE_ID    — id of the audience to add contacts to
export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export const POST: APIRoute = async ({ request }) => {
    let payload: { email?: string; org_type?: string | null; variant?: string };
    try {
        payload = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body.' }, 400);
    }

    const email = (payload.email ?? '').trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
        return json({ error: 'Please enter a valid email address.' }, 400);
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    const audienceId = import.meta.env.RESEND_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
        console.error(
            'Missing RESEND_API_KEY or RESEND_AUDIENCE_ID environment variables.',
        );
        return json(
            { error: 'Signup is temporarily unavailable. Please try again later.' },
            500,
        );
    }

    try {
        const res = await fetch(
            `https://api.resend.com/audiences/${audienceId}/contacts`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    unsubscribed: false,
                    // Resend stores arbitrary fields on the contact object;
                    // first_name lets us label by org type for now.
                    first_name: payload.org_type ?? undefined,
                }),
            },
        );

        if (!res.ok) {
            const detail = await res.text();
            // Idempotent re-signups: treat "already exists" as success.
            if (res.status === 409 || /already/i.test(detail)) {
                return json({ ok: true, deduped: true });
            }
            console.error('Resend contact create failed:', res.status, detail);
            return json(
                { error: 'We couldn\u2019t save your email. Please try again.' },
                502,
            );
        }

        return json({ ok: true });
    } catch (err) {
        console.error('Resend request error:', err);
        return json(
            { error: 'Network hiccup — please try again in a moment.' },
            502,
        );
    }
};
