/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';

import ExternalShadowLink from 'components/links/ExternalShadowLink';

import IPFSIcon from 'assets/icons/ipfs-icon.svg';
import EtherscanIcon from 'assets/icons/etherscan-icon.svg';
import EyeIcon from 'assets/icons/eye-icon-bold.svg';

import { BasicArtwork } from 'types/Artwork';

import { buildEtherscanLink } from 'lib/etherscanAddresses';
import { getNFT721Address } from 'lib/addresses';

interface ArtworkAuthenticityProps {
  artwork: BasicArtwork;
}

export default function ArtworkAuthenticity(
  props: ArtworkAuthenticityProps
): JSX.Element {
  const { artwork } = props;

  const ipfsUrl = `https://ipfs.io/ipfs/${artwork.metadataIPFSPath}`;

  const ipfsAssetUrl = `https://ipfs.io/ipfs/${artwork.assetIPFSPath}`;

  const tokenId = artwork?.tokenId;

  return (
    <Grid gap="xs" sx={{ maxWidth: 400 }}>
      {tokenId && (
        <ExternalShadowLink
          icon={
            <EtherscanIcon width={22} height={22} sx={{ display: 'block' }} />
          }
          href={buildEtherscanLink(`/token/${getNFT721Address()}?a=${tokenId}`)}
          sx={{ zIndex: 1 }}
          anchorAttributes={{
            target: '_blank',
            rel: 'noreferrer',
          }}
        >
          View on Etherscan
        </ExternalShadowLink>
      )}

      {tokenId && (
        <ExternalShadowLink
          icon={<EyeIcon width={25} height={19} sx={{ display: 'block' }} />}
          href={ipfsAssetUrl}
          sx={{ zIndex: 2 }}
          anchorAttributes={{
            target: '_blank',
            rel: 'noreferrer',
          }}
        >
          View on IPFS
        </ExternalShadowLink>
      )}

      <ExternalShadowLink
        icon={<IPFSIcon width={22} height={22} sx={{ display: 'block' }} />}
        href={ipfsUrl}
        sx={{ zIndex: 2 }}
        anchorAttributes={{
          target: '_blank',
          rel: 'noreferrer',
        }}
      >
        View IPFS Metadata
      </ExternalShadowLink>
    </Grid>
  );
}
