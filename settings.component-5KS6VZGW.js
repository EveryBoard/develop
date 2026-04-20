import {
  ThemeService,
  UserSettingsService
} from "./chunk-7JWLDCZD.js";
import {
  NgSelectOption,
  ReactiveFormsModule,
  ɵNgSelectMultipleOption
} from "./chunk-OJTN7ELL.js";
import "./chunk-VWERQGBR.js";
import "./chunk-XUYKWQYA.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵi18n,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-YYRXZMOY.js";

// src/app/components/normal-component/settings/settings.component.ts
function SettingsComponent_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const theme_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("id", \u0275\u0275interpolate1("theme_", theme_r1.value))("value", theme_r1.value)("selected", theme_r1.value === ctx_r1.currentTheme);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", theme_r1.name, " ");
  }
}
function SettingsComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const language_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("id", \u0275\u0275interpolate1("language_", language_r3.value))("value", language_r3.value)("selected", language_r3.value === ctx_r1.currentLanguage);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", language_r3.name, " ");
  }
}
var SettingsComponent = class _SettingsComponent {
  userSettingsService = inject(UserSettingsService);
  availableLanguages = [
    { value: "fr", name: "Fran\xE7ais" },
    { value: "en", name: "English" }
  ];
  availableThemes = [
    { value: "light", name: $localize`Light` },
    { value: "dark", name: $localize`Dark` }
  ];
  currentTheme;
  currentLanguage;
  constructor() {
    this.currentTheme = inject(ThemeService).getTheme();
    this.currentLanguage = this.userSettingsService.getLanguage();
  }
  changeLanguage(event) {
    const target = event.target;
    this.userSettingsService.changeLanguage(target.value);
    this.reload();
  }
  changeTheme(event) {
    const target = event.target;
    this.userSettingsService.changeTheme(target.value);
    this.reload();
  }
  reload() {
    window.open(window.location.href, "_self");
  }
  static \u0275fac = function SettingsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SettingsComponent, selectors: [["app-settings"]], decls: 19, vars: 0, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_6153797048311741939$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_SETTINGS_SETTINGS_COMPONENT_TS_0 = goog.getMsg("User settings");
      i18n_0 = MSG_EXTERNAL_6153797048311741939$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_SETTINGS_SETTINGS_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`User settings`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_7103588127254721505$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_SETTINGS_SETTINGS_COMPONENT_TS_1 = goog.getMsg("Theme");
      i18n_1 = MSG_EXTERNAL_7103588127254721505$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_SETTINGS_SETTINGS_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Theme`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_2826581353496868063$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_SETTINGS_SETTINGS_COMPONENT_TS_2 = goog.getMsg("Language");
      i18n_2 = MSG_EXTERNAL_2826581353496868063$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_SETTINGS_SETTINGS_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Language`;
    }
    return [i18n_0, i18n_1, i18n_2, [1, "box"], [1, "title"], [1, "field"], ["for", "theme", 1, "label"], [1, "control"], [1, "select"], ["id", "theme", 3, "change"], [3, "value", "id", "selected"], ["for", "language", 1, "label"], ["id", "language", 3, "change"]];
  }, template: function SettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 3)(1, "p", 4);
      \u0275\u0275i18n(2, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 5)(4, "label", 6);
      \u0275\u0275i18n(5, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 7)(7, "div", 8)(8, "select", 9);
      \u0275\u0275listener("change", function SettingsComponent_Template_select_change_8_listener($event) {
        return ctx.changeTheme($event);
      });
      \u0275\u0275repeaterCreate(9, SettingsComponent_For_10_Template, 2, 5, "option", 10, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(11, "div", 5)(12, "label", 11);
      \u0275\u0275i18n(13, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 7)(15, "div", 8)(16, "select", 12);
      \u0275\u0275listener("change", function SettingsComponent_Template_select_change_16_listener($event) {
        return ctx.changeLanguage($event);
      });
      \u0275\u0275repeaterCreate(17, SettingsComponent_For_18_Template, 2, 5, "option", 10, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275repeater(ctx.availableThemes);
      \u0275\u0275advance(8);
      \u0275\u0275repeater(ctx.availableLanguages);
    }
  }, dependencies: [ReactiveFormsModule, NgSelectOption, \u0275NgSelectMultipleOption], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SettingsComponent, [{
    type: Component,
    args: [{ selector: "app-settings", imports: [ReactiveFormsModule], template: '<div class="box">\n    <p class="title"\n       i18n>User settings</p>\n    <div class="field">\n        <label class="label"\n               for="theme"\n               i18n>Theme</label>\n        <div class="control">\n            <div class="select">\n                <select id="theme"\n                        (change)="changeTheme($event)">\n                    @for (theme of availableThemes; track theme) {\n                        <option [value]="theme.value"\n                                id="theme_{{ theme.value }}"\n                                [selected]="theme.value === currentTheme">\n                            {{ theme.name }}\n                        </option>\n                    }\n                </select>\n            </div>\n        </div>\n    </div>\n    <div class="field">\n        <label class="label"\n               for="language"\n               i18n>Language</label>\n        <div class="control">\n            <div class="select">\n                <select id="language"\n                        (change)="changeLanguage($event)">\n                    @for (language of availableLanguages; track language) {\n                        <option [value]="language.value"\n                                id="language_{{ language.value }}"\n                                [selected]="language.value === currentLanguage">\n                            {{ language.name }}\n                        </option>\n                    }\n                </select>\n            </div>\n        </div>\n    </div>\n</div>\n' }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "src/app/components/normal-component/settings/settings.component.ts", lineNumber: 14 });
})();
export {
  SettingsComponent
};
//# sourceMappingURL=settings.component-5KS6VZGW.js.map
