interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'KRRP INFO',
  description: 'Next14, KRRP',
  url: 'https://krrpinfo.vercel.app',
  ogImage: 'https://krrpinfo.vercel.app/opengraph-image.webp',
  links: {
    github: 'https://github.com/gvm1229/krrpinfo',
  },
};
