import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/legacy/**',
      'apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx',
      'apps/legacy-import/cryptic-vault-demo/components/CrypticVaultScene.tsx',
      'apps/legacy-import/cryptic-vault-demo/scripts/**/*.js',
      'apps/legacy-import/cryptic-vault-demo/components/ClusterVisualization.tsx',
      'apps/legacy-import/cryptic-vault-demo/components/KeyboardControls.tsx',
      'apps/legacy-import/cryptic-vault-demo/components/CategoryHUD.tsx',
      'apps/legacy-import/cryptic-vault-demo/scripts/verify.ts',
      'apps/legacy-import/cryptic-vault-demo/store/__tests__/**',
      'apps/legacy-import/cryptic-vault-demo/utils/**',
      'apps/legacy-import/cryptic-vault-demo/store/graph-utils.ts',
      'apps/legacy-import/cryptic-vault-demo/components/BrainMeshView.tsx',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }
)
