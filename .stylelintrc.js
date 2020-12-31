module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss'
  ],
  plugins: [
    'stylelint-order',
    'stylelint-scss'
  ],
  rules: {
    'color-hex-case': 'lower',
    indentation: 2,
    'at-rule-empty-line-before': [
      'always',
      {
        ignore: [
          'after-comment',
          'first-nested'
        ],
        ignoreAtRules: [
          'use',
          'forward',
          'include',
          'if',
          'else'
        ]
      }
    ],
    'at-rule-no-vendor-prefix': true,
    'block-closing-brace-newline-after': [
      'always',
      {
        ignoreAtRules: [
          'if',
          'else'
        ]
      }
    ],
    'media-feature-name-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'declaration-no-important': true,
    'selector-pseudo-class-no-unknown': true,
    'order/order': [
      'custom-properties',
      'declarations'
    ],
    'scss/selector-no-redundant-nesting-selector': true
  }
};
