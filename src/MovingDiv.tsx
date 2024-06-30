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
  style?: React.CSSProperties;
  animationFPS?: number;
  destroyAtEnd?: boolean;
};

const intervals: number[] = [];

function MovingElement({
  children,
  horizontalMove,
  verticalMove,
  duration,
  style,
  animationFPS = 60,
  destroyAtEnd,
}: MovingElementProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const offsetRef = useRef<Point>({ x: 0, y: 0 });
  offsetRef.current = { x: offsetX, y: offsetY };
  const bigDistance = horizontalMove * horizontalMove + verticalMove * verticalMove;
  const lastDistanceToEnd = useRef<number>(bigDistance);
  const ref = useRef<HTMLInputElement>(null);

  const elementPassDestination = () => {
    const distanceToEndX = Math.abs(offsetRef.current.x - horizontalMove);
    const distanceToEndY = Math.abs(offsetRef.current.y - verticalMove);
    const distanceToEnd = sumDistances2D(distanceToEndX, distanceToEndY);
    const passedDestination = lastDistanceToEnd.current < distanceToEnd;
    if (passedDestination) {
      intervals.forEach((i) => clearInterval(i));
      if (destroyAtEnd) {
        setOffsetX(-10000);
        setOffsetY(-10000);
      }
    }
    lastDistanceToEnd.current = distanceToEnd;
  };

  useEffect(() => {
    intervals.forEach((i) => clearInterval(i));

    const intervalTime = 1000 / animationFPS;
    const interval = setInterval(() => {
      elementPassDestination();

      const intervalCounts = duration / intervalTime;
      setOffsetX((curr) => curr + horizontalMove / intervalCounts);
      setOffsetY((curr) => curr + verticalMove / intervalCounts);

      return () => intervals.forEach((i) => clearInterval(i));
    }, intervalTime);
    intervals.push(interval);
  }, [children]);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {children}
    </div>
  );
}

export default MovingElement;

function calculateDistance(x1: number, x2: number, y1: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function sumDistances2D(dx: number, dy: number) {
  return Math.sqrt(dx * dx + dy * dy);
}
