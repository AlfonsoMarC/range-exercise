import React, { useEffect, useState } from "react";

interface RectProps {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  top: number | null;
  right: number | null;
  bottom: number | null;
  left: number | null;
}

export const useGetRectPropsByRef = (elementReference: React.RefObject<HTMLElement>): RectProps => {
  const [rectProps, setRectProps] = useState<RectProps>({
    x: null,
    y: null,
    width: null,
    height: null,
    top: null,
    right: null,
    bottom: null,
    left: null
  });
  useEffect(() => {
    const element = elementReference.current;
    if (!element) {
      return;
    }
    const updateRectProps = (): void => {
      setRectProps(element.getBoundingClientRect());
    };
    updateRectProps();
    element.addEventListener("resize", updateRectProps);
    window.addEventListener("resize", updateRectProps);
    return () => {
      element.addEventListener("resize", updateRectProps);
      window.removeEventListener("resize", updateRectProps);
    };
  }, [elementReference]);

  return rectProps;
};
