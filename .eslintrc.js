module.exports = {
  root: true,
  files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
  extends: ['@react-native', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
