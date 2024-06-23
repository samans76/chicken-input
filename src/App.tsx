import { useState } from "react";
import { Sprite, Animation } from "./Animation";

function App() {
  const image = "/main.png";
  const animations: Animation[] = [{ name: "eat", frames: ["/eat.png"] }];

  const [animation, setAnimation] = useState<string | null>(null);

  return (
    <div className="w-full h-screen p-[150px] flex fex-col gap-20">
      <Sprite width={400} height={400} animations={animations} image={image} duration={1} playAnimation={animation} />
      <div className="w-20 h-20 mt-10 bg-green-400" onClick={() => setAnimation("eat")}></div>
    </div>
  );
}

export default App;
