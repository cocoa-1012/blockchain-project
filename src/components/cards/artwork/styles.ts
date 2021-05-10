type position = 'absolute' | 'relative';
const tagPosition: position = 'absolute';

export const getStatusTagStyles = () => ({
  tag: {
    backgroundColor: 'black.100',
    color: 'white.100',
    borderRadius: '9999px',
    position: tagPosition,
    top: 0,
    left: 0,
    lineHeight: 1,
    display: 'flex',
    paddingRight: 's',
    alignItems: 'center',
    zIndex: 9,
  },
  indicator: {
    backgroundColor: 'red.100',
    height: '1rem',
    width: '1rem',
    margin: '0.5rem',
    borderRadius: '9999px',
    marginRight: 'xs',
  },
});
