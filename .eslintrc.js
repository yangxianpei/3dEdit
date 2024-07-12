module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:react/recommended',
        // 'prettier',
        'plugin:react-hooks/recommended'
    ],
    rules: {
        '@typescript-eslint/no-unused-expressions': 0,
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/no-shadow': 0,
        '@typescript-eslint/dot-notation': 0,
        '@typescript-eslint/method-signature-style': 0,
        '@typescript-eslint/array-type': 0,
        '@typescript-eslint/consistent-type-imports': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-use-before-define': 0,
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 0,
        'react-hooks/exhaustive-deps': 1,
        'react/display-name': 0,
        'react/no-children-prop': 0,
        'react/no-array-index-key': 0,
        'no-undef': 0,
        'no-alert': 0,
        'no-unused-expressions': 'off',
        'no-param-reassign': 0,
        'no-underscore-dangle': 0,
        'no-plusplus': 0,
        'no-else-return': 0,
        'no-nested-ternary': 0,
        'no-console': 0,
        'consistent-return': 0,
        'spaced-comment': 0,
        'import/no-dynamic-require': 0,
        'object-shorthand': 0,
        'func-names': 0,
        'prefer-template': 0,
        'prefer-destructuring': 0,
        'global-require': 0,
        'no-useless-constructor': 0,
        'react-hooks/rules-of-hooks': 2,
        'react-hooks/exhaustive-deps': 1,
        '@typescript-eslint/no-explicit-any': 0
    },
    ignorePatterns: ['.eslintrc.js'],
    settings: {
        react: {
            version: 'detect'
        }
    }
};
