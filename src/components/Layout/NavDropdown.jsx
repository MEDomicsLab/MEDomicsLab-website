import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LiquidGlass from "../GlassSurface/GlassSurface.jsx";
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

/**
 * LiquidGlass uses centre coordinates. Measure the menu to place it below
 * the navigation and within the viewport. Ancestor opacity/transform
 * animations would flatten its backdrop blur.
 */
export default function NavDropdown({
  id,
  label,
  open,
  anchorRef,
  liquid,
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
    place();
    const id = requestAnimationFrame(place);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", place);
    };
  }, [open, anchorRef]);

  // Hide LiquidGlass's initial 270x69 placeholder until it measures itself.
  // A timer avoids waiting for animation frames in a background tab.
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
      <LiquidGlass
        displacementScale={liquid.communityModal.displacementScale}
        blurAmount={liquid.communityModal.blurAmount}
        saturation={liquid.communityModal.saturation}
        aberrationIntensity={liquid.communityModal.aberrationIntensity}
        elasticity={liquid.communityModal.elasticity}
        cornerRadius={liquid.communityModal.cornerRadius}
        mode={liquid.communityModal.mode}
        overLight={liquid.communityModal.overLight}
        padding={`${PADDING_Y}px ${PADDING_X}px`}
        style={{
          position: "fixed",
          top: pos?.top ?? -9999,
          left: pos?.left ?? -9999,
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
      </LiquidGlass>
    </div>,
    document.body
  );
}
