/**
 * LinkedIn smart redirection utility
 * - Desktop: Opens web profile in a new tab (https://www.linkedin.com/in/sheelash-singh-bhadoriya-5a941818b/)
 * - Mobile (Android): Launches native LinkedIn app via Android Intent with fallback to browser
 * - Mobile (iOS): Top-frame navigation to trigger iOS Universal Links into LinkedIn app
 */

export const LINKEDIN_USERNAME = 'sheelash-singh';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/sheelash-singh/';
export const LINKEDIN_APP_INTENT = `intent://www.linkedin.com/in/${LINKEDIN_USERNAME}#Intent;package=com.linkedin.android;scheme=https;S.browser_fallback_url=${encodeURIComponent(LINKEDIN_URL)};end;`;

export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isAndroid = /android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  const isMobileUA = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua);
  return isAndroid || isIOS || isMobileUA;
}

export function openLinkedIn(e) {
  // Allow user to use modifier keys (Cmd+Click, Ctrl+Click, Middle Click) for standard browser tab opening
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) {
    return;
  }

  if (typeof window === 'undefined') return;

  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isAndroid = /android/i.test(ua);
  const isMobile = isMobileDevice();

  if (isMobile) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (isAndroid) {
      // Android: Triggers native LinkedIn app if installed, or auto falls back to browser URL
      window.location.href = LINKEDIN_APP_INTENT;
    } else {
      // iOS / other mobile: Direct top-frame navigation triggers Apple Universal Links to launch LinkedIn app
      window.location.href = LINKEDIN_URL;
    }
    return;
  }

  // Desktop: If this is called from a non-anchor click or programmatic trigger, open in new tab.
  // If called from an `<a href={LINKEDIN_URL} target="_blank">`, doing nothing allows the native browser new-tab behavior.
}
