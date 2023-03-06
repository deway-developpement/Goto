module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'react/prop-types': 'off',
        'react/jsx-indent': ['error', 4],
    },
    overrides: [
        {
            files: ['.*.js', '*.config.js', '*.config.json'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
};
