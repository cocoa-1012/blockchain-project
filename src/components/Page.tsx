/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, ThemeUIStyleObject } from 'theme-ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { always, ifElse } from 'ramda';

import { DESCRIPTION, TITLE, OG_IMAGE } from 'utils/constants/meta';
import { absoluteUrl, getOgImage } from 'utils/urls';
import { isEmptyOrNil } from 'utils/helpers';
import {
  modelAssetsHost,
  videoAssetsHost,
  appAssetsHost,
  imageAssetsHost,
  modelImageAssetsHost,
} from 'lib/assets';

import Header from 'components/headers/Header';
import Footer from 'components/footers/Footer';

import { PageColorMode, PageTypes } from 'types/page';

export interface PageProps {
  children?: JSX.Element | JSX.Element[];
  mode?: PageColorMode;
  headerMode?: PageColorMode;
  headerStyle?: ThemeUIStyleObject;
  footerStyle?: ThemeUIStyleObject;
  url?: string;
  description?: string;
  title?: boolean | string;
  absolute?: boolean;
  isLight?: boolean;
  image?: string;
  type?: PageTypes;
  bannerActive?: boolean;
}

export default function Page(props: PageProps): JSX.Element {
  const {
    mode = PageColorMode.light,
    headerMode = PageColorMode.light,
    children,
    absolute,
    headerStyle,
    footerStyle,
    description = DESCRIPTION,
    title = TITLE,
    image = OG_IMAGE,
    type,
    bannerActive,
  } = props;

  const pageDescription = ifElse(
    isEmptyOrNil,
    always(DESCRIPTION),
    always(description)
  )(description);

  const ogImage = getOgImage(image);

  const { asPath } = useRouter();

  const pageTitle = title ? `${title} | Foundation` : 'Foundation';

  const metaTags = [
    {
      name: 'title',
      content: pageTitle,
    },
    {
      name: 'description',
      content: pageDescription,
    },
    {
      property: 'og:title',
      content: pageTitle,
    },
    {
      property: 'og:url',
      content: absoluteUrl(asPath),
    },
    {
      property: 'og:description',
      content: pageDescription,
    },
    {
      property: 'og:image',
      content: ogImage,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: pageTitle,
    },
    {
      name: 'twitter:site',
      content: '@withfnd',
    },
    {
      name: 'twitter:url',
      content: absoluteUrl(asPath),
    },
    {
      name: 'twitter:image',
      content: ogImage,
    },
  ];

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {metaTags.map((tag) =>
          tag.content ? (
            <meta {...tag} key={tag?.name ?? tag?.property} />
          ) : null
        )}

        <meta property="og:type" content="website" />

        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* svg favicon first (when supported) */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* 32px png variant as primary fallback */}
        <link
          rel="alternate icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />

        {/* 32px png variant as secondary fallback */}
        <link
          rel="alternate icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* 128px shortcut icon for metamask */}
        <link rel="shortcut icon" type="image/png" href="/icon-metamask.png" />

        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link rel="preconnect" href={videoAssetsHost} />
        <link rel="preconnect" href={modelAssetsHost} />
        <link rel="preconnect" href={modelImageAssetsHost} />
        <link rel="preconnect" href={imageAssetsHost} />
        <link rel="preconnect" href={appAssetsHost} />
      </Head>

      <Header
        mode={mode}
        headerMode={headerMode}
        absolute={absolute}
        headerStyle={headerStyle}
        type={type}
        bannerActive={bannerActive}
      />

      {children}

      <Footer footerStyle={footerStyle} type={type} />
    </>
  );
}
