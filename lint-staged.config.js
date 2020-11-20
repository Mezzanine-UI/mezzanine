module.exports = {
  '*.@(js|jsx|ts|tsx)': ['eslint --ext .js,.jsx,.ts,.tsx --fix'],
  '*.mdx': ['prettier --write', 'eslint --ext .mdx --fix'],
  '*.@(css|sass|scss)': ['stylelint --fix'],
  '*.@(json|md)': ['prettier --write'],
};
