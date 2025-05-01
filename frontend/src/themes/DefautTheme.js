import { createTheme } from '@mui/material';

export const APP_DEFAULT_THEME = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
    },
    MuiButton: {
      variants: [
        {
          props: { default: true, variant: 'outlined' },
          style: {
            color: 'rgba(0,0,0,0.6)',
            borderColor: 'rgba(0,0,0,0.25)',
          },
        },
      ],
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontStyle: 'normal',
          fontWeight: 400,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiIconButton-root': {
            padding: '0px 5px',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontStyle: 'normal',
          '&.Mui-selected, &.Mui-selected:hover': {
            color: 'white',
            backgroundColor: '#1565c0',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-shrink': {
            fontWeight: 600,
            color: '#000000',
            fontSize: '14px',
            lineHeight: '150%',
          },
          '& .MuiInputLabel-shrink.Mui-focused': {
            color: '#1d4ed8',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          textTransform: 'none',
        },
      },
    },
    MuiLink: {
      variants: [
        {
          props: { plain: true },
          style: {
            textDecoration: 'none',
          },
        },
      ],
    },
  },
});

export const DEFAULT_THEME = createTheme(APP_DEFAULT_THEME);