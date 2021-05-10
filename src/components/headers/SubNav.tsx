import { styled } from 'stitches.config';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';

const visiblePages = [
  '/',
  '/about',
  '/artworks',
  '/bids',
  '/blog',
  '/blog/[slug]',
  '/careers',
  '/explore',
  '/feed',
  '/invite',
  '/newsletters',
  '/notifications',
  '/privacy',
  '/profiles',
  '/settings',
  '/terms',
  '/trending',
  '/worlds',
  '/tags',
];

const Wrapper = styled(Flex, {
  display: 'none',
  justifyContent: 'center',
  flexBasis: '100%',
  marginTop: '$6',
  '@bp1': { display: 'flex' },
});

const Link = styled(Box, {
  fontFamily: '$body',
  fontSize: '$2',
  fontWeight: 600,
  color: '$black60',
  textDecoration: 'none',
  transition: 'color $0 $ease',
  marginX: '$1',
  paddingX: '$1',
  '@media (hover: hover)': {
    '&:hover': {
      color: '$black100',
    },
  },
  variants: {
    isActive: { true: { color: '$black100' } },
    isDark: {
      true: {
        color: '$white100',
        '@media (hover: hover)': {
          '&:hover': {
            color: '$black30',
          },
        },
      },
    },
  },
});

const animationVariants = {
  hidden: { opacity: 0, translateY: -80 },
  visible: { opacity: 1, translateY: 0 },
};

interface SubNavProps {
  isLoggedIn?: boolean;
  showLoadingAnimation?: boolean;
  isDark?: boolean;
}

export default function SubNav(props: SubNavProps): JSX.Element {
  const { isLoggedIn, showLoadingAnimation, isDark } = props;

  const router = useRouter();
  const currentPath = router.pathname;

  const isNavVisible = visiblePages.includes(currentPath);

  if (!isNavVisible) {
    return null;
  }

  const links = getNavLinks(isLoggedIn);
  return (
    <Wrapper>
      <motion.div
        initial={showLoadingAnimation ? 'hidden' : false}
        animate={showLoadingAnimation ? 'visible' : false}
        variants={animationVariants}
      >
        {links.map((link) => (
          <NextLink key={link.href} href={link.href} passHref>
            <Link as="a" isActive={currentPath === link.href} isDark={isDark}>
              {link.label}
            </Link>
          </NextLink>
        ))}
      </motion.div>
    </Wrapper>
  );
}

function getNavLinks(isLoggedIn: boolean) {
  if (isLoggedIn) {
    return [
      { label: 'Feed', href: '/feed' },
      { label: 'Explore', href: '/explore' },
      { label: 'Blog', href: '/blog' },
    ];
  }

  return [
    { label: 'Explore', href: '/explore' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ];
}
