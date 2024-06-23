import { useEffect, useRef, useState } from "react";

function ChickenInput() {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    setInputValue(input.value);
    updateCursorPosition(input);
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
        onChange={handleInputChange}
        onKeyUp={handleCursorPositionChange}
        onClick={handleCursorPositionChange}
        // placeholder="Enter text"
      />
      <p>Cursor position: {cursorPosition !== null ? `${cursorPosition}px` : "Not focused"}</p>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <img
        style={{ right: cursorPosition ?? 0 }}
        src={"chicken.png"}
        alt="Top Right Icon"
        className=" h-10 w-10 absolute top-[-40px] mt-1 mr-1"
      />
    </div>
  );
}

export default ChickenInput;
