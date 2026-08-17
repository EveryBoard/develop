import {
  MGPOptional
} from "./chunk-KI3WLQMB.js";
import {
  DOCUMENT,
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-EXT2DCW7.js";

// src/app/utils/LocaleUtils.ts
var LocaleUtils = class _LocaleUtils {
  static getNavigatorLanguage() {
    return navigator.language;
  }
  static getStoredLocale() {
    return localStorage.getItem("locale");
  }
  static getLocale() {
    const defaultLocale = "fr";
    const validLocales = ["en", "fr"];
    const foundLocale = _LocaleUtils.getStoredLocale() ?? _LocaleUtils.getNavigatorLanguage() ?? defaultLocale;
    const locale = foundLocale.slice(0, 2).toLowerCase();
    if (validLocales.some((validLocale) => validLocale === locale)) {
      return locale;
    } else {
      return defaultLocale;
    }
  }
};

// src/app/services/UserSettingsService.ts
var UserSettingsService = class _UserSettingsService {
  changeTheme(theme) {
    localStorage.setItem("theme", theme);
  }
  getTheme() {
    return MGPOptional.ofNullable(localStorage.getItem("theme"));
  }
  changeLanguage(language) {
    localStorage.setItem("locale", language.toLowerCase());
  }
  getLanguage() {
    return LocaleUtils.getLocale();
  }
  static \u0275fac = function UserSettingsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserSettingsService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserSettingsService, factory: _UserSettingsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserSettingsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/services/ThemeService.ts
var ThemeService = class _ThemeService {
  document = inject(DOCUMENT);
  userSettingsService = inject(UserSettingsService);
  theme;
  availableThemes = ["dark", "light"];
  constructor() {
    const storedTheme = this.getStoredTheme();
    if (storedTheme.isPresent()) {
      this.loadTheme(storedTheme.get());
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.loadTheme("dark");
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      this.loadTheme("light");
    } else {
      this.loadTheme("dark");
    }
  }
  getStoredTheme() {
    const theme = this.userSettingsService.getTheme();
    if (theme.isPresent()) {
      const actualTheme = theme.get();
      if (this.availableThemes.some((availableTheme) => availableTheme === actualTheme)) {
        return MGPOptional.of(actualTheme);
      }
    }
    return MGPOptional.empty();
  }
  loadTheme(theme) {
    const htmlElement = this.document.getElementsByTagName("html")[0];
    htmlElement.setAttribute("data-theme", theme);
    this.loadStyle(theme + ".css");
    this.theme = theme;
  }
  loadStyle(styleName) {
    const head = this.document.getElementsByTagName("head")[0];
    const themeLink = this.document.getElementById("theme");
    if (themeLink != null) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement("link");
      style.id = "theme";
      style.rel = "stylesheet";
      style.href = `${styleName}`;
      head.appendChild(style);
    }
  }
  getTheme() {
    return this.theme;
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  LocaleUtils,
  UserSettingsService,
  ThemeService
};
//# sourceMappingURL=chunk-Y7XOKLO3.js.map
