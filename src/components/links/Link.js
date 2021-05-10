/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import PropTypes from 'prop-types';
import { cloneElement, Children } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import NextLink from 'next/link';

NextLink.defaultProps = {
  passHref: true,
};

NextLink.propTypes = {
  children: PropTypes.any,
  href: PropTypes.any,
};

export const Link = NextLink;

export default Link;

NavLink.propTypes = {
  children: PropTypes.any,
  href: PropTypes.any,
  className: PropTypes.string,
};

export function NavLink(props) {
  const { children, className, href, ...rest } = props;
  const { asPath } = useRouter();
  return (
    <NextLink href={href}>
      {cloneElement(Children.only(children), {
        className: classNames({
          active: asPath === href,
          [className]: true,
        }),
        ...rest,
      })}
    </NextLink>
  );
}
