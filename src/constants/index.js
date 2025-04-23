import { FaYoutube, FaFacebook } from 'react-icons/fa'
import { RxDiscordLogo, RxGithubLogo, RxInstagramLogo, RxTwitterLogo, RxLinkedinLogo, RxEnvelopeClosed } from 'react-icons/rx'

export const SOCIALS = [
  {
    name: 'Instagram',
    icon: RxInstagramLogo,
    link: 'https://instagram.com',
  },
  {
    name: 'Facebook',
    icon: FaFacebook,
    link: 'https://facebook.com',
  },
  {
    name: 'Twitter',
    icon: RxTwitterLogo,
    link: 'https://twitter.com',
  },
]

export const FRONTEND_SKILL = [
  {
    skill_name: 'HTML',
    image: 'html.png',
    width: 80,
    height: 80,
  },
  {
    skill_name: 'CSS',
    image: 'css.png',
    width: 80,
    height: 80,
  },
  {
    skill_name: 'JavaScript',
    image: 'js.png',
    width: 65,
    height: 65,
  },
  // {
  //   skill_name: "Tailwind CSS",
  //   image: "tailwind.png",
  //   width: 80,
  //   height: 80,
  // },
  {
    skill_name: 'React',
    image: 'react.png',
    width: 80,
    height: 80,
  },
  {
    skill_name: 'Redux',
    image: 'redux.png',
    width: 80,
    height: 80,
  },

  {
    skill_name: 'Next.js 14',
    image: 'next.png',
    width: 80,
    height: 80,
  },
  {
    skill_name: 'Shopify',
    image: 'shopify.png',
    width: 80,
    height: 80,
  },
]

export const BACKEND_SKILL = [
  {
    skill_name: 'Node.js',
    image: 'node.png',
    width: 80,
    height: 80,
  },
  {
    skill_name: 'Express.js',
    image: 'express.png',
    width: 80,
    height: 80,
  },
  {
    skill_name: 'MongoDB',
    image: 'mongodb.png',
    width: 40,
    height: 40,
  },
  {
    skill_name: 'Firebase',
    image: 'firebase.png',
    width: 55,
    height: 55,
  },
  {
    skill_name: 'PostgreSQL',
    image: 'postgresql.png',
    width: 70,
    height: 70,
  },
  {
    skill_name: 'MySQL',
    image: 'mysql.png',
    width: 70,
    height: 70,
  },
  {
    skill_name: 'Prisma',
    image: 'prisma.png',
    width: 70,
    height: 70,
  },
  {
    skill_name: 'Graphql',
    image: 'graphql.png',
    width: 80,
    height: 80,
  },
]

export const FULLSTACK_SKILL = [
  {
    skill_name: 'React Native',
    image: 'reactnative.png',
    width: 70,
    height: 70,
  },
  {
    skill_name: 'Tauri',
    image: 'tauri.png',
    width: 70,
    height: 70,
  },
  {
    skill_name: 'Docker',
    image: 'docker.png',
    width: 70,
    height: 70,
  },

  {
    skill_name: 'Figma',
    image: 'figma.png',
    width: 50,
    height: 50,
  },
]

export const PROJECTS = [
  {
    title: 'NFT Marketplace (React, Next.js)',
    description: 'Integrated SUI chain for NFT transactions, optimized mint flow, and resolved key UI/UX issues.',
    image: '/projects/nft-marketplace.png',
    link: 'https://oasisx.world/',
  },
  {
    title: 'WEB3 Gaming Portal (Play to Earn) (React)',
    description: 'Developed from scratch with role-based access, MetaMask integration, and in-game cash redemption.',
    image: '/projects/ballers.jpg',
    link: 'https://ballers.fun',
  },
  {
    title: 'Multi Owner Safe for Token Management (React, Redux)',
    description: 'Built a secure multi-signature asset management system with tagging, address book, and Electron.js support.',
    image: '/projects/multi-safe.png',
    link: '#',
  },
  // {
  // title: 'BrainAlive.ai (React.js)',
  // description:
  // 'Structured and optimized frontend with reusable components, protected routes, and dark/light theme support.',
  // image: '/projects/brAinalive.png',
  // link: 'https://Brainalive.ai',
  // },
  {
    title: 'DEX (Angular)',
    description: 'Implemented address management, trading panel, and integrated V3 exchange fields.',
    image: '/projects/dex.png',
    link: '#',
  },
  {
    title: 'Coinbuck CBX (React.js, Next.js, Angular)',
    description: 'Enhanced social feed with filters, pagination, Mixpanel tracking, and UI optimizations.',
    image: '/projects/buck.png',
    link: 'https://coinbuck.com',
  },
]

export const FOOTER_DATA = [
  {
    title: 'Community',
    data: [
      {
        name: 'GitHub',
        icon: RxGithubLogo,
        link: 'https://github.com/hamzam999',
      },
    ],
  },
  {
    title: 'Social Media',
    data: [
      {
        name: 'Linkedin',
        icon: RxLinkedinLogo,
        link: 'https://www.linkedin.com/in/er-mohammad-hamza',
      },
    ],
  },
  {
    title: 'About',
    data: [
      // {
      //   name: "Learning about me",
      //   icon: null,
      //   link: "https://example.com",
      // },
      {
        name: 'Contact Me',
        icon: RxEnvelopeClosed,
        link: 'mailto:ermohdhamza0@gmail.com',
      },
    ],
  },
]

export const NAV_LINKS = [
  {
    title: 'About me',
    link: '#about-me',
  },
  {
    title: 'Skills',
    link: '#skills',
  },
  {
    title: 'Projects',
    link: '#projects',
  },
]

export const LINKS = {
  sourceCode: 'https://github.com/hamzam999',
}
