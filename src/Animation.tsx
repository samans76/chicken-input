import { useEffect, useState } from "react";

export type Animation = { name: string; frames: string[] };

type AnimationProps = {
  width: string | number | undefined;
  height: string | number | undefined;
  image: string;
  animations: Animation[];
  duration: number; // in ms
  playAnimation: string[] | null;
  style?: React.CSSProperties;
};

let intervals: number[] = [];

export function Sprite({ width, height, image, animations, duration, playAnimation, style }: AnimationProps) {
  const [currentImage, setCurrentImage] = useState<string>(image);
  const [currentAnimation, setCurrentAnimation] = useState<string[] | null>(playAnimation);

  // console.log("animation in sprite : ", currentAnimation);
  // console.log("currentImage in sprite : ", currentImage);

  useEffect(() => {
    setCurrentImage(image);
    setCurrentAnimation(playAnimation);
    intervals.map((i) => clearInterval(i));
  }, [playAnimation]);

  useEffect(() => {
    if (!currentAnimation) return;
    intervals.map((i) => clearInterval(i));
    const firstAnimation = playAnimation?.find((i) => !!i);
    const animation = animations.find((i) => i.name === firstAnimation);

    if (animation) {
      const playNextFrame = () => {
        setCurrentImage((curr) => {
          const frameIndex = animation.frames.findIndex((i) => i === curr);
          const notInFrames = frameIndex < 0;
          if (notInFrames) {
            return animation.frames[0];
          }
          const isLastFrame = frameIndex + 1 > animation.frames.length - 1;
          if (isLastFrame) {
            intervals.map((i) => clearInterval(i));
            setCurrentAnimation(null);
            return image;
          }

          return animation.frames[frameIndex + 1];
        });
      };

      const intervalTime = duration / animation.frames.length;
      playNextFrame();
      const interval = setInterval(playNextFrame, intervalTime);
      intervals.push(interval);
    } else {
      if (currentImage !== image) setCurrentImage(image);
    }
  }, [currentAnimation]);

  const allImages: string[] = [];
  allImages.push(image);
  for (const animation of animations) {
    allImages.push(...animation.frames);
  }
  useEffect(() => {
    allImages.forEach((imageUrl) => {
      const img = new Image();
      img.src = imageUrl;
    });
  }, [frames]);

  return <img style={style} key={currentImage} src={currentImage} width={width} height={height} />;
}
