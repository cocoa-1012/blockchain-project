import dynamic from 'next/dynamic';

import Box from 'components/base/Box';

const ModelViewer = dynamic(
  () => import('components/model-media/ModelViewer'),
  {
    ssr: false,
  }
);

interface ModelProps {
  src: string;
  className?: string;
  disableAR?: boolean;
  toBlob?: (posterBlob: Blob) => void;
}

export default function Model(props: ModelProps): JSX.Element {
  const { src, className, disableAR, toBlob } = props;

  return (
    <Box className={className}>
      <ModelViewer src={src} toBlob={toBlob} disableAR={disableAR} />
    </Box>
  );
}
