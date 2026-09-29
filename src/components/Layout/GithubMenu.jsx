import { useCallback, useEffect, useRef, useState } from "react";
import LiquidGlass from "../GlassSurface/GlassSurface.jsx";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { GithubIcon } from "../Icons/Icons.jsx";
import BrandName from "../BrandName/BrandName.jsx";
import homeData from "../../data/home.json";
import NavDropdown, {
  NAV_MENU_ITEM_CLASS,
  NAV_MIXED_CASE_TEXT_CLASS,
  NAV_TEXT_CLASS,
  NAV_TRIGGER_CLOSE_DELAY,
  NAV_MENU_CLOSE_DELAY,
} from "./NavDropdown.jsx";

export default function GithubMenu({
  href,
  apps,
  compact,
  mobile,
  liquid,
  style,
  anchorClassName,
  hoverTextColor = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusFirst, setFocusFirst] = useState(false);
  const clearFocusRequest = useCallback(() => setFocusFirst(false), []);
  const closeTimer = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const openedOnPointerUp = useRef(false);

  const clearCloseTimer = () => {
    clearTimeout(closeTimer.current);
  };

  useEffect(() => clearCloseTimer, []);

  useEffect(() => {
    if (!mobile || !isOpen) return undefined;
    const dismiss = (event) => {
      if (buttonRef.current?.contains(event.target) || menuRef.current?.contains(event.target))
        return;
      setIsOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [mobile, isOpen]);

  const scheduleClose = (delay = NAV_MENU_CLOSE_DELAY) => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setIsOpen(false), delay);
  };

  const keepOpen = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  return (
    <>
      <LiquidGlass
        displacementScale={liquid.nav.displacementScale}
        blurAmount={liquid.nav.blurAmount}
        saturation={liquid.nav.saturation}
        aberrationIntensity={liquid.nav.aberrationIntensity}
        elasticity={liquid.nav.elasticity}
        cornerRadius={liquid.nav.cornerRadius}
        mode={liquid.nav.mode}
        overLight={liquid.nav.overLight}
        padding={compact ? "10px" : "12px 20px"}
        className={anchorClassName}
        style={{ position: "fixed", zIndex: 50, ...style }}
      >
        <a
          ref={buttonRef}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={compact ? `${homeData.brand.name} on GitHub` : undefined}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls="github-apps-menu"
          onMouseEnter={mobile ? undefined : keepOpen}
          onMouseLeave={mobile ? undefined : () => scheduleClose(NAV_TRIGGER_CLOSE_DELAY)}
          onFocus={mobile ? undefined : keepOpen}
          onPointerDown={() => {
            openedOnPointerUp.current = false;
          }}
          onPointerUp={(event) => {
            if (mobile && event.pointerType !== "mouse" && !isOpen) {
              openedOnPointerUp.current = true;
              keepOpen();
            }
          }}
          onClick={(event) => {
            if (openedOnPointerUp.current) {
              event.preventDefault();
              openedOnPointerUp.current = false;
            } else if (mobile && !isOpen) {
              event.preventDefault();
              keepOpen();
            }
          }}
          onKeyDown={(event) => {
            openedOnPointerUp.current = false;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              keepOpen();
              setFocusFirst(true);
            }
            if (event.key === "Escape") setIsOpen(false);
          }}
          className={cn(
            NAV_TEXT_CLASS,
            NAV_MIXED_CASE_TEXT_CLASS,
            "flex h-7 md:h-8 items-center text-white transition-colors leading-none",
            hoverTextColor && "hover:text-primary",
            !compact && "github-slide"
          )}
        >
          {compact ? (
            <GithubIcon className="h-4 w-4" />
          ) : (
            <>
              <span className="github-slide__icon" aria-hidden="true">
                <GithubIcon className="h-4 w-4" />
              </span>
              <span className="github-slide__text">GitHub</span>
              <span className="github-slide__arrow" aria-hidden="true">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </>
          )}
        </a>
      </LiquidGlass>

      <NavDropdown
        id="github-apps-menu"
        label={`${homeData.brand.name} apps`}
        open={isOpen}
        anchorRef={buttonRef}
        liquid={liquid}
        menuRef={menuRef}
        focusFirstItem={focusFirst}
        onFocusedFirstItem={clearFocusRequest}
        onMouseEnter={mobile ? undefined : keepOpen}
        onMouseLeave={mobile ? undefined : () => scheduleClose()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            clearCloseTimer();
            buttonRef.current?.focus();
            setIsOpen(false);
          }
        }}
      >
        {apps.map((app) => (
          <a
            key={app.name}
            role="menuitem"
            href={app.website ?? app.repo}
            target="_blank"
            rel="noreferrer"
            className={cn(NAV_MENU_ITEM_CLASS, NAV_MIXED_CASE_TEXT_CLASS, "text-white")}
          >
            <BrandName>{app.name}</BrandName>
          </a>
        ))}
      </NavDropdown>
    </>
  );
}
