interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    // twitter: string
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'KRRP INFO',
  description: 'Next14, KRRP',
  url: 'https://krrpinfo.vercel.app',
  ogImage: '../app/opengraph-image.webp',
  links: {
    // twitter: 'https://twitter.com/shadcn',
    github: 'https://github.com/gvm1229/krrpinfo',
  },
};
