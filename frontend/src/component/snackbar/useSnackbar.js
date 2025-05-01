// component/snackbar/useSnackbar.js
import { useContext } from 'react';
import { SnackbarContext } from './SnackbarContext';

const useSnackbar = () => {
  const { openSnackbar } = useContext(SnackbarContext);

  const showSnackbar = (message, type) => {
    openSnackbar(message, type);
  };

  return showSnackbar;
};

export default useSnackbar;
