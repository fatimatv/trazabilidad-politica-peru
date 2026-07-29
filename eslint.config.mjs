import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".next/**", ".vercel/**", "node_modules/**"]
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
];
