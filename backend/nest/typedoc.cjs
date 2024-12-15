// https://typedoc.org/guides/options
/* global module */
/** @type {import('./typedoc.cjs').TypeDocOptions} */
module.exports = {
    out: '.extras/doc/api',
    entryPoints: ['src'],
    entryPointStrategy: 'expand',
    excludePrivate: true,
    validation: {
        invalidLink: true,
    },
    // https://shiki.matsu.io/languages
};
