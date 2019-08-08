module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    plugins: ['lit', 'prettier'],
    extends: ['plugin:lit/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        semi: ['warn', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'require-jsdoc': 'off',
        // 'indent': ['error', 4],
        'max-len': [
            'error',
            120,
            {
                ignoreTemplateLiterals: true,
            },
        ],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-underscore-dangle': ['error', { allowAfterThis: true }],
        'prettier/prettier': 'warn',
        'no-underscore-dangle': ['error', { allow: ['__useDefault'] }],
    },
}
