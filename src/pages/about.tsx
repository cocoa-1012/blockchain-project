/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { useState } from 'react';
import { GetStaticPropsResult } from 'next';

import { getMetricNftSalesData } from 'queries/subgraph/nft-sales';

import { totalSales } from 'utils/data-handlers';
import { teamMembers } from 'utils/data/team-members';
import { aboutText } from 'utils/data/about-text';

import Page from 'components/Page';
import BrandTheme from 'components/brand/BrandTheme';
import Body from 'components/base/Body';
import TeamGrid from 'components/brand/homepage/TeamGrid';
import TeamCard from 'components/brand/cards/TeamCard';
import Link from 'components/brand/homepage/Link';
import Paragraph from 'components/brand/homepage/Paragraph';
import Heading from 'components/brand/homepage/Heading';
import TextSection from 'components/brand/homepage/TextSection';
import Subhead from 'components/brand/homepage/Subhead';
import HeadingLink from 'components/brand/homepage/HeadingLink';
import HiringHeader from 'components/brand/homepage/HiringHeader';
import TerminalShowcase from 'components/brand/homepage/TerminalShowcase';
import TotalSales from 'components/brand/homepage/TotalSales';
import TerminalSubhead from 'components/brand/homepage/TerminalSubhead';
import TerminalSubheadLink from 'components/brand/homepage/TerminalSubheadLink';
import ShapesAndMarquee from 'components/brand/homepage/ShapesAndMarquee';
import CreatorSection from 'components/brand/homepage/CreatorSection';
import CreatorCard from 'components/brand/cards/CreatorCard';
import ToolbarAndSquiggle from 'components/brand/homepage/ToolbarAndSquiggle';
import Image from 'components/base/Image';

import { PageTypes } from 'types/page';

interface AboutPageProps {
  metricNftSales: number;
}

export default function About(props: AboutPageProps): JSX.Element {
  const { metricNftSales } = props;
  const [canvasActive, setCanvasActive] = useState(false);

  return (
    <Page title="About" footerStyle={{ zIndex: 4 }} type={PageTypes.maximal}>
      <BrandTheme>
        <Body
          css={{
            maxWidth: 1400,
            paddingY: '$8',
            '@bp1': {
              paddingY: '$10',
            },
          }}
        >
          <Heading
            textAlign="mobileCenter"
            css={{ pointerEvents: canvasActive ? 'none' : 'all' }}
          >
            <picture>
              <source
                srcSet="/images/svg-text/about-foundation.svg"
                media="(min-width: 800px)"
              />
              <img
                src="/images/svg-text/about-foundation-centered.svg"
                alt="About Foundation"
              />
            </picture>
          </Heading>

          <TextSection
            textAlign="mobileCenter"
            css={{
              pointerEvents: canvasActive ? 'none' : 'all',
              marginTop: '$s2',
              marginBottom: 200,
              '@bp1': { marginBottom: 40 },
            }}
          >
            <Paragraph>{aboutText.introduction}</Paragraph>
          </TextSection>
          <ToolbarAndSquiggle
            setCanvasActive={setCanvasActive}
            canvasActive={canvasActive}
          />
          <ShapesAndMarquee />
          <TextSection
            textAlign="mobileCenter"
            css={{
              pointerEvents: canvasActive ? 'none' : 'all',
              marginTop: 430,
              '@bp1': { marginTop: 230 },
            }}
          >
            <Paragraph>{aboutText.invitation}</Paragraph>
          </TextSection>
          <TerminalShowcase
            css={{ pointerEvents: canvasActive ? 'none' : 'all' }}
          >
            <Heading>
              <picture>
                <source
                  srcSet="/images/svg-text/making-history.svg"
                  media="(min-width: 800px)"
                />
                <img
                  src="/images/svg-text/making-history-centered.svg"
                  alt="Making history"
                />
              </picture>
            </Heading>
            <TerminalSubhead>
              Since launching in February&nbsp;2021,
              <br /> creators have earned...
            </TerminalSubhead>
            <TotalSales eth={metricNftSales} />
            <TerminalSubheadLink>
              View real time updates on
              <HeadingLink href="https://fnd.info/">
                Foundation Terminal
              </HeadingLink>
            </TerminalSubheadLink>
          </TerminalShowcase>
          <section>
            <Heading
              textAlign="mobileCenter"
              css={{ pointerEvents: canvasActive ? 'none' : 'all' }}
            >
              <picture>
                <source
                  srcSet="/images/svg-text/what-creators-have-to-say.svg"
                  media="(min-width: 800px)"
                />
                <img
                  src="/images/svg-text/what-creators-have-to-say-centered.svg"
                  alt="What creators have to say"
                />
              </picture>
            </Heading>
            <CreatorSection
              css={{ pointerEvents: canvasActive ? 'none' : 'all' }}
            >
              {aboutText.creators.map(
                ({ name, text, imageSrc, profilePath, publicKey }) => (
                  <CreatorCard
                    name={name}
                    key={name}
                    text={text}
                    imageSrc={imageSrc}
                    profilePath={profilePath}
                    publicKey={publicKey}
                  />
                )
              )}
            </CreatorSection>
          </section>
          <Heading css={{ pointerEvents: canvasActive ? 'none' : 'all' }}>
            <picture>
              <source
                srcSet="/images/svg-text/how-it-works.svg"
                media="(min-width: 800px)"
              />
              <img
                src="/images/svg-text/how-it-works-mobile.svg"
                alt="How it works"
              />
            </picture>
          </Heading>
          <TextSection css={{ pointerEvents: canvasActive ? 'none' : 'all' }}>
            <section>
              <Subhead>For Creators</Subhead>
              <Paragraph>{aboutText.forCreators}</Paragraph>
              <Link
                size="small"
                href="https://intercom.help/foundation-529b3c2d3a16/en/collections/2667653-a-complete-guide-to-becoming-a-creator#guides"
              >
                Read the full guide: Get Started as a Creator
              </Link>
            </section>
            <section>
              <Subhead>For Collectors</Subhead>
              <Paragraph>{aboutText.forCollectors}</Paragraph>
              <Link
                size="small"
                href="https://help.foundation.app/en/collections/2692228-a-complete-guide-to-becoming-a-collector"
              >
                Read the full guide: Get Started as a Collector
              </Link>
            </section>
          </TextSection>
          <TextSection css={{ pointerEvents: canvasActive ? 'none' : 'all' }}>
            <section>
              <Subhead>For the Community</Subhead>
              <Paragraph>{aboutText.forTheCommunity}</Paragraph>
            </section>
            <section>
              <Subhead>For Developers</Subhead>
              <Paragraph>{aboutText.forDevelopers}</Paragraph>
            </section>
          </TextSection>
          <Heading css={{ pointerEvents: canvasActive ? 'none' : 'all' }}>
            <Image
              src="/images/svg-text/our-team.svg"
              alt="Our team"
              css={{ maxWidth: '70%', '@bp1': { maxWidth: 'unset' } }}
            />
          </Heading>
          <HiringHeader css={{ pointerEvents: canvasActive ? 'none' : 'all' }}>
            <Paragraph>{aboutText.ourTeam}</Paragraph>
            <HeadingLink href="https://foundation.app/careers">
              We're hiring!
            </HeadingLink>
          </HiringHeader>
          <TeamGrid canvasActive={canvasActive}>
            {teamMembers.map(
              ({ name, title, location, profilePath, imageSrc }) => (
                <TeamCard
                  key={name}
                  name={name}
                  title={title}
                  location={location}
                  profilePath={profilePath}
                  imageSrc={imageSrc}
                />
              )
            )}
          </TeamGrid>
        </Body>
      </BrandTheme>
    </Page>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<AboutPageProps>
> {
  const metricNftSales = await getMetricNftSalesData();

  return {
    props: {
      metricNftSales: totalSales(metricNftSales),
    },
    revalidate: 21600,
  };
}
