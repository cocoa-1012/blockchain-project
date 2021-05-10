import Box from './base/Box';

export default function GenericError(): JSX.Element {
  return (
    <Box
      css={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        img: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
        },
      }}
    >
      <img src="/images/svg-text/error-404.svg" alt="Error 404" />
    </Box>
  );
}
