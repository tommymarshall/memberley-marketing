import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const outputDirectory = new URL('../dist/', import.meta.url);
const pagePaths = [
    'index.html',
    'help/index.html',
    'privacy/index.html',
    'terms/index.html',
    'alternatives/member-splash/index.html',
    'alternatives/pooldues/index.html',
    'alternatives/courtreserve/index.html',
    'alternatives/wild-apricot/index.html',
    'alternatives/clubexpress/index.html',
];

const competitorLogos = {
    'alternatives/member-splash/index.html': '/competitors/member-splash.png',
    'alternatives/pooldues/index.html': '/competitors/pooldues.png',
    'alternatives/courtreserve/index.html': '/competitors/courtreserve.svg',
    'alternatives/wild-apricot/index.html': '/competitors/wild-apricot.svg',
    'alternatives/clubexpress/index.html': '/competitors/clubexpress.png',
};

const pages = await Promise.all(
    pagePaths.map(async (pagePath) => {
        const html = await readFile(new URL(pagePath, outputDirectory), 'utf8');
        return { pagePath, html };
    }),
);

for (const { pagePath, html } of pages) {
    assert.match(html, /id="site-header"/, `${pagePath} must use the shared header`);
    assert.match(
        html,
        /id="site-header" class="fixed inset-x-0/,
        `${pagePath} must keep the floating header out of document flow`,
    );
    assert.match(
        html,
        /site-header-offset/,
        `${pagePath} must preserve content clearance behind the fixed header`,
    );
    assert.match(
        html,
        /Built in Northern Virginia for the clubs that bring neighbors together\./,
        `${pagePath} must use the shared footer`,
    );
    assert.doesNotMatch(html, /14-day/, `${pagePath} still contains old trial copy`);
    assert.match(
        html,
        /<a href="#main" class="skip-link">/,
        `${pagePath} must start with the keyboard skip link`,
    );
    assert.match(html, /<main id="main">/, `${pagePath} must expose a main landmark for the skip link`);
    assert.match(
        html,
        /Start your free trial/,
        `${pagePath} must use the shared trial CTA label`,
    );
    assert.doesNotMatch(
        html,
        /Start (a |your )?45-day (free )?trial|>\s*45-day free trial\s*<\/a>/,
        `${pagePath} still uses a retired trial CTA variant`,
    );
    assert.doesNotMatch(
        html,
        /support@memberley\.com/,
        `${pagePath} must point at tommy@memberley.com, not the retired support@ address`,
    );

    // A slow or hung vendor must never hold up the page: a plain stylesheet link
    // to fonts.googleapis.com blanked it until Google answered, and a deferred
    // GhostChat tag held DOMContentLoaded just as long.
    const outsideNoscript = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
    for (const link of outsideNoscript.match(/<link\b[^>]*>/g) ?? []) {
        assert.ok(
            !(/\brel="stylesheet"/.test(link) && /\bhref="https?:\/\//.test(link)),
            `${pagePath} loads a third-party stylesheet that blocks first paint: ${link}`,
        );
    }
    for (const script of outsideNoscript.match(/<script\b[^>]*\bsrc="https?:\/\/[^"]*"[^>]*>/g) ?? []) {
        assert.match(script, /\basync\b/, `${pagePath} loads a third-party script that is not async: ${script}`);
    }
    assert.match(
        html,
        /window\.addEventListener\('load'[\s\S]*?api\.ghostchat\.dev\/widget\.js/,
        `${pagePath} must inject the GhostChat widget after the page has loaded`,
    );
}

for (const [pagePath, logo] of Object.entries(competitorLogos)) {
    const html = pages.find((page) => page.pagePath === pagePath)?.html ?? '';
    assert.match(
        html,
        /no Memberley fee/,
        `${pagePath} price row must mention the no-fee Community plan`,
    );
    assert.doesNotMatch(html, /§/, `${pagePath} must not decorate eyebrows with section signs`);
    assert.match(
        html,
        /\/memberley-amper-light\.svg/,
        `${pagePath} comparison table must show the Memberley logo`,
    );
    assert.ok(
        html.split(logo).length >= 3,
        `${pagePath} must show the competitor logo in both the hero and the comparison table`,
    );
}

const homepage = pages.find(({ pagePath }) => pagePath === 'index.html')?.html ?? '';

for (const path of [
    '/alternatives/member-splash',
    '/alternatives/pooldues',
    '/alternatives/courtreserve',
    '/alternatives/wild-apricot',
    '/alternatives/clubexpress',
]) {
    assert.ok(homepage.includes(path), `Homepage must link to ${path}`);
}

assert.match(homepage, /45-day free trial/, 'Homepage must emphasize the extended trial');
assert.match(homepage, /https:\/\/demo\.memberley\.com/, 'Homepage must link to the live demo');
assert.doesNotMatch(
    homepage,
    /One workspace for the whole season/,
    'Homepage must not include the retired season audience strip',
);
assert.match(
    homepage,
    /min-h-\[3\.5rem\]/,
    'Homepage comparison cards must reserve a consistent title row',
);
assert.match(
    homepage,
    /\/hero-macbook[a-z0-9-]*\.webp/,
    'Homepage must use the transparent MacBook product hero',
);
assert.match(homepage, /\/product\/payments\.webp/, 'Homepage must include product proof');
assert.match(
    homepage,
    /\/hero-macbook-768\.webp 768w/,
    'Homepage hero image must ship responsive sources',
);
assert.match(
    homepage,
    /\/product\/dashboard\.webp/,
    'Homepage demo section must show the dashboard, not repeat the hero roster',
);
assert.match(homepage, /class="hero-facts/, 'Homepage hero must list the trial terms as facts');
assert.match(
    homepage,
    /Standard Stripe processing fees apply/,
    'Homepage pricing must disclose processing fees next to the plans',
);
assert.match(
    homepage,
    /Using something else\?/,
    'Homepage comparison grid must catch clubs on unlisted systems',
);
assert.doesNotMatch(
    homepage,
    /data-palette/,
    'Production markup must not expose the retired palette switcher',
);
assert.doesNotMatch(
    homepage,
    /data-placeholder-testimonials/,
    'Placeholder testimonials must never ship in a production build',
);

assert.match(
    homepage,
    />\s*Staffing\s*<\/span>[\s\S]*?\$250\/yr/,
    'Homepage pricing must list the Staffing module at its seeded price',
);

// The app lets clubs invite staff aged 14 to 17 (plan 023); these legal
// sentences have to be live before that ships.
const termsPage = pages.find(({ pagePath }) => pagePath === 'terms/index.html')?.html ?? '';
const privacyPage = pages.find(({ pagePath }) => pagePath === 'privacy/index.html')?.html ?? '';

assert.match(
    termsPage,
    /may invite a person aged 14 to 17 to use the Service as one of its staff/,
    'Terms must carry the teen-staff exception to the 18+ rule',
);
assert.match(
    privacyPage,
    /Organizations may invite people aged 14 to 17 to work as staff\./,
    'Privacy Policy must describe what teen staff accounts hold',
);
assert.match(
    privacyPage,
    /Staff records, for people an Organization schedules as staff:/,
    'Privacy Policy must list staff records among the information collected',
);
assert.match(
    privacyPage,
    /never for staff an Organization has marked as under 18/,
    'Privacy Policy must say advertising tags never load for staff under 18',
);

const helpPage = pages.find(({ pagePath }) => pagePath === 'help/index.html')?.html ?? '';

assert.match(helpPage, /Email Tommy/, 'Help CTA must name the person who answers');
assert.match(
    helpPage,
    /Open the live demo/,
    'Help FAQ about the demo must link straight to it',
);

const courtReservePage =
    pages.find(({ pagePath }) => pagePath === 'alternatives/courtreserve/index.html')?.html ?? '';

assert.doesNotMatch(
    courtReservePage,
    /pool-first/i,
    'CourtReserve comparison must not position Memberley as pool-first',
);
assert.match(
    courtReservePage,
    /Registration, payment, and every court block/,
    'CourtReserve comparison must showcase the complete class and event workflow',
);
assert.match(
    courtReservePage,
    /Members \+ guests/,
    'CourtReserve comparison must mention public and member registration',
);
assert.match(
    courtReservePage,
    /Automatic waitlist/,
    'CourtReserve comparison must mention automatic waitlists',
);
assert.match(
    courtReservePage,
    /Runs beyond the season/,
    'CourtReserve comparison must mention off-season programming',
);
assert.match(
    courtReservePage,
    /Point of sale &amp; inventory/,
    'CourtReserve comparison must show how clubs can expand into additional modules',
);

console.log(`Marketing smoke checks passed for ${pages.length} pages.`);
