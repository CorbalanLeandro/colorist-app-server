module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'typescript-sort-keys'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:typescript-sort-keys/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'sort-keys': 'error',
    '@typescript-eslint/member-ordering': [
      'error',
      { 
        'default': [
          'constructor',
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          '#private-static-field',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          '#private-static-method',
          'public-method',
          'protected-method',
          'private-method',
          '#private-method',
        ]
      }
    ],
  },
};
