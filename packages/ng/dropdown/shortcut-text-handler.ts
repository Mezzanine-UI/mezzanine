/**
 * `shortcutTextHandler` 的 Angular 版本,與 React
 * `packages/react/src/Dropdown/shortcutTextHandler.ts` 1:1 對齊。
 *
 * 用法:Dropdown / Menu 的選項若提供 `shortcutKeys`(字串陣列),MznDropdownItem
 * 會用此函式把它格式化成「⌘N / Ctrl+N」這類 Mac / Windows 共存的顯示字串,
 * 然後當作 `appendContent` 塞入 MznDropdownItemCard 的 suffix 區塊,對齊
 * React `DropdownItem.tsx:482-484 / 506 / 651 / 714` 的行為。
 *
 * 純函式,無 Angular 相依,可在 template / computed / utils 任意呼叫。
 */
const parseShortcut = (
  shortcut: string | number,
): { modifiers: string[]; mainKey: string } => {
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
        // Windows doesn't have cmd; treat as Ctrl to keep display consistent.
        parts.push('Ctrl');
        break;
      case 'option':
        // Option (Mac) maps to Alt (Windows) in display.
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

const formatShortcut = (shortcut: string | number, isMac: boolean): string => {
  const { modifiers, mainKey } = parseShortcut(shortcut);

  return isMac
    ? formatMacShortcut(modifiers, mainKey)
    : formatWindowsShortcut(modifiers, mainKey);
};

/**
 * 把 shortcut keys 陣列轉成顯示字串,格式 `{mac} / {windows} / {其他}`。
 * 無 shortcut keys 時回傳空字串。
 *
 * @example
 * shortcutTextHandler(['ctrl+n', 'cmd+n']) // '⌘N / Ctrl+N'
 * shortcutTextHandler(['delete', 'backspace']) // 'Delete / Backspace'
 * shortcutTextHandler(['k']) // 'K'
 * shortcutTextHandler(['ctrl+r', 'cmd+r', 'f5']) // '⌘R / Ctrl+R / F5'
 */
export function shortcutTextHandler(
  shortcutKeys: ReadonlyArray<string | number> | undefined,
): string {
  if (!shortcutKeys || shortcutKeys.length === 0) return '';

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
    } else if (modifiers.includes('shift')) {
      // Shift works on both platforms — emit in both for parity.
      mac.push(formatShortcut(shortcut, true));
      windows.push(formatShortcut(shortcut, false));
    } else {
      others.push(formatShortcut(shortcut, false));
    }
  });

  const parts = [
    ...Array.from(new Set(mac)),
    ...Array.from(new Set(windows)),
    ...Array.from(new Set(others)),
  ];

  return parts.join(' / ');
}
