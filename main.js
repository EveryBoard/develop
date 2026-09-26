import {
  ConfigRoomService
} from "./chunk-4XER7LWM.js";
import {
  GameService
} from "./chunk-HPMNCQMK.js";
import {
  ChatService
} from "./chunk-LQSYW2IU.js";
import {
  CurrentGameService
} from "./chunk-LBAE2ANK.js";
import {
  environment
} from "./chunk-7QBOTGIB.js";
import {
  GameInfo,
  MessageDisplayer
} from "./chunk-YGRR4XOQ.js";
import {
  LocaleUtils,
  ThemeService
} from "./chunk-XCX6Z5NN.js";
import {
  FaIconComponent,
  faCog,
  faSpinner
} from "./chunk-LBQNMOIH.js";
import {
  Router,
  RouterLink,
  RouterOutlet,
  bootstrapApplication,
  provideRouter
} from "./chunk-VNLMPUFV.js";
import {
  AuthUser,
  ConnectedUserService,
  FirestoreDAO,
  UserService,
  connectAuthEmulator,
  connectFirestoreEmulator,
  getAuth,
  getFirestore,
  initializeApp,
  serverTimestamp,
  terminate
} from "./chunk-VAQYCAYP.js";
import "./chunk-WJSBHR2E.js";
import {
  MGPOptional,
  MGPValidation,
  Utils
} from "./chunk-Z6YKFH53.js";
import {
  NgClass,
  registerLocaleData
} from "./chunk-LPTF4T42.js";
import {
  Component,
  Injectable,
  LOCALE_ID,
  Subscription,
  __async,
  computed,
  enableProdMode,
  inject,
  provideZoneChangeDetection,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵi18n,
  ɵɵi18nEnd,
  ɵɵi18nStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-ZESDHCPZ.js";

// node_modules/@angular/common/locales/fr.js
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var u = void 0;
function plural(val) {
  const n = val, i = Math.floor(Math.abs(val)), v = val.toString().replace(/^[^.]*\.?/, "").length, e = parseInt(val.toString().replace(/^[^e]*(e([-+]?\d+))?/, "$2")) || 0;
  if (i === 0 || i === 1)
    return 1;
  if (e === 0 && (!(i === 0) && (i % 1e6 === 0 && v === 0)) || !(e >= 0 && e <= 5))
    return 4;
  return 5;
}
var fr_default = ["fr", [["AM", "PM"]], u, [["D", "L", "M", "M", "J", "V", "S"], ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], ["di", "lu", "ma", "me", "je", "ve", "sa"]], u, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["janv.", "f\xE9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\xFBt", "sept.", "oct.", "nov.", "d\xE9c."], ["janvier", "f\xE9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\xFBt", "septembre", "octobre", "novembre", "d\xE9cembre"]], u, [["av. J.-C.", "ap. J.-C."], u, ["avant J\xE9sus-Christ", "apr\xE8s J\xE9sus-Christ"]], 1, [6, 0], ["dd/MM/y", "d MMM y", "d MMMM y", "EEEE d MMMM y"], ["HH:mm", "HH:mm:ss", "HH:mm:ss z", "HH:mm:ss zzzz"], ["{1} {0}", "{1}, {0}", u, u], [",", "\u202F", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0\xA0%", "#,##0.00\xA0\xA4", "#E0"], "EUR", "\u20AC", "euro", { "ARS": ["$AR", "$"], "AUD": ["$AU", "$"], "BEF": ["FB"], "BMD": ["$BM", "$"], "BND": ["$BN", "$"], "BYN": [u, "\u0440."], "BZD": ["$BZ", "$"], "CAD": ["$CA", "$"], "CLP": ["$CL", "$"], "CNY": [u, "\xA5"], "COP": ["$CO", "$"], "CYP": ["\xA3CY"], "EGP": [u, "\xA3E"], "FJD": ["$FJ", "$"], "FKP": ["\xA3FK", "\xA3"], "FRF": ["F"], "GBP": ["\xA3GB", "\xA3"], "GIP": ["\xA3GI", "\xA3"], "HKD": [u, "$"], "IEP": ["\xA3IE"], "ILP": ["\xA3IL"], "ITL": ["\u20A4IT"], "JPY": [u, "\xA5"], "KMF": [u, "FC"], "LBP": ["\xA3LB", "\xA3L"], "MTP": ["\xA3MT"], "MXN": ["$MX", "$"], "NAD": ["$NA", "$"], "NIO": [u, "$C"], "NZD": ["$NZ", "$"], "PHP": [u, "\u20B1"], "RHD": ["$RH"], "RON": [u, "L"], "RWF": [u, "FR"], "SBD": ["$SB", "$"], "SGD": ["$SG", "$"], "SRD": ["$SR", "$"], "TOP": [u, "$T"], "TTD": ["$TT", "$"], "TWD": [u, "NT$"], "USD": ["$US", "$"], "UYU": ["$UY", "$"], "WST": ["$WS"], "XCD": [u, "$"], "XPF": ["FCFP"], "ZMW": [u, "Kw"] }, "ltr", plural];

// node_modules/@angular/localize/fesm2022/_localize-chunk.mjs
/**
 * @license Angular v21.2.22
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */
var BLOCK_MARKER$1 = ":";
var MEANING_SEPARATOR = "|";
var ID_SEPARATOR = "@@";
var LEGACY_ID_INDICATOR = "\u241F";
var textEncoder;
function fingerprint(str) {
  textEncoder ??= new TextEncoder();
  const utf8 = textEncoder.encode(str);
  const view = new DataView(utf8.buffer, utf8.byteOffset, utf8.byteLength);
  let hi = hash32(view, utf8.length, 0);
  let lo = hash32(view, utf8.length, 102072);
  if (hi == 0 && (lo == 0 || lo == 1)) {
    hi = hi ^ 319790063;
    lo = lo ^ -1801410264;
  }
  return BigInt.asUintN(32, BigInt(hi)) << BigInt(32) | BigInt.asUintN(32, BigInt(lo));
}
function computeMsgId(msg, meaning = "") {
  let msgFingerprint = fingerprint(msg);
  if (meaning) {
    msgFingerprint = BigInt.asUintN(64, msgFingerprint << BigInt(1)) | msgFingerprint >> BigInt(63) & BigInt(1);
    msgFingerprint += fingerprint(meaning);
  }
  return BigInt.asUintN(63, msgFingerprint).toString();
}
function hash32(view, length, c) {
  let a = 2654435769, b = 2654435769;
  let index = 0;
  const end = length - 12;
  for (; index <= end; index += 12) {
    a += view.getUint32(index, true);
    b += view.getUint32(index + 4, true);
    c += view.getUint32(index + 8, true);
    const res = mix(a, b, c);
    a = res[0], b = res[1], c = res[2];
  }
  const remainder = length - index;
  c += length;
  if (remainder >= 4) {
    a += view.getUint32(index, true);
    index += 4;
    if (remainder >= 8) {
      b += view.getUint32(index, true);
      index += 4;
      if (remainder >= 9) {
        c += view.getUint8(index++) << 8;
      }
      if (remainder >= 10) {
        c += view.getUint8(index++) << 16;
      }
      if (remainder === 11) {
        c += view.getUint8(index++) << 24;
      }
    } else {
      if (remainder >= 5) {
        b += view.getUint8(index++);
      }
      if (remainder >= 6) {
        b += view.getUint8(index++) << 8;
      }
      if (remainder === 7) {
        b += view.getUint8(index++) << 16;
      }
    }
  } else {
    if (remainder >= 1) {
      a += view.getUint8(index++);
    }
    if (remainder >= 2) {
      a += view.getUint8(index++) << 8;
    }
    if (remainder === 3) {
      a += view.getUint8(index++) << 16;
    }
  }
  return mix(a, b, c)[2];
}
function mix(a, b, c) {
  a -= b;
  a -= c;
  a ^= c >>> 13;
  b -= c;
  b -= a;
  b ^= a << 8;
  c -= a;
  c -= b;
  c ^= b >>> 13;
  a -= b;
  a -= c;
  a ^= c >>> 12;
  b -= c;
  b -= a;
  b ^= a << 16;
  c -= a;
  c -= b;
  c ^= b >>> 5;
  a -= b;
  a -= c;
  a ^= c >>> 3;
  b -= c;
  b -= a;
  b ^= a << 10;
  c -= a;
  c -= b;
  c ^= b >>> 15;
  return [a, b, c];
}
var Endian;
(function(Endian2) {
  Endian2[Endian2["Little"] = 0] = "Little";
  Endian2[Endian2["Big"] = 1] = "Big";
})(Endian || (Endian = {}));
function parseMessage(messageParts, expressions, location, messagePartLocations, expressionLocations = []) {
  const substitutions = {};
  const substitutionLocations = {};
  const associatedMessageIds = {};
  const metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
  const cleanedMessageParts = [metadata.text];
  const placeholderNames = [];
  let messageString = metadata.text;
  for (let i = 1; i < messageParts.length; i++) {
    const {
      messagePart,
      placeholderName = computePlaceholderName(i),
      associatedMessageId
    } = parsePlaceholder(messageParts[i], messageParts.raw[i]);
    messageString += `{$${placeholderName}}${messagePart}`;
    if (expressions !== void 0) {
      substitutions[placeholderName] = expressions[i - 1];
      substitutionLocations[placeholderName] = expressionLocations[i - 1];
    }
    placeholderNames.push(placeholderName);
    if (associatedMessageId !== void 0) {
      associatedMessageIds[placeholderName] = associatedMessageId;
    }
    cleanedMessageParts.push(messagePart);
  }
  const messageId = metadata.customId || computeMsgId(messageString, metadata.meaning || "");
  const legacyIds = metadata.legacyIds ? metadata.legacyIds.filter((id) => id !== messageId) : [];
  return {
    id: messageId,
    legacyIds,
    substitutions,
    substitutionLocations,
    text: messageString,
    customId: metadata.customId,
    meaning: metadata.meaning || "",
    description: metadata.description || "",
    messageParts: cleanedMessageParts,
    messagePartLocations,
    placeholderNames,
    associatedMessageIds,
    location
  };
}
function parseMetadata(cooked, raw) {
  const {
    text: messageString,
    block
  } = splitBlock(cooked, raw);
  if (block === void 0) {
    return {
      text: messageString
    };
  } else {
    const [meaningDescAndId, ...legacyIds] = block.split(LEGACY_ID_INDICATOR);
    const [meaningAndDesc, customId] = meaningDescAndId.split(ID_SEPARATOR, 2);
    let [meaning, description] = meaningAndDesc.split(MEANING_SEPARATOR, 2);
    if (description === void 0) {
      description = meaning;
      meaning = void 0;
    }
    if (description === "") {
      description = void 0;
    }
    return {
      text: messageString,
      meaning,
      description,
      customId,
      legacyIds
    };
  }
}
function parsePlaceholder(cooked, raw) {
  const {
    text: messagePart,
    block
  } = splitBlock(cooked, raw);
  if (block === void 0) {
    return {
      messagePart
    };
  } else {
    const [placeholderName, associatedMessageId] = block.split(ID_SEPARATOR);
    return {
      messagePart,
      placeholderName,
      associatedMessageId
    };
  }
}
function splitBlock(cooked, raw) {
  if (raw.charAt(0) !== BLOCK_MARKER$1) {
    return {
      text: cooked
    };
  } else {
    const endOfBlock = findEndOfBlock(cooked, raw);
    return {
      block: cooked.substring(1, endOfBlock),
      text: cooked.substring(endOfBlock + 1)
    };
  }
}
function computePlaceholderName(index) {
  return index === 1 ? "PH" : `PH_${index - 1}`;
}
function findEndOfBlock(cooked, raw) {
  for (let cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
    if (raw[rawIndex] === "\\") {
      rawIndex++;
    } else if (cooked[cookedIndex] === BLOCK_MARKER$1) {
      return cookedIndex;
    }
  }
  throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}

// node_modules/@angular/localize/fesm2022/localize.mjs
/**
 * @license Angular v21.2.22
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */
var MissingTranslationError = class extends Error {
  parsedMessage;
  type = "MissingTranslationError";
  constructor(parsedMessage) {
    super(`No translation found for ${describeMessage(parsedMessage)}.`);
    this.parsedMessage = parsedMessage;
  }
};
function translate$1(translations, messageParts, substitutions) {
  const message = parseMessage(messageParts, substitutions);
  let translation = translations[message.id];
  if (message.legacyIds !== void 0) {
    for (let i = 0; i < message.legacyIds.length && translation === void 0; i++) {
      translation = translations[message.legacyIds[i]];
    }
  }
  if (translation === void 0) {
    throw new MissingTranslationError(message);
  }
  return [translation.messageParts, translation.placeholderNames.map((placeholder) => {
    if (message.substitutions.hasOwnProperty(placeholder)) {
      return message.substitutions[placeholder];
    } else {
      throw new Error(`There is a placeholder name mismatch with the translation provided for the message ${describeMessage(message)}.
The translation contains a placeholder with name ${placeholder}, which does not exist in the message.`);
    }
  })];
}
function parseTranslation(messageString) {
  const parts = messageString.split(/{\$([^}]*)}/);
  const messageParts = [parts[0]];
  const placeholderNames = [];
  for (let i = 1; i < parts.length - 1; i += 2) {
    placeholderNames.push(parts[i]);
    messageParts.push(`${parts[i + 1]}`);
  }
  const rawMessageParts = messageParts.map((part) => part.charAt(0) === BLOCK_MARKER$1 ? "\\" + part : part);
  return {
    text: messageString,
    messageParts: makeTemplateObject(messageParts, rawMessageParts),
    placeholderNames
  };
}
function makeTemplateObject(cooked, raw) {
  Object.defineProperty(cooked, "raw", {
    value: raw
  });
  return cooked;
}
function describeMessage(message) {
  const meaningString = message.meaning && ` - "${message.meaning}"`;
  const legacy = message.legacyIds && message.legacyIds.length > 0 ? ` [${message.legacyIds.map((l) => `"${l}"`).join(", ")}]` : "";
  return `"${message.id}"${legacy} ("${message.text}"${meaningString})`;
}
function loadTranslations(translations) {
  if (!$localize.translate) {
    $localize.translate = translate;
  }
  if (!$localize.TRANSLATIONS) {
    $localize.TRANSLATIONS = {};
  }
  Object.keys(translations).forEach((key) => {
    $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
  });
}
function translate(messageParts, substitutions) {
  try {
    return translate$1($localize.TRANSLATIONS, messageParts, substitutions);
  } catch (e) {
    console.warn(e.message);
    return [messageParts, substitutions];
  }
}

// node_modules/@fortawesome/free-brands-svg-icons/index.mjs
/*!
 * Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2026 Fonticons, Inc.
 */
var faDiscord = {
  prefix: "fab",
  iconName: "discord",
  icon: [576, 512, [], "f392", "M492.5 69.8c-.2-.3-.4-.6-.8-.7-38.1-17.5-78.4-30-119.7-37.1-.4-.1-.8 0-1.1 .1s-.6 .4-.8 .8c-5.5 9.9-10.5 20.2-14.9 30.6-44.6-6.8-89.9-6.8-134.4 0-4.5-10.5-9.5-20.7-15.1-30.6-.2-.3-.5-.6-.8-.8s-.7-.2-1.1-.2c-41.3 7.1-81.6 19.6-119.7 37.1-.3 .1-.6 .4-.8 .7-76.2 113.8-97.1 224.9-86.9 334.5 0 .3 .1 .5 .2 .8s.3 .4 .5 .6c44.4 32.9 94 58 146.8 74.2 .4 .1 .8 .1 1.1 0s.7-.4 .9-.7c11.3-15.4 21.4-31.8 30-48.8 .1-.2 .2-.5 .2-.8s0-.5-.1-.8-.2-.5-.4-.6-.4-.3-.7-.4c-15.8-6.1-31.2-13.4-45.9-21.9-.3-.2-.5-.4-.7-.6s-.3-.6-.3-.9 0-.6 .2-.9 .3-.5 .6-.7c3.1-2.3 6.2-4.7 9.1-7.1 .3-.2 .6-.4 .9-.4s.7 0 1 .1c96.2 43.9 200.4 43.9 295.5 0 .3-.1 .7-.2 1-.2s.7 .2 .9 .4c2.9 2.4 6 4.9 9.1 7.2 .2 .2 .4 .4 .6 .7s.2 .6 .2 .9-.1 .6-.3 .9-.4 .5-.6 .6c-14.7 8.6-30 15.9-45.9 21.8-.2 .1-.5 .2-.7 .4s-.3 .4-.4 .7-.1 .5-.1 .8 .1 .5 .2 .8c8.8 17 18.8 33.3 30 48.8 .2 .3 .6 .6 .9 .7s.8 .1 1.1 0c52.9-16.2 102.6-41.3 147.1-74.2 .2-.2 .4-.4 .5-.6s.2-.5 .2-.8c12.3-126.8-20.5-236.9-86.9-334.5zm-302 267.7c-29 0-52.8-26.6-52.8-59.2s23.4-59.2 52.8-59.2c29.7 0 53.3 26.8 52.8 59.2 0 32.7-23.4 59.2-52.8 59.2zm195.4 0c-29 0-52.8-26.6-52.8-59.2s23.4-59.2 52.8-59.2c29.7 0 53.3 26.8 52.8 59.2 0 32.7-23.2 59.2-52.8 59.2z"]
};
var faGithub = {
  prefix: "fab",
  iconName: "github",
  icon: [512, 512, [], "f09b", "M216.5 362.5c-66-8-112.5-55.5-112.5-117 0-25 9-52 24-70-6.5-16.5-5.5-51.5 2-66 20-2.5 47 8 63 22.5 19-6 39-9 63.5-9s44.5 3 62.5 8.5c15.5-14 43-24.5 63-22 7 13.5 8 48.5 1.5 65.5 16 19 24.5 44.5 24.5 70.5 0 61.5-46.5 108-113.5 116.5 17 11 28.5 35 28.5 62.5l0 52C323 491.5 335.5 500 350.5 494 441 459.5 512 369 512 257 512 115.5 397 0 255.5 0S0 115.5 0 257c0 111 70.5 203 165.5 237.5 13.5 5 26.5-4 26.5-17.5l0-40c-7 3-16 5-24 5-33 0-52.5-18-66.5-51.5-5.5-13.5-11.5-21.5-23-23-6-.5-8-3-8-6 0-6 10-10.5 20-10.5 14.5 0 27 9 40 27.5 10 14.5 20.5 21 33 21s20.5-4.5 32-16c8.5-8.5 15-16 21-21z"]
};
var faFacebook = {
  prefix: "fab",
  iconName: "facebook",
  icon: [512, 512, [62e3], "f09a", "M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"]
};

// src/app/components/normal-component/header/header.component.ts
var _c0 = () => ["/"];
var _c1 = () => ["/play"];
var _c2 = () => ["/lobby"];
var _c3 = () => ["/local"];
var _c4 = () => ["/tutorial"];
var _c5 = () => ["/settings"];
var _c6 = () => ["/register"];
var _c7 = () => ["/login"];
function HeaderComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 32);
    \u0275\u0275listener("click", function HeaderComponent_Conditional_30_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navigateToPart());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.currentGameLabel());
  }
}
function HeaderComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "fa-icon", 31);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("icon", ctx_r1.faSpinner);
  }
}
function HeaderComponent_Conditional_35_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "a", 34);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 22)(4, "a", 35);
    \u0275\u0275i18n(5, 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "a", 36);
    \u0275\u0275listener("click", function HeaderComponent_Conditional_35_Conditional_0_Template_a_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275i18n(7, 8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.username().get());
  }
}
function HeaderComponent_Conditional_35_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "a", 37)(2, "strong");
    \u0275\u0275i18n(3, 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "a", 38);
    \u0275\u0275i18n(5, 10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(2, _c6));
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(3, _c7));
  }
}
function HeaderComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, HeaderComponent_Conditional_35_Conditional_0_Template, 8, 1, "div", 20)(1, HeaderComponent_Conditional_35_Conditional_1_Template, 6, 4, "div", 33);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.username().isPresent() ? 0 : 1);
  }
}
var HeaderComponent = class _HeaderComponent {
  router = inject(Router);
  connectedUserService = inject(ConnectedUserService);
  currentGameService = inject(CurrentGameService);
  faCog = faCog;
  faSpinner = faSpinner;
  userSubscription = new Subscription();
  currentGameSubscription = new Subscription();
  connectedUser = signal(AuthUser.NOT_CONNECTED, ...ngDevMode ? [{ debugName: "connectedUser" }] : (
    /* istanbul ignore next */
    []
  ));
  currentGameState = signal(MGPOptional.empty(), ...ngDevMode ? [{ debugName: "currentGameState" }] : (
    /* istanbul ignore next */
    []
  ));
  showMenu = false;
  currentGame = this.currentGameState.asReadonly();
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  username = computed(() => this.connectedUser().username.orElse(this.connectedUser().email), ...ngDevMode ? [{ debugName: "username" }] : (
    /* istanbul ignore next */
    []
  ));
  currentGameLabel = computed(() => {
    const currentGame = this.currentGame().get();
    const gameName = GameInfo.getByUrlName(currentGame.gameName).get().name;
    if (currentGame.role === "Observer" || currentGame.role === "Candidate") {
      return $localize`${gameName} by ${currentGame.creator.name}`;
    }
    if (currentGame.opponent == null) {
      return $localize`${gameName} (waiting for opponent)`;
    }
    const opponentName = this.connectedUser().id === currentGame.creator.id ? Utils.getNonNullable(currentGame.opponent.name) : currentGame.creator.name;
    return $localize`${gameName} against ${opponentName}`;
  }, ...ngDevMode ? [{ debugName: "currentGameLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.userSubscription = this.connectedUserService.subscribeToUser((user) => {
      this.connectedUser.set(user);
      this.loading.set(false);
    });
    this.currentGameSubscription = this.currentGameService.subscribeToCurrentGame((currentGame) => {
      this.currentGameState.set(currentGame);
    });
  }
  logout() {
    return __async(this, null, function* () {
      yield this.connectedUserService.disconnect();
      yield this.router.navigate(["/"]);
    });
  }
  navigateToPart() {
    return __async(this, null, function* () {
      const currentGame = this.currentGame().get();
      return this.router.navigate(["/play", currentGame.gameName, currentGame.id]);
    });
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.currentGameSubscription.unsubscribe();
  }
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], decls: 36, vars: 19, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_4930506384627295710$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_0 = goog.getMsg("Settings");
      i18n_0 = MSG_EXTERNAL_4930506384627295710$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Settings`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_2821179408673282599$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_1 = goog.getMsg("Home");
      i18n_1 = MSG_EXTERNAL_2821179408673282599$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Home`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_6017042194813294080$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_2 = goog.getMsg("Play online");
      i18n_2 = MSG_EXTERNAL_6017042194813294080$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Play online`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_4190634170116728013$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_3 = goog.getMsg("Create a game");
      i18n_3 = MSG_EXTERNAL_4190634170116728013$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Create a game`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_5801676690179723464$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_4 = goog.getMsg("Join a game");
      i18n_4 = MSG_EXTERNAL_5801676690179723464$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`Join a game`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_2615338817912103674$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_5 = goog.getMsg("Play offline");
      i18n_5 = MSG_EXTERNAL_2615338817912103674$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`Play offline`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_4190634170116728013$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_6 = goog.getMsg("Create a game");
      i18n_6 = MSG_EXTERNAL_4190634170116728013$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Create a game`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_3468367367164457633$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_7 = goog.getMsg("Learn the rules");
      i18n_7 = MSG_EXTERNAL_3468367367164457633$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`Learn the rules`;
    }
    let i18n_8;
    if (false) {
      const MSG_EXTERNAL_4086606389696938932$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_8 = goog.getMsg("Account");
      i18n_8 = MSG_EXTERNAL_4086606389696938932$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_8;
    } else {
      i18n_8 = $localize`Account`;
    }
    let i18n_9;
    if (false) {
      const MSG_EXTERNAL_7507948636555938109$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_9 = goog.getMsg("Log out");
      i18n_9 = MSG_EXTERNAL_7507948636555938109$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_9;
    } else {
      i18n_9 = $localize`Log out`;
    }
    let i18n_10;
    if (false) {
      const MSG_EXTERNAL_3301086086650990787$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_10 = goog.getMsg("Register");
      i18n_10 = MSG_EXTERNAL_3301086086650990787$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_10;
    } else {
      i18n_10 = $localize`Register`;
    }
    let i18n_11;
    if (false) {
      const MSG_EXTERNAL_2336550011721758066$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_11 = goog.getMsg("Log in");
      i18n_11 = MSG_EXTERNAL_2336550011721758066$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_HEADER_HEADER_COMPONENT_TS_11;
    } else {
      i18n_11 = $localize`Log in`;
    }
    return [i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, i18n_8, i18n_9, i18n_10, i18n_11, ["role", "navigation", "aria-label", "main navigation", 1, "navbar", "is-primary"], [1, "navbar-brand"], [1, "navbar-item", 3, "routerLink"], ["id", "logo", "src", "assets/images/logo.png", "width", "28", "height", "28"], ["role", "button", "aria-label", "menu", "aria-expanded", "false", "data-target", "menu", 1, "navbar-burger", 3, "click", "ngClass"], ["aria-hidden", "true"], ["id", "menu", 1, "navbar-menu", 3, "click", "ngClass"], [1, "navbar-start"], ["id", "home", 1, "navbar-item", 3, "routerLink"], [1, "navbar-item", "has-dropdown", "is-hoverable"], [1, "navbar-link"], [1, "navbar-dropdown"], ["id", "playOffline", 1, "navbar-link"], ["id", "playLocally", 1, "navbar-item", 3, "routerLink"], ["id", "tutorial", 1, "navbar-item", 3, "routerLink"], [1, "navbar-end"], ["id", "currentGameLink", 1, "navbar-item"], ["data-tooltip", i18n_0, 1, "navbar-item", 3, "routerLink"], [3, "icon"], [1, "navbar-item"], ["id", "spinner", 1, "navbar-item", 3, "icon"], ["id", "currentGameLink", 1, "navbar-item", 3, "click"], [1, "buttons"], ["id", "connectedUserName", 1, "navbar-link"], ["id", "account", "routerLink", "/account", 1, "navbar-item"], ["id", "logout", 1, "navbar-item", 3, "click"], ["id", "register", 1, "button", "is-primary", 3, "routerLink"], ["id", "login", 1, "button", "is-light", 3, "routerLink"]];
  }, template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 11)(1, "div", 12)(2, "a", 13);
      \u0275\u0275element(3, "img", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "a", 15);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_4_listener() {
        return ctx.showMenu = !ctx.showMenu;
      });
      \u0275\u0275element(5, "span", 16)(6, "span", 16)(7, "span", 16)(8, "span", 16);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 17);
      \u0275\u0275listener("click", function HeaderComponent_Template_div_click_9_listener() {
        return ctx.showMenu = !ctx.showMenu;
      });
      \u0275\u0275elementStart(10, "div", 18)(11, "a", 19);
      \u0275\u0275i18n(12, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 20)(14, "a", 21);
      \u0275\u0275i18n(15, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 22)(17, "a", 13);
      \u0275\u0275i18n(18, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "a", 13);
      \u0275\u0275i18n(20, 3);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "div", 20)(22, "a", 23);
      \u0275\u0275i18n(23, 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 22)(25, "a", 24);
      \u0275\u0275i18n(26, 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "a", 25);
      \u0275\u0275i18n(28, 6);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(29, "div", 26);
      \u0275\u0275conditionalCreate(30, HeaderComponent_Conditional_30_Template, 2, 1, "a", 27);
      \u0275\u0275elementStart(31, "a", 28);
      \u0275\u0275element(32, "fa-icon", 29);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 30);
      \u0275\u0275conditionalCreate(34, HeaderComponent_Conditional_34_Template, 1, 1, "fa-icon", 31)(35, HeaderComponent_Conditional_35_Template, 2, 1);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(12, _c0));
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", ctx.showMenu ? "is-active" : "");
      \u0275\u0275advance(5);
      \u0275\u0275property("ngClass", ctx.showMenu ? "is-active" : "");
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(13, _c0));
      \u0275\u0275advance(6);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(14, _c1));
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(15, _c2));
      \u0275\u0275advance(6);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(16, _c3));
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(17, _c4));
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.currentGame().isPresent() ? 30 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(18, _c5));
      \u0275\u0275advance();
      \u0275\u0275property("icon", ctx.faCog);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 34 : 35);
    }
  }, dependencies: [RouterLink, NgClass, FaIconComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderComponent, [{
    type: Component,
    args: [{ selector: "app-header", imports: [RouterLink, NgClass, FaIconComponent], template: `<nav class="navbar is-primary"
     role="navigation"
     aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item"
           [routerLink]="['/']">
            <img id="logo"
                 src="assets/images/logo.png"
                 width="28"
                 height="28">
        </a>
        <a role="button"
           class="navbar-burger"
           [ngClass]="showMenu ? 'is-active' : ''"
           aria-label="menu"
           aria-expanded="false"
           data-target="menu"
           (click)="showMenu = !showMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="menu"
         class="navbar-menu"
         [ngClass]="showMenu ? 'is-active' : ''"
         (click)="showMenu = !showMenu">

        <div class="navbar-start">
            <a id="home"
               class="navbar-item"
               [routerLink]="['/']"
               i18n>Home</a>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link"
                   i18n>Play online</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item"
                       [routerLink]="['/play']"
                       i18n>Create a game</a>
                    <a class="navbar-item"
                       [routerLink]="['/lobby']"
                       i18n>Join a game</a>
                </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable">
                <a id="playOffline"
                   class="navbar-link"
                   i18n>Play offline</a>
                <div class="navbar-dropdown">
                    <a id="playLocally"
                       class="navbar-item"
                       [routerLink]="['/local']"
                       i18n>Create a game</a>
                    <a id="tutorial"
                       class="navbar-item"
                       [routerLink]="['/tutorial']"
                       i18n>Learn the rules</a>
                </div>
            </div>
        </div>

        <div class="navbar-end">
            @if (currentGame().isPresent()) {
                <a id="currentGameLink"
                   class="navbar-item"
                   (click)="navigateToPart()">{{ currentGameLabel() }}</a>
            }

            <a class="navbar-item"
               [routerLink]="['/settings']"
               i18n-data-tooltip
               data-tooltip="Settings"><fa-icon [icon]="faCog"></fa-icon></a>

            <div class="navbar-item">
                @if (loading()) {
                    <fa-icon id="spinner"
                             [icon]="faSpinner"
                             class="navbar-item"></fa-icon>
                } @else {
                    @if (username().isPresent()) {
                        <div class="navbar-item has-dropdown is-hoverable">
                            <a id="connectedUserName"
                               class="navbar-link">{{ username().get() }}</a>
                            <div class="navbar-dropdown">
                                <a class="navbar-item"
                                   id="account"
                                   routerLink="/account"
                                   i18n>Account</a>
                                <a class="navbar-item"
                                   id="logout"
                                   (click)="logout()"
                                   i18n>Log out</a>
                            </div>
                        </div>
                    } @else {
                        <div class="buttons">
                            <a id="register"
                               class="button is-primary"
                               [routerLink]="['/register']">
                                <strong i18n>Register</strong>
                            </a>
                            <a id="login"
                               class="button is-light"
                               [routerLink]="['/login']"
                               i18n>Log in</a>
                        </div>
                    }
                }
            </div>
        </div>
    </div>
</nav>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src/app/components/normal-component/header/header.component.ts", lineNumber: 20 });
})();

// src/app/dao/ErrorDAO.ts
var ErrorDAO = class _ErrorDAO extends FirestoreDAO {
  constructor() {
    super("errors");
  }
  static \u0275fac = function ErrorDAO_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorDAO)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ErrorDAO, factory: _ErrorDAO.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorDAO, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/services/ErrorLoggerService.ts
var ErrorLoggerService = class _ErrorLoggerService {
  static singleton = MGPOptional.empty();
  errorDAO = inject(ErrorDAO);
  router = inject(Router);
  messageDisplayer = inject(MessageDisplayer);
  static logError(component, message, data) {
    if (this.singleton.isAbsent()) {
      throw new Error(`${component}: ${message} (extra data: ${JSON.stringify(data)})`);
    }
    this.singleton.get().logError(component, message, data);
    return MGPValidation.failure(component + ": " + message);
  }
  constructor() {
    _ErrorLoggerService.singleton = MGPOptional.of(this);
  }
  findErrors(component, route, message, data) {
    if (data === void 0) {
      return this.errorDAO.findWhere([["component", "==", component], ["route", "==", route], ["message", "==", message]]);
    } else {
      return this.errorDAO.findWhere([["component", "==", component], ["route", "==", route], ["message", "==", message], ["data", "==", data]]);
    }
  }
  logError(component, message, data) {
    return __async(this, null, function* () {
      this.messageDisplayer.criticalMessage($localize`An unexpected error was encountered. We have logged it and will try to fix its cause as soon as possible.`);
      const route = this.router.url;
      const previousErrors = yield this.findErrors(component, route, message, data);
      if (previousErrors.length === 0) {
        const error = {
          component,
          route,
          message,
          firstEncounter: serverTimestamp(),
          lastEncounter: serverTimestamp(),
          occurences: 1
        };
        if (data != null) {
          error.data = data;
        }
        yield this.errorDAO.create(error);
      } else {
        const previousErrorId = previousErrors[0].id;
        const previousError = previousErrors[0].data;
        yield this.errorDAO.update(previousErrorId, {
          lastEncounter: serverTimestamp(),
          occurences: previousError.occurences + 1
        });
      }
    });
  }
  static \u0275fac = function ErrorLoggerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorLoggerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ErrorLoggerService, factory: _ErrorLoggerService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorLoggerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  _themeService = inject(ThemeService);
  _errorLoggerService = inject(ErrorLoggerService);
  faDiscord = faDiscord;
  faFacebook = faFacebook;
  faGithub = faGithub;
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 18, vars: 3, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_9061145701555774368$$SRC_APP_APP_COMPONENT_TS_0 = goog.getMsg("If you like {$startTagStrong}EveryBoard{$closeTagStrong}, follow us!", { "closeTagStrong": "\uFFFD/#8\uFFFD", "startTagStrong": "\uFFFD#8\uFFFD" }, { original_code: { "closeTagStrong": "</strong>", "startTagStrong": "<strong>" } });
      i18n_0 = MSG_EXTERNAL_9061145701555774368$$SRC_APP_APP_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`If you like ${"\uFFFD#8\uFFFD"}:START_TAG_STRONG:EveryBoard${"\uFFFD/#8\uFFFD"}:CLOSE_TAG_STRONG:, follow us!`;
    }
    return [i18n_0, [1, "container", "mt-2"], [1, "footer"], [1, "content", "has-text-centered"], ["href", "https://discord.gg/n4jsfsdmrZ"], [3, "icon"], ["href", "https://github.com/EveryBoard/EveryBoard"], ["href", "https://facebook.com/EveryBoard"]];
  }, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-header");
      \u0275\u0275elementStart(1, "main", 1);
      \u0275\u0275element(2, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "footer", 2)(4, "div", 3)(5, "p")(6, "span");
      \u0275\u0275i18nStart(7, 0);
      \u0275\u0275element(8, "strong");
      \u0275\u0275i18nEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275text(9, " \xA0 ");
      \u0275\u0275elementStart(10, "a", 4);
      \u0275\u0275element(11, "fa-icon", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275text(12, "\xA0 ");
      \u0275\u0275elementStart(13, "a", 6);
      \u0275\u0275element(14, "fa-icon", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275text(15, "\xA0 ");
      \u0275\u0275elementStart(16, "a", 7);
      \u0275\u0275element(17, "fa-icon", 5);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(11);
      \u0275\u0275property("icon", ctx.faDiscord);
      \u0275\u0275advance(3);
      \u0275\u0275property("icon", ctx.faGithub);
      \u0275\u0275advance(3);
      \u0275\u0275property("icon", ctx.faFacebook);
    }
  }, dependencies: [
    HeaderComponent,
    RouterOutlet,
    FaIconComponent
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{ selector: "app-root", imports: [
      HeaderComponent,
      RouterOutlet,
      FaIconComponent
    ], template: '<app-header></app-header>\n<main class="container mt-2">\n    <router-outlet></router-outlet>\n</main>\n<footer class="footer">\n    <div class="content has-text-centered">\n        <p>\n            <span i18n>If you like <strong>EveryBoard</strong>, follow us!</span>\n            &nbsp;\n            <a href="https://discord.gg/n4jsfsdmrZ"><fa-icon [icon]="faDiscord"></fa-icon></a>&nbsp;\n            <a href="https://github.com/EveryBoard/EveryBoard"><fa-icon [icon]="faGithub"></fa-icon></a>&nbsp;\n            <a href="https://facebook.com/EveryBoard"><fa-icon [icon]="faFacebook"></fa-icon></a>\n        </p>\n    </div>\n</footer>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 19 });
})();

// src/app/guard/account-guard.ts
var AccountGuard = class _AccountGuard {
  connectedUserService = inject(ConnectedUserService);
  userSubscription;
  canActivate() {
    return __async(this, null, function* () {
      const result = yield new Promise((resolve) => {
        this.userSubscription = this.connectedUserService.subscribeToUser((user) => __async(this, null, function* () {
          return resolve(yield this.evaluateUserPermission(user));
        }));
      });
      this.userSubscription.unsubscribe();
      return result;
    });
  }
  static \u0275fac = function AccountGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccountGuard)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AccountGuard, factory: _AccountGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccountGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/guard/connected-but-not-verified.guard.ts
var ConnectedButNotVerifiedGuard = class _ConnectedButNotVerifiedGuard extends AccountGuard {
  router = inject(Router);
  evaluateUserPermission(user) {
    return __async(this, null, function* () {
      if (user.isConnected() === false) {
        return this.router.parseUrl("/login");
      } else if (user.verified) {
        return this.router.parseUrl("/");
      } else {
        return true;
      }
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ConnectedButNotVerifiedGuard_BaseFactory;
    return function ConnectedButNotVerifiedGuard_Factory(__ngFactoryType__) {
      return (\u0275ConnectedButNotVerifiedGuard_BaseFactory || (\u0275ConnectedButNotVerifiedGuard_BaseFactory = \u0275\u0275getInheritedFactory(_ConnectedButNotVerifiedGuard)))(__ngFactoryType__ || _ConnectedButNotVerifiedGuard);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ConnectedButNotVerifiedGuard, factory: _ConnectedButNotVerifiedGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConnectedButNotVerifiedGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/guard/exclusive-online-game-guard.ts
var ExclusiveOnlineGameGuard = class _ExclusiveOnlineGameGuard {
  currentGameService = inject(CurrentGameService);
  router = inject(Router);
  currentGameSubscription = MGPOptional.empty();
  canActivate(route) {
    return __async(this, null, function* () {
      const currentGame = yield this.currentGameService.getCurrentGame();
      if (currentGame.isAbsent()) {
        return true;
      }
      const game = currentGame.get();
      if (route.params.id === game.id) {
        return true;
      }
      return this.router.parseUrl("/play/" + game.gameName + "/" + game.id);
    });
  }
  static \u0275fac = function ExclusiveOnlineGameGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ExclusiveOnlineGameGuard)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ExclusiveOnlineGameGuard, factory: _ExclusiveOnlineGameGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExclusiveOnlineGameGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/guard/not-connected.guard.ts
var NotConnectedGuard = class _NotConnectedGuard extends AccountGuard {
  router = inject(Router);
  evaluateUserPermission(user) {
    return __async(this, null, function* () {
      if (user.isConnected() === false) {
        return true;
      } else {
        return this.router.parseUrl("/");
      }
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275NotConnectedGuard_BaseFactory;
    return function NotConnectedGuard_Factory(__ngFactoryType__) {
      return (\u0275NotConnectedGuard_BaseFactory || (\u0275NotConnectedGuard_BaseFactory = \u0275\u0275getInheritedFactory(_NotConnectedGuard)))(__ngFactoryType__ || _NotConnectedGuard);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotConnectedGuard, factory: _NotConnectedGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotConnectedGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/guard/verified-account.guard.ts
var VerifiedAccountGuard = class _VerifiedAccountGuard extends AccountGuard {
  router = inject(Router);
  static evaluateUserPermission(router, user) {
    return __async(this, null, function* () {
      if (user.isConnected() === false) {
        return router.parseUrl("/login");
      } else if (user.verified === false) {
        return router.parseUrl("/verify-account");
      } else {
        return true;
      }
    });
  }
  evaluateUserPermission(user) {
    return __async(this, null, function* () {
      return _VerifiedAccountGuard.evaluateUserPermission(this.router, user);
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275VerifiedAccountGuard_BaseFactory;
    return function VerifiedAccountGuard_Factory(__ngFactoryType__) {
      return (\u0275VerifiedAccountGuard_BaseFactory || (\u0275VerifiedAccountGuard_BaseFactory = \u0275\u0275getInheritedFactory(_VerifiedAccountGuard)))(__ngFactoryType__ || _VerifiedAccountGuard);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _VerifiedAccountGuard, factory: _VerifiedAccountGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VerifiedAccountGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/app.routes.ts
var routes = [
  { path: "login", loadComponent: () => import("./login.component-2COJU2N4.js").then((m) => m.LoginComponent) },
  { path: "lobby", loadComponent: () => import("./lobby.component-4SKZL26M.js").then((m) => m.LobbyComponent), canActivate: [VerifiedAccountGuard] },
  { path: "account", loadComponent: () => import("./account.component-EWMMECQJ.js").then((m) => m.AccountComponent), canActivate: [VerifiedAccountGuard] },
  { path: "settings", loadComponent: () => import("./settings.component-WJQ7WNUJ.js").then((m) => m.SettingsComponent) },
  { path: "register", loadComponent: () => import("./register.component-XFQ4QOG4.js").then((m) => m.RegisterComponent), canActivate: [NotConnectedGuard] },
  { path: "reset-password", loadComponent: () => import("./reset-password.component-D3HFMRDG.js").then((m) => m.ResetPasswordComponent) },
  { path: "notFound/:message", loadComponent: () => import("./not-found.component-EY26YHTF.js").then((m) => m.NotFoundComponent) },
  { path: "nextGameLoading", loadComponent: () => import("./next-game-loading.component-UXDFVP6O.js").then((m) => m.NextGameLoadingComponent), canActivate: [VerifiedAccountGuard] },
  { path: "verify-account", loadComponent: () => import("./verify-account.component-6SLC25SF.js").then((m) => m.VerifyAccountComponent), canActivate: [ConnectedButNotVerifiedGuard] },
  { path: "play", loadComponent: () => import("./online-game-selection.component-5BNXZ3BD.js").then((m) => m.OnlineGameSelectionComponent), canActivate: [ExclusiveOnlineGameGuard, VerifiedAccountGuard] },
  { path: "play/:game", loadComponent: () => import("./online-game-creation.component-SP7FC6NQ.js").then((m) => m.OnlineGameCreationComponent), canActivate: [ExclusiveOnlineGameGuard, VerifiedAccountGuard] },
  { path: "play/:game/:id", loadComponent: () => import("./online-game-wrapper.component-YPFWDOS4.js").then((m) => m.OnlineGameWrapperComponent), canActivate: [ExclusiveOnlineGameGuard, VerifiedAccountGuard] },
  { path: "local", loadComponent: () => import("./local-game-creation.component-W2C7NRMY.js").then((m) => m.LocalGameCreationComponent) },
  { path: "local/:game/config", loadComponent: () => import("./local-game-configuration.component-4CMP3ZH6.js").then((m) => m.LocalGameConfigurationComponent) },
  { path: "local/:game", loadComponent: () => import("./local-game-wrapper.component-UFD7Q3CA.js").then((m) => m.LocalGameWrapperComponent) },
  { path: "tutorial", loadComponent: () => import("./tutorial-game-creation.component-GQ6AVVXV.js").then((m) => m.TutorialGameCreationComponent) },
  { path: "tutorial/:game", loadComponent: () => import("./tutorial-game-wrapper.component-CNBQKZIB.js").then((m) => m.TutorialGameWrapperComponent) },
  { path: "", loadComponent: () => import("./welcome.component-OIM5R7UC.js").then((m) => m.WelcomeComponent) },
  { path: "demo", loadComponent: () => import("./demo-page.component-CI6UOKA6.js").then((m) => m.DemoPageComponent) },
  { path: "**", loadComponent: () => import("./not-found.component-EY26YHTF.js").then((m) => m.NotFoundComponent) }
];
function initializeFirebase(terminateFirestore = terminate) {
  initializeApp(environment.firebaseConfig);
  const firestore = getFirestore();
  const host = firestore.toJSON()["settings"].host;
  if (environment.useEmulators && host !== "localhost:8080") {
    connectFirestoreEmulator(firestore, "localhost", 8080);
  }
  window.addEventListener("pagehide", () => void terminateFirestore(firestore), { once: true });
  const fireauth = getAuth();
  if (environment.useEmulators && fireauth.config["emulator"] == null) {
    connectAuthEmulator(fireauth, "http://localhost:9099", { disableWarnings: true });
  }
}

// src/main.ts
registerLocaleData(fr_default);
function bootstrapApp() {
  if (environment.production) {
    enableProdMode();
  }
  initializeFirebase();
  bootstrapApplication(AppComponent, {
    providers: [
      provideZoneChangeDetection(),
      ConnectedUserService,
      GameService,
      ConfigRoomService,
      UserService,
      ChatService,
      ThemeService,
      { provide: LOCALE_ID, useValue: LocaleUtils.getLocale() },
      provideRouter(routes)
    ]
  }).catch((err) => console.error(err));
}
var runtimeTranslations = true;
var locale = LocaleUtils.getLocale();
if (runtimeTranslations && locale !== "en") {
  fetch(environment.root + "assets/" + locale + ".json").then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return { "locale": "en", "translations": {} };
    }
  }).then((json) => {
    loadTranslations(json.translations);
    $localize.locale = json.locale;
    bootstrapApp();
  }).catch(function(err) {
    console.log(err);
  });
} else {
  bootstrapApp();
}
//# sourceMappingURL=main.js.map
