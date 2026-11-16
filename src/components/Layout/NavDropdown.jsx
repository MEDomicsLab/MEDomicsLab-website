import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BrowserGlass from "../GlassSurface/BrowserGlass.jsx";
import { VASO_GLASS } from "../../lib/vasoPresets.js";
import { cn } from "../../lib/utils";

export const NAV_TEXT_CLASS = "text-[8px] md:text-[12px] font-semibold tracking-tighter";

export const NAV_MIXED_CASE_TEXT_CLASS = "text-[11px] md:text-[13px]";

export const NAV_MENU_ITEM_CLASS =
  "inline-flex items-center whitespace-nowrap text-[10px] md:text-[12px] uppercase tracking-tighter leading-none transition-colors hover:text-[var(--neue-paper)] focus-visible:text-[var(--neue-paper)] hover:underline focus-visible:underline underline-offset-4";

export const NAV_TRIGGER_CLOSE_DELAY = 1000;
export const NAV_MENU_CLOSE_DELAY = 400;

const GAP = 10;
const PADDING_X = 24;
const PADDING_Y = 12;
const VIEWPORT_MARGIN = 16;
const REVEAL_DELAY_MS = 50;

export default function NavDropdown({
  id,
  label,
  open,
  anchorRef,
  menuRef,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  focusFirstItem = false,
  onFocusedFirstItem,
  children,
}) {
  const contentRef = useRef(null);
  const [pos, setPos] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setPos(null);
      return;
    }
    const place = () => {
      const trigger = anchorRef.current?.getBoundingClientRect();
      if (!trigger) return;
      const pillBottom = Math.max(
        trigger.bottom,
        ...[...document.querySelectorAll(".liquid-nav-anchor")].map(
          (element) => element.getBoundingClientRect().bottom
        )
      );
      const content = contentRef.current;
      const halfHeight = ((content?.offsetHeight ?? 96) + PADDING_Y * 2) / 2;
      const halfWidth = ((content?.offsetWidth ?? 120) + PADDING_X * 2) / 2;
      const centre = trigger.left + trigger.width / 2;
      const next = {
        top: Math.round(pillBottom + GAP + halfHeight),
        left: Math.round(
          Math.min(
            Math.max(centre, VIEWPORT_MARGIN + halfWidth),
            window.innerWidth - VIEWPORT_MARGIN - halfWidth
          )
        ),
      };
      setPos((prev) => (prev && prev.top === next.top && prev.left === next.left ? prev : next));
    };
    let frame;
    const followEntrance = () => {
      place();
      if (document.querySelector(".neue-home")?.dataset.heroIntro === "revealing") {
        frame = requestAnimationFrame(followEntrance);
      }
    };
    place();
    frame = requestAnimationFrame(followEntrance);
    const sizes = new ResizeObserver(place);
    if (contentRef.current) sizes.observe(contentRef.current);
    const navigation = document.querySelector(".liquid-nav-anchor");
    if (navigation) sizes.observe(navigation);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open || !pos) {
      setRevealed(false);
      return undefined;
    }
    const id = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(id);
  }, [open, pos]);

  useEffect(() => {
    if (!pos || !focusFirstItem) return;
    contentRef.current?.querySelector("a")?.focus();
    onFocusedFirstItem?.();
  }, [pos, focusFirstItem, onFocusedFirstItem]);

  if (!open) return null;

  return createPortal(
    <div
      className="nav-dropdown-portal"
      style={{ opacity: revealed ? 1 : 0, pointerEvents: revealed ? undefined : "none" }}
    >
      <BrowserGlass
        surface="community"
        {...VASO_GLASS.community}
        className="community-glass medomics-glass"
        style={{
          position: "fixed",
          padding: `${PADDING_Y}px ${PADDING_X}px`,
          top: pos?.top ?? -9999,
          left: pos?.left ?? -9999,
          transform: "translate(-50%, -50%)",
          zIndex: 60,
        }}
      >
        <div
          id={id}
          ref={(element) => {
            contentRef.current = element;
            if (menuRef) menuRef.current = element;
          }}
          role="menu"
          aria-label={label}
          tabIndex={-1}
          className={cn("flex flex-col gap-2", revealed && "nav-dropdown-content--in")}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onKeyDown={onKeyDown}
        >
          {children}
        </div>
      </BrowserGlass>
    </div>,
    document.body
  );
}
