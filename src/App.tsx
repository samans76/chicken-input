import { useState } from "react";
import { Sprite, Animation } from "./Animation";

function App() {
  const image = "/idle.png";
  const animations: Animation[] = [
    {
      name: "die",
      frames: ["/die1.png", "/die2.png", "/die3.png", "/die4.png"],
    },
    {
      name: "jump",
      frames: [
        "/jump1.png",
        "/jump2.png",
        "/jump3.png",
        "/jump4.png",
        "/jump5.png",
      ],
    },
    {
      name: "walk",
      frames: [
        "/walk1.png",
        "/walk2.png",
        "/walk3.png",
        "/walk4.png",
        "/walk5.png",
      ],
    },
  ];

  const [animation, setAnimation] = useState<string | null>(null);

  console.log("animation :", animation);
  return (
    <div className="w-full h-screen p-[150px] flex fex-col gap-20">
      <Sprite
        width={300}
        height={200}
        animations={animations}
        image={image}
        duration={500}
        playAnimation={animation}
      />
      <div
        className="w-20 h-20 mt-10 bg-green-400"
        onClick={() => setAnimation("walk")}
      >
        walk
      </div>
      <div
        className="w-20 h-20 mt-10 bg-green-400"
        onClick={() => {
          console.log("die");
          setAnimation("die");
        }}
      >
        die
      </div>
      <div
        className="w-20 h-20 mt-10 bg-green-400"
        onClick={() => setAnimation("jump")}
      >
        jump
      </div>
    </div>
  );
}

export default App;
