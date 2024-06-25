import { useEffect, useState } from "react";

export type Animation = { name: string; frames: string[] };

type AnimationProps = {
  width: string | number | undefined;
  height: string | number | undefined;
  image: string;
  animations: Animation[];
  duration: number; // in ms
  playAnimation: string | null;
};

let interval: number;

export function Sprite({
  width,
  height,
  image,
  animations,
  duration,
  playAnimation,
}: AnimationProps) {
  const [currentImage, setCurrentImage] = useState<string>(image);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(
    playAnimation
  );

  console.log("animation in sprite : ", currentAnimation);
  console.log("currentImage in sprite : ", currentImage);

  useEffect(() => {
    setCurrentAnimation(playAnimation);
  }, [playAnimation]);

  useEffect(() => {
    clearInterval(interval);
    const animation = animations.find((i) => i.name === playAnimation);
    if (animation) {
      // run a function that changes current image base on frames in an interval until it reaches the end then => to main image
      const intervalTime = duration / animation.frames.length;
      interval = setInterval(() => {
        // console.log("interval ran !");
        setCurrentImage((curr) => {
          const frameIndex = animation.frames.findIndex((i) => i === curr);
          // console.log(
          //   " info:",
          //   curr.toString(),
          //   animation,
          //   curr === "/eat.png"
          // );
          console.log("frameIndex :", frameIndex);
          const notInFrames = frameIndex < 0;
          if (notInFrames) {
            return animation.frames[0];
          }
          const isLastFrame = frameIndex + 1 > animation.frames.length - 1;
          if (isLastFrame) {
            clearInterval(interval);
            setCurrentAnimation(null);
            return image;
          }

          return animation.frames[frameIndex + 1];
        });
      }, intervalTime);
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

  return (
    <img key={currentImage} src={currentImage} width={width} height={height} />
  );
}
