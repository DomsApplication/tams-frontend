import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect, useCallback } from "react";
import Util from "../utils/Util.js";

export interface LoadMaskProps {
  show?: boolean;
  size?: number;
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit";
  hideOnClick?: boolean;
}

const LoadMask: React.FC<LoadMaskProps> = ({
  show = false,
  size = 40,
  color = "primary",
  hideOnClick = false,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    if (hideOnClick) {
      setOpen(false);
    }
  };

  const showOrHideLoadMaskHandler = useCallback((event: CustomEvent) => {
    setOpen(Boolean(event.detail.show));
  }, []);

  useEffect(() => {
    setOpen(show);
    Util.on(
      "showOrHideLoadMask",
      showOrHideLoadMaskHandler as (e: Event) => void
    );
    return () =>
      Util.off(
        "showOrHideLoadMask",
        showOrHideLoadMaskHandler as (e: Event) => void
      );
  }, [show, showOrHideLoadMaskHandler]);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 10 }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color={color} size={size} />
    </Backdrop>
  );
};

export default LoadMask;
