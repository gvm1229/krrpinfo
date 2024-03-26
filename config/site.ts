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
  name: '카러플 정보통',
  description: '카트라이더 러쉬플러스 관련 정보, 공략 및 팁 등 모음',
  url: 'https://krrpinfo.vercel.app',
  ogImage: 'https://krrpinfo.vercel.app/opengraph-image.webp',
  links: {
    github: 'https://github.com/gvm1229/krrpinfo',
  },
};
