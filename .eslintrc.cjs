module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb-typescript'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './frontend/tsconfig.json',
      './backend/tsconfig.json'
    ]
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'linebreak-style': ['error', 'windows'],
    '@typescript-eslint/no-explicit-any': 0
  },
  overrides: [
    {
      files: ['./backend/**/*'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
}
