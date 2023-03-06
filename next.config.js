const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  },
  webpack: config => {
    // Important: return the modified config
    // camel-case style names from css modules

    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes("css-loader"))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options && options.modules) {
          //bem스타일 선택자를 사용하는 관계로 -만 변환
          options.modules.exportLocalsConvention = "dashes";
        }
      });

    return config;
  }
};

module.exports = nextConfig;
