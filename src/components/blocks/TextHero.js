/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { useState, useEffect } from 'react';
import { jsx, Heading, Box } from 'theme-ui';
import { motion } from 'framer-motion';

export function TextHero({ heading, subheading }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 450);
  }, []);

  const heroVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 40,
      transition: {
        ease: [0.23, 1, 0.32, 1],
        duration: 1.4,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.23, 1, 0.32, 1],
        duration: 1.4,
      },
    },
  };

  const animateProps = {
    animate: visible ? 'visible' : 'hidden',
    initial: 'hidden',
  };

  const sx = getStyles();

  return (
    <motion.div variants={heroVariants} {...animateProps}>
      <Box sx={sx.fullHeight}>
        <div sx={sx.hero}>
          <motion.div sx={sx.relative} variants={item}>
            <Heading as="h1" sx={sx.heading} variant="heading.massive">
              {heading}
            </Heading>
          </motion.div>
          <motion.div sx={sx.relative} variants={item}>
            <Heading as="h2" sx={sx.sub}>
              {subheading}
            </Heading>
          </motion.div>
        </div>
      </Box>
    </motion.div>
  );
}

const getStyles = () => ({
  fullHeight: {
    display: 'flex',
    minHeight: '80rvh',
    position: 'relative',
  },
  hero: {
    bg: 'white.100',
    position: 'relative',
    zIndex: 1,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    textAlign: 'center',

    paddingX: ['l', 'xxl'],
    paddingY: ['l', 'xxl'],
  },
  relative: {
    position: 'relative',
  },
  heading: {
    color: 'black.100',
    paddingBottom: ['l', 'xl'],
    maxWidth: '80vw',
  },
  sub: {
    color: 'black.100',
    maxWidth: '620px',

    fontSize: 'sub',
    fontFamily: 'mono',
    fontWeight: 'body',
    lineHeight: 1.5,

    textAlign: 'center',
    letterSpacing: 2,

    textTransform: 'uppercase',
  },
  button: {
    marginTop: 'xl',
    position: 'relative',
  },
});
