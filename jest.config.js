// jest config
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

const esModules = [
  "unified",
  "remark",
  "remark-.*",
  "bail",
  "is-plain-obj",
  "trough",
  "vfile",
  "vfile-.*",
  "unist-util-stringify-position",
  "mdast-util-.*",
  "micromark",
  "micromark-.*",
  "decode-.*",
  "zwitch",
  "longest-.*",
  "unist-.*",
  "hast-.*",
  "property-information",
  "html-void-.*",
  "stringify-.*",
  "character-.*",
  "ccount",
  "comma-.*",
  "space-.*",
  "trim-lines"
].join("|");

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  setupFilesAfterEnv: ["./tests/setup.ts"],
  //extensionsToTreatAsEsm: [".ts"],
  moduleDirectories: ["node_modules"],
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  //moduleFileExtensions: ["ts", "tsx"],
  // If you're using [Module Path Aliases](https://nextjs.org/docs/advanced-features/module-path-aliases),
  // you will have to add the moduleNameMapper in order for jest to resolve your absolute paths.
  // The paths have to be matching with the paths option within the compilerOptions in the tsconfig.json
  // For example:
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1"
  },
  testEnvironment: "jest-environment-jsdom"
  // transformIgnorePatterns: [`node_modules/(?!(${esModules})/)`]
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
//module.exports = createJestConfig(customJestConfig);

module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: [`node_modules/(?!(${esModules})/)`]
});
