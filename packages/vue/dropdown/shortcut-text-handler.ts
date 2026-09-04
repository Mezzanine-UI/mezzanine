/**
 * Parses a shortcut key string into modifiers and main key.
 * @param shortcut - Shortcut key string (e.g., 'cmd+shift+n', 'ctrl+alt+delete')
 * @returns Object with modifiers and main key
 */
const parseShortcut = (shortcut: string | number) => {
  const str = String(shortcut).toLowerCase();
  const tokens = str
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean);

  const modifiers: string[] = [];
  let mainKey: string | null = null;

  tokens.forEach((token) => {
    switch (token) {
      case 'cmd':
      case 'meta':
      case 'command':
        modifiers.push('cmd');
        break;
      case 'ctrl':
      case 'control':
        modifiers.push('ctrl');
        break;
      case 'alt':
      case 'option':
        modifiers.push(token === 'option' ? 'option' : 'alt');
        break;
      case 'shift':
        modifiers.push('shift');
        break;
      default:
        if (!mainKey) {
          mainKey = token;
        }
        break;
    }
  });

  return { modifiers, mainKey: mainKey || str };
};

/**
 * Formats a shortcut for Mac display.
 * @param modifiers - Array of modifier keys
 * @param mainKey - Main key
 * @returns Formatted Mac shortcut string
 */
const formatMacShortcut = (modifiers: string[], mainKey: string): string => {
  const symbols: string[] = [];

  modifiers.forEach((mod) => {
    switch (mod) {
      case 'cmd':
        symbols.push('⌘');
        break;
      case 'option':
        symbols.push('⌥');
        break;
      case 'shift':
        symbols.push('⇧');
        break;
      case 'ctrl':
        symbols.push('⌃');
        break;
    }
  });

  const formattedKey = mainKey.toUpperCase();

  if (symbols.length > 0) {
    return `${symbols.join('')}${formattedKey}`;
  }

  return formattedKey;
};

/**
 * Formats a shortcut for Windows display.
 * @param modifiers - Array of modifier keys
 * @param mainKey - Main key
 * @returns Formatted Windows shortcut string
 */
const formatWindowsShortcut = (
  modifiers: string[],
  mainKey: string,
): string => {
  const parts: string[] = [];

  modifiers.forEach((mod) => {
    switch (mod) {
      case 'ctrl':
        parts.push('Ctrl');
        break;
      case 'alt':
        parts.push('Alt');
        break;
      case 'shift':
        parts.push('Shift');
        break;
      case 'cmd':
        // Windows doesn't have cmd, but if present, treat as Ctrl
        parts.push('Ctrl');
        break;
      case 'option':
        // Option on Mac is Alt on Windows
        parts.push('Alt');
        break;
    }
  });

  const formattedKey =
    mainKey.charAt(0).toUpperCase() + mainKey.slice(1).toLowerCase();

  if (parts.length > 0) {
    return `${parts.join('+')}+${formattedKey}`;
  }

  return formattedKey;
};

/**
 * Converts a shortcut key string into a formatted display string.
 * @param shortcut - Shortcut key string (e.g., 'cmd+n', 'ctrl+n', 'k')
 * @param isMac - Whether to format as Mac shortcut
 * @returns Formatted display string
 */
export const formatShortcut = (
  shortcut: string | number,
  isMac: boolean,
): string => {
  const { modifiers, mainKey } = parseShortcut(shortcut);

  if (isMac) {
    return formatMacShortcut(modifiers, mainKey);
  }

  return formatWindowsShortcut(modifiers, mainKey);
};

/**
 * Converts an array of shortcut keys into a display string.
 * Format: {mac_shortcut} / {windows_shortcut} / {other_keys}
 *
 * @param shortcutKeys - Array of shortcut keys
 * @returns Formatted display string
 *
 * @example
 * shortcutTextHandler(['ctrl+n', 'cmd+n']) // '⌘N / Ctrl+N'
 * shortcutTextHandler(['delete', 'backspace']) // 'Delete / Backspace'
 * shortcutTextHandler(['k']) // 'K'
 * shortcutTextHandler(['ctrl+r', 'cmd+r', 'f5']) // '⌘R / Ctrl+R / F5'
 * shortcutTextHandler(['cmd+shift+n', 'ctrl+shift+n']) // '⌘⇧N / Ctrl+Shift+N'
 * shortcutTextHandler(['cmd+option+n', 'ctrl+alt+n']) // '⌘⌥N / Ctrl+Alt+N'
 */
export const shortcutTextHandler = (
  shortcutKeys: Array<string | number>,
): string => {
  if (!shortcutKeys || shortcutKeys.length === 0) {
    return '';
  }

  const mac: string[] = [];
  const windows: string[] = [];
  const others: string[] = [];

  shortcutKeys.forEach((shortcut) => {
    const { modifiers } = parseShortcut(shortcut);

    const hasMacModifier =
      modifiers.includes('cmd') || modifiers.includes('option');
    const hasWindowsModifier =
      modifiers.includes('ctrl') || modifiers.includes('alt');

    if (hasMacModifier) {
      mac.push(formatShortcut(shortcut, true));
    } else if (hasWindowsModifier) {
      windows.push(formatShortcut(shortcut, false));
    } else {
      // Single key or key with only shift
      if (modifiers.includes('shift')) {
        // Shift can be used on both platforms
        mac.push(formatShortcut(shortcut, true));
        windows.push(formatShortcut(shortcut, false));
      } else {
        others.push(formatShortcut(shortcut, false));
      }
    }
  });

  // Remove duplicates and combine
  const uniqueMac = Array.from(new Set(mac));
  const uniqueWindows = Array.from(new Set(windows));
  const uniqueOthers = Array.from(new Set(others));

  const parts = [...uniqueMac, ...uniqueWindows, ...uniqueOthers];

  return parts.join(' / ');
};

export default shortcutTextHandler;
