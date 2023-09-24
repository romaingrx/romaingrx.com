"use client";
import { getDeadOrAlive } from "@/lib/game_of_life";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";

export default function GameOfLifeBackground({ className = '', fill = "black", fps =  30}) {
  const canvasRef = useRef(null);
  const [field, setField] = useState([]);
  const px = 10;
  const [run, setRun] = useState(0);
  const [clientWidth, setClientWidth] = useState(null);
  const [clientHeight, setClientHeight] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setClientWidth(document.body.clientWidth);
      setClientHeight(document.body.clientHeight);
    };
    let timeout;
    window.addEventListener("resize", (e) => {
      // manual debounce
      clearTimeout(timeout);
      timeout = setTimeout(handleResize, 1000);
    });
    handleResize(); // call once to set initial values
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [nx, ny] = useMemo(() => {
    const nx = Math.floor(clientWidth / px);
    const ny = Math.floor(clientHeight / px);
    
    return nx > 0 && ny > 0 ? [nx, ny] : [200, 200];
  }, [clientWidth, clientHeight]);

  useEffect(() => {
    const newField = [];
    for (let y = 0; y < ny; y++) {
      newField[y] = [];
      for (let x = 0; x < nx; x++) {
        newField[y][x] =
          x < field.length && y < field[0].length
            ? field[y][x]
            : Math.random() > 0.95;
      }
    }
    setField(newField);
    drawField(newField);
  }, [nx, ny]);

  const drawField = useCallback(
    (field) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Clear the entire canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = fill;
      // Fill alive cells as small rectangles
      field.forEach((row, y) =>
        row.forEach((cell, x) => {
          if (cell) {
            context.fillRect(x * px, y * px, px, px);
          }
        }),
      );
    },
    [canvasRef],
  );

  const step = useCallback(() => {
    let newField = field.map((row, y) =>
      row.map((_, x) => {
        return getDeadOrAlive(x, y, field);
      }),
    );
    setField(newField);
    drawField(newField);
  }, [field, drawField]);

  useEffect(() => {
    const field = [];
    for (let y = 0; y < ny; y++) {
      field[y] = [];
      for (let x = 0; x < nx; x++) {
        field[y][x] = Math.random() > 0.9;
      }
    }
    setField(field);
    drawField(field);
    loop();
  }, []);

  useEffect(() => {
    if (run > 1) {
      step();
    }
  }, [run]);

  const loop = () => {
    setRun((r) => r + 1);
    setTimeout(loop, 1000 / fps);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        width={clientWidth}
        height={clientHeight}
        onClick={(e) => {
          const canvas = canvasRef.current;
          const rect = canvas.getBoundingClientRect();
          const x = Math.floor((e.clientX - rect.left) / px);
          const y = Math.floor((e.clientY - rect.top) / px);
          for (let dx = -1; dx < 2; dx++) {
            for (let dy = -1; dy < 2; dy++) {
              field[y + (dy % ny)][x + (dx % nx)] =
                !field[y + (dy % ny)][x + (dx % nx)];
            }
          }
          setField(field);
          drawField(field);
        }}
      />
    </>
  );
}
