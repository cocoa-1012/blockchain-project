/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import React from 'react';
import { GetStaticPropsResult } from 'next';
import { Global, css } from '@emotion/react';

import BrandTheme from 'components/brand/BrandTheme';
import Body from 'components/base/Body';
import Page from 'components/Page';
import Hero from 'components/careers/Hero';
import Button from 'components/base/Button';
import Grid from 'components/base/Grid';
import Title from 'components/careers/Title';
import InfoModule from 'components/careers/InfoModule';
import GraphicDivider from 'components/careers/GraphicDivider';
import CircleText from 'components/careers/CircleText';
import Section from 'components/careers/Section';
import BackgroundGradient from 'components/careers/BackgroundGradient';
import ModuleWrapper from 'components/careers/ModuleWrapper';
import Introduction from 'components/careers/Introduction';
import Paragraph from 'components/careers/Paragraph';
import Box from 'components/base/Box';
import Job from 'components/careers/Job';
import Image from 'components/base/Image';
import { HeadingWrapper, MarqueeContainer, MarqueeWrapper } from 'components/brand/homepage/ShapesAndMarquee';

import { PageColorMode, PageTypes } from 'types/page';

import { LEVER_API_URL } from 'lib/constants';

interface Job {
  title: string;
  url: string;
}

interface CareersProps {
  jobs: Job[];
}

export default function Careers(props: CareersProps): JSX.Element {
  const { jobs } = props;
  const arrayOfTen = Array.from(Array(10).keys());
  const numOfRoles = jobs.length;

  return (
    <Page
      title="Careers"
      headerMode={PageColorMode.dark}
      image="https://foundation.app/images/careers/opengraph-careers.jpg"
      type={PageTypes.maximal}
    >
    <Global
      styles={css`
        #header { 
          background: #0101ff
        }
        body { 
          height: -webkit-fit-content;
        }
      `}
      />
      <BrandTheme style={{ overflowX: 'hidden', overflow: 'clip' }}>
        <Body>
          <Hero />
          <BackgroundGradient color="green">
            <Introduction>
              Foundation is where boundary-pushing artists, curators, and
              collectors are converging to build the new creative economy. As we
              set the bar for how crypto and culture can coalesce, we’re excited
              to work with people who are motivated to build the future
              with&nbsp;us.
            </Introduction>
            <Button color="black" size="regular" shape="round" css={{ margin: 'auto', paddingX: '$4', fontFamily: '$roobert' }} as="a" href="#roles" hoverable>
              <CircleText>{numOfRoles}</CircleText> See open roles
            </Button>
          </BackgroundGradient>
          <ModuleWrapper>
            <Title>
              We’re looking for…
            </Title>
            <Grid css={{ gridRowGap: '$8' }}>
              <InfoModule
                emoji="🧠"
                title="Curiosity"
                text="Our goals are a bit unconventional. Curiosity is key to pushing the work we do toward unexpected yet rewarding outcomes."
              />
              <InfoModule
                emoji="📈"
                title="Entrepreneurship"
                text="Crypto is rapidly evolving, and things aren’t always spelled out clearly. We see every unknown as an opportunity to forge new paths and take the lead—and we hope you do too."
              />
              <InfoModule
                emoji="🤝"
                title="Collaboration"
                text="As a team, we can only make magic when everyone feels empowered to contribute their ideas and perspectives. We value those who bring out the best in both our internal team and our community at large."
              />
            </Grid>
          </ModuleWrapper>
          <GraphicDivider
            mobileImg="/images/careers/bar-1-mobile.png"
            desktopImg="/images/careers/bar-1.png"
          />
          <Section>
            <Title>
              We believe that…
            </Title>
          </Section>
          <ModuleWrapper>
            <InfoModule
              emoji="🛠"
              title="Technology should propel culture."
              text="We started this company to bridge tech with art, creativity, and design, and to move culture forward. The product and its technical underpinnings should always push us in that direction."
            />
            <InfoModule
              emoji="🖌"
              title="Great design makes the difference."
              text="We believe that tasteful and accessible design can be paired with a strong narrative to make crypto more human, and more impactful overall."
            />
            <InfoModule
              emoji="🧠"
              title="Innovative ideas don’t come out of thin air."
              text="We are building something truly new. Doing that requires constant pushing and thinking in unfamiliar ways, and this process takes flexibility and commitment."
            />
            <InfoModule
              emoji="🏄"
              title="You should be prepared for an adventure."
              text="No one can say exactly where all this will take us. With the work we do, there are no guarantees—and nothing is more exciting than that."
            />
          </ModuleWrapper>
          <GraphicDivider
            mobileImg="/images/careers/bar-2-mobile.png"
            desktopImg="/images/careers/bar-2.png"
          />
          <Section>
            <Title>
              Benefits & Support
            </Title>
          </Section>
          <ModuleWrapper>
            <InfoModule
              emoji="💊"
              title="Health Insurance"
              benefits={[
                'Top quality health insurance (medical, dental, vision, and disability).', 'A complimentary membership to One Medical.'
              ]}
            />

            <InfoModule
              emoji="💸"
              title="Employer-sponsored 401K"
              benefits={[
                'Contribute a portion of your salary to a 401k retirement fund.', 'Invest anywhere, including big fund managers like Vanguard and Fidelity.'
              ]}
            />

            <InfoModule
              emoji="🏝"
              title="Flexible PTO"
              benefits={[
                'A minimum of two weeks paid vacation per year, and unlimited time off with approval.',
                'Paid holidays, sick days, and mental health days.',
                'Paid parental leave.',
              ]}
            />
            <InfoModule
              emoji="🏡"
              title="Remote work environment"
              benefits={[
                'A stipend for home office expenses, and a new MacBook pro to every new employee.',
                'Flexible hours.',
              ]}
            />
          </ModuleWrapper>
          <BackgroundGradient id="roles" color="yellow" css={{ padding: 0 }}>
            <Section css={{ marginTop: 160 }} >
              <Box>
                <Title
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '$6',
                  }}
                >
                  <CircleText size="title">{numOfRoles}</CircleText>
                  Open Roles
                </Title>
                <Paragraph>
                If you don’t see a job that fits your skills and experience, be sure to check back soon. <br />
                  <br />
                  In the meantime, you can keep in touch with us on <a href="https://twitter.com/withfnd" target="_blank" rel="noreferrer">Twitter</a> and <a href="https://www.instagram.com/withfoundation" target="_blank" rel="noreferrer">Instagram</a> to learn about new openings and opportunities.

                </Paragraph>
              </Box>
            </Section>
          </BackgroundGradient>
          <Grid
            css={{
              gridRowGap: '10px',
              maxWidth: 912,
              marginX: 'auto',
              marginTop: '$9',
            }}
          >
            {jobs.map((job) => (
              <Job key={job.url} href={job.url}>
                {job.title}
              </Job>
            ))}
            <Paragraph
              css={{
                marginY: '$7',
                '@bp1': {
                  marginTop: '$10',
                  marginBottom: '$9'
                },
              }}
            >
              Foundation is an equal opportunity employer. We celebrate
              diversity, and welcome people from a variety of backgrounds,
              ethnicities, cultures, perspectives, and skill sets. As part of
              our commitment to equality, we ensure a fair and consistent
              interview process, and continue to promote an inclusive work
              environment.
            </Paragraph>
          </Grid>
        </Body>
        <Box css={{backgroundColor: '#05FF00', position: 'relative', height: 148, left: 0, right: 0, boxShadow: 'inset 0px 4px 22px rgba(0, 0, 0, 0.25)', display: 'none', '@bp1': { display: 'block'}}}>
        <MarqueeContainer css={{top: '50%', transform: 'translateY(-50%)'}}>
        <MarqueeWrapper>
          {arrayOfTen.map((index) => (
            <HeadingWrapper key={index}>
              <Image
                src="/images/careers/the-new-creative-economy.png"
                alt="The new creative economy"
                css={{
                  maxWidth: 'unset',
                  width: '180vw',
                  '@bp1': {
                    width: 'unset',
                  },
                }}
              />
            </HeadingWrapper>
          ))}
        </MarqueeWrapper>
      </MarqueeContainer>
      </Box>
      <Box css={{backgroundColor: '#05FF00', paddingY: '$8', boxShadow: 'inset 0px 4px 22px rgba(0, 0, 0, 0.25)', display: 'block', textAlign: 'center', '@bp1': { display: 'none'}}}>
        <Image src="/images/careers/the-new-creative-economy-mobile.png" alt="The New Creative Economy" css={{maxHeight: 228, margin: 'auto'}} />
      </Box>
      </BrandTheme>
    </Page>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<CareersProps>
> {
  const res = await fetch(LEVER_API_URL);
  const data = await res.json();
  const jobs = data.map((job: Job) => {
    const x = { title: job['text'], url: job['hostedUrl'] };
    return x;
  });

  return {
    props: {
      jobs,
    },
    revalidate: 120,
  };
}
