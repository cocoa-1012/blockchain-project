import { NamedProps } from 'react-select';

const bodyFontFamily = `"Roobert", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

const customStyles: NamedProps['styles'] = {
  menuList: (provided) => ({
    ...provided,
    fontFamily: bodyFontFamily,
  }),
  control: (provided) => ({
    ...provided,
    overflow: 'scroll',
    minHeight: 63,
    border: '1px solid #E6E6E6',
    borderRadius: 6,
    padding: 10,
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.05)',
    fontFamily: bodyFontFamily,
    maxWidth: 540,
    '&:hover': {
      border: '1px solid #E6E6E6',
    },
  }),
  dropdownIndicator: () => ({
    display: 'none',
  }),
  indicatorsContainer: () => ({
    display: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    fontWeight: 600,
    borderRadius: 8,
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    width: 'auto',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#000',
    color: '#fff',
    padding: '4px 6px',
    borderRadius: 8,
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    backgroundColor: '#000',
    color: '#fff',
    fontSize: 16,
    wordBreak: 'break-all',
    whiteSpace: 'unset',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    transition: 'color $1 $ease',
    color: '#666666',
    backgroundColor: 'unset',
    svg: {
      height: 20,
      width: 20,
      cursor: 'pointer',
    },
    '&:hover': {
      backgroundColor: 'unset',
      color: '#fff',
    },
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    fontFamily: bodyFontFamily,
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: bodyFontFamily,
    backgroundColor: state.isFocused ? '#F2F2F2' : 'unset',
    borderRadius: 8,
    margin: 8,
    width: 'auto',
    cursor: 'pointer',
  }),
};

export default customStyles;
