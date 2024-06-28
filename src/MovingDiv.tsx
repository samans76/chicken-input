import React, { useEffect, useRef, useState } from "react";

export type Point = {
  x: number;
  y: number;
};

type MovingElementProps = {
  children: JSX.Element[];
  horizontalMove: number;
  verticalMove: number;
  duration: number;
  isLoop?: boolean;
  style?: React.CSSProperties;
};

function MovingElement({ children, horizontalMove, verticalMove, duration, isLoop, style }: MovingElementProps) {
  const [startPosition, setStartPosition] = useState<Point | null>();
  const ref = useRef<HTMLInputElement>(null);
  console.log("rect : ", ref.current?.getBoundingClientRect().x);
  useEffect(() => {
    setStartPosition({
      x: ref.current?.getBoundingClientRect()?.x ?? -100,
      y: ref.current?.getBoundingClientRect().y ?? -100,
    });
    // component moving should reset
    const intervalTime = 10; // base on duration
    setInterval(() => {
      //
    }, intervalTime);
  }, [children]);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        position: "absolute",
        top: 0,
        right: -50,
        transform: `translate(${horizontalMove}px, ${verticalMove}px)`,
      }}
    >
      {children}
    </div>
  );
}

export default MovingElement;
