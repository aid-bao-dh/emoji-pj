/**
 * Facebook Unicode Font Converter
 * Converts plain text to various Facebook-compatible Unicode styling.
 */

export const FONT_STYLES = [
  { id: "boldSans", label: "In Đậm (Sans)", preview: "𝗕𝗼𝗹𝗱" },
  { id: "boldItalic", label: "Đậm & Nghiêng", preview: "𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘" },
  { id: "italicSans", label: "In Nghiêng", preview: "𝘐𝘵𝘢𝘭𝘪𝘤" },
  { id: "boldSerif", label: "In Đậm (Serif)", preview: "𝐁𝐨𝐥𝐝 𝐒𝐞𝐫𝐢𝐟" },
  { id: "monospace", label: "Chữ Gõ Máy", preview: "𝙼𝚘𝚗𝚘" },
  { id: "bubbleBlack", label: "Bong Bóng Đen", preview: "🅑🅛🅐🅒🅚" },
  { id: "bubbleWhite", label: "Bong Bóng Trắng", preview: "Ⓦⓗⓘⓣⓔ" },
  { id: "strikethrough", label: "Gạch Ngang (Giá cũ)", preview: "S̶t̶r̶i̶k̶e̶" },
  { id: "underline", label: "Gạch Chân", preview: "U̲n̲d̲e̲r̲" },
];

export function convertText(text, styleId) {
  if (!text) return "";

  switch (styleId) {
    case "boldSans":
      return transformLetters(text, 0x1d5d4, 0x1d5ee, 0x1d7ec);
    case "boldSerif":
      return transformLetters(text, 0x1d400, 0x1d41a, 0x1d7ce);
    case "italicSans":
      return transformLetters(text, 0x1d608, 0x1d622);
    case "boldItalic":
      return transformLetters(text, 0x1d63c, 0x1d656);
    case "monospace":
      return transformLetters(text, 0x1d670, 0x1d68a, 0x1d7f6);
    case "bubbleBlack":
      return transformBubbleBlack(text);
    case "bubbleWhite":
      return transformBubbleWhite(text);
    case "strikethrough":
      return text
        .split("")
        .map((c) => c + "\u0336")
        .join("");
    case "underline":
      return text
        .split("")
        .map((c) => c + "\u0332")
        .join("");
    default:
      return text;
  }
}

function transformLetters(text, capBase, lowerBase, numBase = null) {
  const diffCap = capBase - 65;
  const diffLower = lowerBase - 97;
  const diffNum = numBase ? numBase - 48 : null;

  return text
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(code + diffCap);
      if (code >= 97 && code <= 122) return String.fromCodePoint(code + diffLower);
      if (diffNum !== null && code >= 48 && code <= 57) return String.fromCodePoint(code + diffNum);
      return c;
    })
    .join("");
}

function transformBubbleBlack(text) {
  return text
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      // Capital A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1f150 + (code - 65));
      }
      // Lower a-z -> uppercase black circles
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x1f150 + (code - 97));
      }
      // Numbers 1-9
      if (code >= 49 && code <= 57) {
        return String.fromCodePoint(0x2776 + (code - 49));
      }
      if (code === 48) return "⓿";
      return c;
    })
    .join("");
}

function transformBubbleWhite(text) {
  return text
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x24b6 + (code - 65));
      }
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x24d0 + (code - 97));
      }
      if (code >= 49 && code <= 57) {
        return String.fromCodePoint(0x2460 + (code - 49));
      }
      if (code === 48) return "⓪";
      return c;
    })
    .join("");
}
