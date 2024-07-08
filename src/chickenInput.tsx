import { useEffect, useRef, useState } from "react";
import { Animation, Sprite } from "./Animation";
import { useDebouncedCallback } from "use-debounce";
import MovingElement from "./MovingElement";

function ChickenInput() {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputtingLetter, setInputtingLetter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [animation, setAnimation] = useState<string[] | null>(null);

  const addValueToInputDebounced = useDebouncedCallback((value: string) => {
    setInputValue((curr) => curr + value);
    if (inputRef.current) updateCursorPosition(inputRef.current);
  }, 200);
  const deleteInputCharDebounced = useDebouncedCallback(() => {
    setInputValue((curr) => curr.slice(0, -1));
    if (inputRef.current) updateCursorPosition(inputRef.current);
  }, 200);

  const image = "/main.png";
  const animations: Animation[] = [
    { name: "put-down", frames: ["/eat.png"] },
    { name: "pick-up", frames: ["/eat.png", "/main.png"] },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("e: ", e.key);
    if (e.key === "ArrowLeft") {
      //   e.currentTarget.selectionStart +1
      updateCursorPosition(e.currentTarget);
    }
    if (e.key === "ArrowRight") {
      //
      updateCursorPosition(e.currentTarget);
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      setInputtingLetter(null);
      setAnimation(["pick-up"]);
      deleteInputCharWithDelay();
      return;
    }
    if (!notLetterKeys.includes(e.key)) {
      if (e.key !== " ") {
        setInputtingLetter(e.key);
        setAnimation(["put-down"]);
      }
      addValueToInputWithDelay(e.key);
    } else {
      setInputtingLetter(null);
    }
  };

  const getTextWidth = (text: string, font: string): number => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.font = font;
        return context.measureText(text).width;
      }
    }
    return 0;
  };

  const addValueToInputWithDelay = (value: string) => {
    // you need cursor position to
    if (addValueToInputDebounced.isPending()) {
      addValueToInputDebounced.flush();
    }
    addValueToInputDebounced(value);
  };

  const deleteInputCharWithDelay = () => {
    if (deleteInputCharDebounced.isPending()) {
      deleteInputCharDebounced.flush();
    }
    deleteInputCharDebounced();
  };

  const handleCursorPositionChange = (
    event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>
  ) => {
    const input = event.target as HTMLInputElement;
    updateCursorPosition(input);
  };

  const updateCursorPosition = (input: HTMLInputElement) => {
    const font = window.getComputedStyle(input).font;
    const textUpToCursor = input.value.substring(0, input.selectionStart || 0);
    const cursorPosInPx = getTextWidth(textUpToCursor, font);
    setCursorPosition(cursorPosInPx);
  };

  useEffect(() => {
    if (inputRef.current) {
      // Set initial cursor position when component mounts
      updateCursorPosition(inputRef.current);
    }
  }, []);

  return (
    <div className="w-[300px] h-[40px] relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        style={{ direction: "rtl" }}
        className="w-full h-full p-[10px] rounded-[10px] border border-slate-600"
        // onChange={handleInputChange}
        onKeyUp={handleCursorPositionChange}
        onClick={handleCursorPositionChange}
        onKeyDown={handleKeyDown}
      />
      <p>Cursor position: {cursorPosition !== null ? `${cursorPosition}px` : "Not focused"}</p>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <Sprite
        width={55}
        height={55}
        image={image}
        animations={animations}
        duration={500}
        playAnimation={animation}
        style={{
          position: "absolute",
          right: cursorPosition ? cursorPosition - 10 : -5,
          top: -40,
          transform: "scaleX(-1)",
        }}
      />

      <MovingElement
        children={[<div>{inputtingLetter}</div>]}
        duration={50}
        horizontalMove={0}
        verticalMove={18}
        destroyAtEnd={true}
        style={{
          position: "absolute",
          right: cursorPosition ? cursorPosition + 3 : 8,
          top: -20,
        }}
      ></MovingElement>
    </div>
  );
}

export default ChickenInput;

const notLetterKeys = [
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "Alt",
  "Control",
  "Meta",
  "Shift",
  "CapsLock",
  "Tab",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "ArrowUp",
  "Enter",
  "Insert",
  "Home",
  "PageUp",
  "PageDown",
  "NumLock",
  "Escape",
  "ScrollLock",
  "Pause",
];
