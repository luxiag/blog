/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://luxiag.github.io/blog',
  generateRobotsTxt: true,
  outDir: './out',
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};

export default config;
