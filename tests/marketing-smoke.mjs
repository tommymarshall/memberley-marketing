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
}

for (const [pagePath, logo] of Object.entries(competitorLogos)) {
    const html = pages.find((page) => page.pagePath === pagePath)?.html ?? '';
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
    /\/hero-macbook-transparent-[0-9a-f]{8}\.webp/,
    'Homepage must use the transparent MacBook product hero',
);
assert.match(homepage, /\/product\/payments\.webp/, 'Homepage must include product proof');
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
