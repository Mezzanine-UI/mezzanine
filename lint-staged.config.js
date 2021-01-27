module.exports = {
  '*.@(js|jsx|ts|tsx)': ['eslint --ext .js,.jsx,.ts,.tsx --fix'],
  '*.@(css|sass|scss)': ['stylelint --fix'],
  '*.@(html|mdx)': ['prettier --write', 'eslint --ext .html,.mdx --fix'],
  '*.@(json|md)': ['prettier --write'],
};
