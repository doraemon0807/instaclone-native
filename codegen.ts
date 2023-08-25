import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://tasty-colts-beg.loca.lt/graphql",
  documents: ["./**/*.{tsx,ts}"],
  ignoreNoDocuments: true,
  generates: {
    "./gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
