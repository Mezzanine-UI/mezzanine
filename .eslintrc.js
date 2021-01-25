module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  plugins: [
    'import',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'arrow-parens': [
      2,
      'as-needed',
      {
        requireForBlockBody: true,
      },
    ],
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'only-multiline',
      },
    ],
    indent: [2, 2],
    'import/prefer-default-export': 0,
    'no-async-promise-executor': 0,
    'no-bitwise': [
      0,
      {
        allow: [
          '~',
        ],
        int32Hint: true,
      },
    ],
    'no-trailing-spaces': 2,
    'no-multiple-empty-lines': [
      2,
      {
        max: 1,
      },
    ],
    'padding-line-between-statements': [
      2,
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: [
          'const',
          'let',
          'var',
        ],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: [
          'const',
          'let',
          'var',
        ],
        next: [
          'const',
          'let',
          'var',
        ],
      },
      {
        blankLine: 'always',
        prev: 'directive',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'directive',
        next: 'directive',
      },
      {
        blankLine: 'always',
        prev: 'block-like',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: 'multiline-const',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: 'multiline-expression',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: 'multiline-let',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: 'multiline-var',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: 'switch',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: 'import',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'import',
        next: 'import',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'case',
      },
      {
        blankLine: 'any',
        prev: 'case',
        next: 'case',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'default',
      },
      {
        blankLine: 'any',
        prev: 'case',
        next: 'default',
      },
    ],
    'prefer-arrow-callback': [
      2,
      {
        allowNamedFunctions: true,
      },
    ],
    quotes: [
      2,
      'single',
    ],
    'quote-props': [2, 'as-needed'],
  },
  overrides: [
    {
      files: [
        './**/*.js',
      ],
      rules: {
        'no-unused-vars': [
          2,
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
      },
    },
    {
      files: [
        './**/*.{ts,tsx}',
      ],
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: [
        '@typescript-eslint',
      ],
      parserOptions: {
        project: './tsconfig.*?.json',
      },
      rules: {
        'import/no-extraneous-dependencies': [
          2,
          {
            packageDir: [
              './',
              './packages/core',
              './packages/ng',
              './packages/react',
            ],
          },
        ],
        'import/prefer-default-export': 0,
        indent: 0,
        'max-len': [
          2,
          {
            code: 120,
          },
        ],
        'no-underscore-dangle': [
          2,
          {
            allowAfterThis: true,
          },
        ],
        'operator-linebreak': [
          2,
          'after',
          {
            overrides: {
              '?': 'before',
              ':': 'before',
            },
          },
        ],
        'prefer-arrow-callback': [
          2,
          {
            allowNamedFunctions: true,
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/indent': [2, 2],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-unused-vars': [
          2,
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
      },
    },
    {
      files: [
        './packages/icons/**/*.ts',
      ],
      rules: {
        'max-len': 0,
      },
    },
    {
      files: [
        './packages/react/**/*.tsx',
        './**/*.mdx',
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: [
        'airbnb/hooks',
        'plugin:react/recommended',
      ],
      plugins: [
        'react',
        'react-hooks',
      ],
      settings: {
        react: {
          pragma: 'React',
          version: 'detect',
        },
      },
      rules: {
        'jsx-a11y/label-has-for': 0,
        'react/display-name': 0,
        'react/jsx-closing-bracket-location': [
          2,
          {
            nonEmpty: 'tag-aligned',
            selfClosing: 'tag-aligned',
          },
        ],
        'react/jsx-filename-extension': 0,
        'react/jsx-fragments': 0,
        'react/jsx-no-target-blank': 0,
        'react/jsx-props-no-spreading': 0,
        'react/prop-types': 0,
        'react/react-in-jsx-scope': 0,
        'react/static-property-placement': 0,
      },
    },
    {
      files: [
        './packages/ng/**/*.ts',
      ],
      parserOptions: {
        project: './packages/ng/tsconfig.*?.json',
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        /**
         * @todo fix bugs
         */
        // 'plugin:@angular-eslint/template/process-inline-templates',
      ],
      rules: {
        '@angular-eslint/directive-selector': [
          2,
          {
            type: 'attribute',
            prefix: 'mzn',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          2,
          {
            type: ['element', 'attribute'],
            prefix: 'mzn',
            style: 'kebab-case',
          },
        ],
      },
    },
    // {
    //   files: ['./packages/ng/**/*.html'],
    //   parser: '@angular-eslint/template-parser',
    //   extends: [
    //     'plugin:@angular-eslint/template/recommended',
    //   ],
    // },
    {
      files: [
        './**/*.spec.{ts,tsx}',
      ],
      rules: {
        'max-classes-per-file': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-useless-constructor': 0,
      },
    },
    {
      files: [
        './**/*.mdx',
      ],
      extends: [
        'plugin:mdx/recommended',
      ],
      rules: {
        'no-unused-vars': 0,
      },
    },
  ],
};
