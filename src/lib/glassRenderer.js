export function isChromiumEngine(userAgent = globalThis.navigator?.userAgent ?? "") {
  if (/iPad|iPhone|iPod|CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent)) return false;
  return /\b(?:Chrome|Chromium|HeadlessChrome)\/\d+/i.test(userAgent);
}
