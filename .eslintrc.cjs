module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './frontend/tsconfig.json',
      './backend/tsconfig.json',
    ],
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'linebreak-style': ['error', 'windows'],
    '@typescript-eslint/no-explicit-any': 0,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: [
          './frontend/tsconfig.json',
          './backend/tsconfig.json',
        ],
      },
    },
  },
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    '**/transactional/**'
  ],
  overrides: [
    {
      files: ['./backend/**/*'],
      extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'no-console': 'off',
        'react/prop-types': 'off',
        'no-use-before-define': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'warn',
        'import/extensions': 'off',
      },
      env: {
        node: true,
      },
    },
    {
      files: ['./frontend/**/*'],
      extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:react-hooks/recommended',
      ],
      plugins: ['react'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'import/extensions': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
      },
      env: {
        browser: true,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['./frontend/src/components/**/*'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
