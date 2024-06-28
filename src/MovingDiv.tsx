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
  animationFPS = 20,
  destroyAtEnd,
}: MovingElementProps) {
  const [startPosition, setStartPosition] = useState<Point | null>(null);
  const [position, setPosition] = useState<Point | null>(startPosition);
  const bigDistance = horizontalMove * horizontalMove + verticalMove * verticalMove;
  const [lastDistanceToEnd, setLastDistanceToEnd] = useState<number>(bigDistance);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const startPosition = {
      x: ref.current?.getBoundingClientRect()?.x ?? -100,
      y: ref.current?.getBoundingClientRect().y ?? -100,
    };
    setStartPosition(startPosition);
    setPosition(startPosition);
    intervals.forEach((i) => clearInterval(i));

    const intervalTime = 1000 / animationFPS;
    const interval = setInterval(() => {
      if (!position) return;
      const endX = startPosition.x + horizontalMove;
      const endY = startPosition.y + verticalMove;
      const distanceToEnd = calculateDistance(position.x, endX, position.y, endY);
      let passedEndPoint = distanceToEnd > lastDistanceToEnd;
      if (passedEndPoint) {
        intervals.forEach((i) => clearInterval(i));
        if (destroyAtEnd) setPosition({ x: -10000, y: -10000 });
      }
      setLastDistanceToEnd(distanceToEnd);

      const intervalCounts = duration / intervalTime;
      const intervalHorizontalMove = horizontalMove / intervalCounts;
      const intervalVerticalMove = verticalMove / intervalCounts;
      if (position) {
        const newPosition = { x: position.x + intervalHorizontalMove, y: position.y + intervalVerticalMove };
        setPosition(newPosition);
      }
    }, intervalTime);
    intervals.push(interval);
  }, [children]);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        transform: `translate(${position?.x}px, ${position?.y}px)`,
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
