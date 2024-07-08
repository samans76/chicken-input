import { useEffect, useMemo, useRef, useState } from "react";
import { Animation, Sprite } from "./Animation";
import { useDebouncedCallback } from "use-debounce";
import MovingElement from "./MovingElement";

function ChickenInput() {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputtingLetter, setInputtingLetter] = useState<string | null>(null);
  const [animation, setAnimation] = useState<string[] | null>(null);
  const [status, setStatus] = useState<"normal" | "fall">("normal");
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const putDownDuration = 250;
  const pickupDuration = 200;

  const addValueToInputDebounced = useDebouncedCallback((value: string) => {
    setInputValue((curr) => curr + value);

    if (inputRef.current) updateCursorPosition(inputRef.current);
  }, putDownDuration);

  const deleteInputCharDebounced = useDebouncedCallback(() => {
    setInputValue((curr) => curr.slice(0, -1));
    if (inputRef.current) updateCursorPosition(inputRef.current);
  }, pickupDuration);

  const image = "/main.png";
  const animations: Animation[] = [
    { name: "put-down", frames: ["/eat.png"] },
    { name: "pick-up", frames: ["/eat.png"] },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("e: ", e.key);
    if (status === "fall") return;
    const fallWidth = (inputRef.current?.offsetWidth ?? 300) - 25;
    if (cursorPosition && cursorPosition > fallWidth) {
      setStatus("fall");
    }

    if (e.key === "ArrowLeft") {
      if (inputRef.current) {
        const pos = e.currentTarget.selectionStart ?? 0;
        e.currentTarget.selectionStart = pos + 1;
        updateCursorPosition(inputRef.current);
      }
    }
    if (e.key === "ArrowRight") {
      if (inputRef.current) {
        const pos = e.currentTarget.selectionStart ?? 0;
        e.currentTarget.selectionStart = pos - 1;
        updateCursorPosition(inputRef.current);
      }
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

  const updateCursorPosition = (input2: HTMLInputElement) => {
    const input = inputRef.current ?? input2;
    const font = window.getComputedStyle(input).font;
    const textUpToCursor = input.value.substring(0, input.selectionStart || 0);
    const cursorPosInPx = getTextWidth(textUpToCursor, font);
    setCursorPosition(cursorPosInPx);
  };

  useEffect(() => {
    if (inputRef.current) {
      updateCursorPosition(inputRef.current);
    }
  }, [inputValue, inputRef.current?.selectionStart]);

  const movingElement = useMemo(
    () => (
      <MovingElement
        children={[<div>{inputtingLetter}</div>]}
        duration={putDownDuration}
        horizontalMove={0}
        verticalMove={19}
        destroyAtEnd={true}
        style={{
          position: "absolute",
          right: cursorPosition ? cursorPosition + 19 : 8, // @todo better be size of text
          top: -12,
        }}
      />
    ),
    [animation, inputtingLetter]
  );

  const fallingChicken = useMemo(
    () => (
      <MovingElement
        children={[
          <Sprite
            width={55}
            height={55}
            image={image}
            animations={[]}
            duration={0}
            playAnimation={null}
            style={{ transform: "scaleX(-1)" }}
          />,
        ]}
        duration={8000}
        verticalMove={5000}
        horizontalMove={0}
        animationFPS={60}
        destroyAtEnd={true}
        style={{
          width: 55,
          height: 55,
          position: "absolute",
          right: cursorPosition ? cursorPosition + 8 : 8,
          top: -40,
        }}
      />
    ),
    [status]
  );

  return (
    <div className="w-[300px] h-[40px] relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        style={{ direction: "rtl" }}
        className="w-full h-full p-[10px] rounded-[10px] border border-[#D6A16C] outline-[#9A4B3C]"
        onClick={handleCursorPositionChange}
        onKeyDown={handleKeyDown}
      />
      {/* <p>Cursor position: {cursorPosition !== null ? `${cursorPosition}px` : "Not focused"}</p> */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      {status === "normal" && (
        <Sprite
          width={55}
          height={55}
          image={image}
          animations={animations}
          duration={animation ? (animation.includes("pick-up") ? pickupDuration : putDownDuration) : pickupDuration}
          playAnimation={animation}
          style={{
            position: "absolute",
            right: cursorPosition ? cursorPosition + 8 : 8,
            top: -40,
            transform: "scaleX(-1)",
          }}
        />
      )}

      {status === "fall" && fallingChicken}
      {status === "normal" && movingElement}
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
