import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://rickandmortyapi.com/graphql",
  documents: "app/graphql/**/*.ts",
  generates: {
    "app/graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations", 
        "typescript-react-apollo"
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false
      }
    }
  }
};

export default config;
