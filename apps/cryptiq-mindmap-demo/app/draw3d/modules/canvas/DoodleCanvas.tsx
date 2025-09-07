import { useEffect, useRef } from "react";

export default function DoodleCanvas({
  onEnd,
}: {
  onEnd?: (canvas: HTMLCanvasElement) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const start = (x: number, y: number) => {
    drawing.current = true;
    last.current = { x, y };
  };

  const move = (x: number, y: number) => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!drawing.current || !ctx || !last.current) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 16;
    const { x: lx, y: ly } = last.current;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    const mx = (lx + x) / 2;
    const my = (ly + y) / 2;
    ctx.quadraticCurveTo(lx, ly, mx, my);
    ctx.stroke();
    last.current = { x, y };
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
    const c = ref.current;
    if (c && onEnd) onEnd(c);
  };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const rect = () => canvas.getBoundingClientRect();

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const r = rect();
      const t = e.touches[0];
      start(t.clientX - r.left, t.clientY - r.top);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const r = rect();
      const t = e.touches[0];
      move(t.clientX - r.left, t.clientY - r.top);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      end();
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      const r = rect();
      start(e.clientX - r.left, e.clientY - r.top);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing.current) return;
      e.preventDefault();
      const r = rect();
      move(e.clientX - r.left, e.clientY - r.top);
    };
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      end();
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={280}
      height={280}
      style={{ touchAction: 'none' }}
    />
  );
}
