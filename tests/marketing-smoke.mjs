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
];

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
        /Built in Northern Virginia for the clubs that bring neighbors together\./,
        `${pagePath} must use the shared footer`,
    );
    assert.doesNotMatch(html, /14-day/, `${pagePath} still contains old trial copy`);
}

const homepage = pages.find(({ pagePath }) => pagePath === 'index.html')?.html ?? '';

for (const path of [
    '/alternatives/member-splash',
    '/alternatives/pooldues',
    '/alternatives/courtreserve',
]) {
    assert.ok(homepage.includes(path), `Homepage must link to ${path}`);
}

assert.match(homepage, /45-day free trial/, 'Homepage must emphasize the extended trial');
assert.match(homepage, /https:\/\/demo\.memberley\.com/, 'Homepage must link to the live demo');
assert.match(
    homepage,
    /\/hero-macbook-ember\.webp/,
    'Homepage must use the Ember MacBook product hero',
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

console.log(`Marketing smoke checks passed for ${pages.length} pages.`);
