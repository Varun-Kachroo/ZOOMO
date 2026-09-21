import { useEffect } from "react";

// Finds the actual clickable element under a pointerdown, whether it's a
// real <button>/<a>, or just a div/card styled with cursor:pointer.
function findClickable(target) {
  const explicit = target.closest?.(
    'button, a, [role="button"], input[type="submit"], input[type="button"], label'
  );
  if (explicit) return explicit;

  if (getComputedStyle(target).cursor !== "pointer") return null;

  let el = target;
  for (let i = 0; i < 6 && el.parentElement && el.parentElement !== document.body; i++) {
    const parent = el.parentElement;
    if (getComputedStyle(parent).cursor !== "pointer") break;
    el = parent;
  }
  return el;
}

// Mounted once at the app root — gives every clickable element across the
// site a quick, consistent "press" animation without touching each page.
export default function ClickFeedback() {
  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return; // left click / touch only
      const el = findClickable(e.target);
      if (!el) return;

      el.classList.remove("ze-pressed");
      void el.offsetWidth; // restart animation if clicked again mid-flight
      el.classList.add("ze-pressed");
      el.addEventListener("animationend", () => el.classList.remove("ze-pressed"), { once: true });
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
