module.exports = {
  env: {
    // 브라우저의 document와 같은 객체 사용 여부
    browser: true,
    es2021: true,
  },
  parserOptions: {
    // 자바스크립트 버전
    ecmaVersion: 'latest',
    // 모듈 export를 위해 import, export를 사용 가능여부를 설정
    sourceType: 'module',
    // jsx 허용을 설정
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:storybook/recommended',
    'plugin:tailwindcss/recommended',
  ],
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: 'detect',
    },
  },
  plugins: [
    'react',
    'jsx-a11y',
    'autofix',
    'import',
  ],
  rules: {
    // 0: disabled, 1: warning, 2: error
    // --- REACT --- //
    'react/jsx-props-no-spreading': 0,
    'react/jsx-no-useless-fragment': 0,
    'react/prop-types': 0,
    'react/style-prop-object': 0,
    'react/function-component-definition': 0,
    // 'react/function-component-definition': [
    //   'warn',
    //   { namedComponents: 'arrow-function' },
    // ],
    'react/no-unescaped-entities': 0,
    'react/destructuring-assignment': 0,
    'react/button-has-type': 0,
    'react/no-unknown-property': 0,
    'react/no-array-index-key': 1,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [ // allow JSX in TSX files
      2,
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      },
    ],

    // --- JSX --- //
    'jsx-a11y/alt-text': 0,
    'jsx-a11y/iframe-has-title': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-redundant-roles': 0,
    'jsx-a11y/media-has-caption': 0,
    // 'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: ['label'],
        labelAttributes: ['htmlFor'],
        controlComponents: ['input'],
      },
    ],

    // --- TAILWINDCSS --- //
    'tailwindcss/no-custom-classname': 'off',

    // --- OTHERS --- //
    'global-require': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-undef': 1,
    'no-unused-vars': 1,
    'no-underscore-dangle': 0,
    'max-len': 0,
    'nonblock-statement-body-position': 0,
    'no-plusplus': 0,
    'no-continue': 0,
    'no-shadow': 0,
    'arrow-parens': [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'array-bracket-newline': [
      'error',
      {
        multiline: true,
        minItems: 2,
      },
    ],
    'array-element-newline': [
      'error',
      'always',
    ],
    'function-paren-newline': [
      'error',
      'consistent',
    ],
    'function-call-argument-newline': [
      'error',
      'consistent',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
    curly: [
      'error',
      'multi',
    ],
    'import/no-extraneous-dependencies': 0,
    'prefer-destructuring': 0,

    // dangerous, but only way to shut up eslint when using import aliases
    'import/no-unresolved': 0,
    // 'import/prefer-default-export': 0,
    'import/extensions': 0,

    // https://itnext.io/7-recommended-eslint-rules-for-react-typescript-project-1a22b011b4b5
    'arrow-body-style': [
      'error',
      'as-needed',
    ],
    'react/self-closing-comp': [
      'error',
      { component: true, html: true },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: '@/**/**',
            group: 'parent',
            position: 'before',
          },
        ],
        alphabetize: { order: 'asc' },
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../'],
      },
    ],
  },
};
