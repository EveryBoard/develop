import {
  BaseWrapperComponent
} from "./chunk-4VDPOI2Y.js";
import {
  RulesConfigDescriptionLocalizable
} from "./chunk-5WT7EBG4.js";
import {
  FaIconComponent,
  faCog
} from "./chunk-DTAE6QI4.js";
import {
  CheckboxControlValueAccessor,
  CheckboxRequiredValidator,
  DefaultValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  RequiredValidator,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-OJTN7ELL.js";
import {
  MGPOptional,
  Utils,
  comparableEquals
} from "./chunk-VWERQGBR.js";
import {
  NgClass
} from "./chunk-XUYKWQYA.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  input,
  model,
  output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵi18n,
  ɵɵinterpolate,
  ɵɵinterpolate1,
  ɵɵinterpolate2,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-YYRXZMOY.js";

// src/app/components/wrapper-components/rules-configuration/rules-configuration.component.ts
var _forTrack0 = ($index, $item) => $item.name();
var _forTrack1 = ($index, $item) => $item.enumValue;
function RulesConfigurationComponent_Conditional_0_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const standardConfig_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("config-dropdown-", standardConfig_r3.name()))("value", standardConfig_r3.name())("selected", ctx_r1.isSelectedConfig(standardConfig_r3.name()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", standardConfig_r3.name(), " ");
  }
}
function RulesConfigurationComponent_Conditional_0_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const errorMessage_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(errorMessage_r4);
  }
}
function RulesConfigurationComponent_Conditional_0_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275repeaterCreate(1, RulesConfigurationComponent_Conditional_0_Conditional_17_For_2_Template, 2, 1, "div", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.errorMessages);
  }
}
function RulesConfigurationComponent_Conditional_0_For_19_Case_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 18);
    \u0275\u0275element(1, "input", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const configParameter_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("", configParameter_r5, "_boolean_config_input"))("formControlName", configParameter_r5);
  }
}
function RulesConfigurationComponent_Conditional_0_For_19_Case_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 19);
  }
  if (rf & 2) {
    const configParameter_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("", configParameter_r5, "_number_config_input"))("placeholder", \u0275\u0275interpolate(ctx_r1.rulesConfigDescription.getFieldLocalizedName(configParameter_r5)))("formControlName", configParameter_r5)("ngClass", ctx_r1.isValid(configParameter_r5) === false ? "is-danger" : "");
  }
}
function RulesConfigurationComponent_Conditional_0_For_19_Case_10_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const value_r7 = ctx.$implicit;
    const configParameter_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", \u0275\u0275interpolate2("", configParameter_r5, "_value_", value_r7.enumValue))("selected", ctx_r1.isSelectedEnum(configParameter_r5, value_r7.enumValue))("value", value_r7.enumValue);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", value_r7.localized(), " ");
  }
}
function RulesConfigurationComponent_Conditional_0_For_19_Case_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 18)(1, "div", 7)(2, "select", 22);
    \u0275\u0275listener("change", function RulesConfigurationComponent_Conditional_0_For_19_Case_10_Template_select_change_2_listener($event) {
      \u0275\u0275restoreView(_r6);
      const configParameter_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEnumChange(configParameter_r5, $event));
    });
    \u0275\u0275repeaterCreate(3, RulesConfigurationComponent_Conditional_0_For_19_Case_10_For_4_Template, 2, 6, "option", 23, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const configParameter_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("", configParameter_r5, "_enum_config_input"))("disabled", ctx_r1.isEditableAndCustom() === false);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.getEnumValues(configParameter_r5));
  }
}
function RulesConfigurationComponent_Conditional_0_For_19_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const configParameter_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("", configParameter_r5, "-error"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.getErrorMessage(configParameter_r5));
  }
}
function RulesConfigurationComponent_Conditional_0_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "div", 16)(3, "label", 4);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 5)(6, "div", 17)(7, "div", 6);
    \u0275\u0275conditionalCreate(8, RulesConfigurationComponent_Conditional_0_For_19_Case_8_Template, 2, 3, "label", 18)(9, RulesConfigurationComponent_Conditional_0_For_19_Case_9_Template, 1, 6, "input", 19)(10, RulesConfigurationComponent_Conditional_0_For_19_Case_10_Template, 5, 3, "label", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, RulesConfigurationComponent_Conditional_0_For_19_Conditional_11_Template, 2, 3, "div", 20);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_13_0;
    const configParameter_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("", configParameter_r5, "_config"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.rulesConfigDescription.getFieldLocalizedName(configParameter_r5));
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_13_0 = ctx_r1.typeOfConfig(configParameter_r5)) === "boolean" ? 8 : tmp_13_0 === "number" ? 9 : tmp_13_0 === "string" ? 10 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.isValid(configParameter_r5) === false ? 11 : -1);
  }
}
function RulesConfigurationComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 2)(2, "div", 3)(3, "label", 4);
    \u0275\u0275i18n(4, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "select", 8);
    \u0275\u0275listener("change", function RulesConfigurationComponent_Conditional_0_Template_select_change_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onChange($event));
    });
    \u0275\u0275elementStart(9, "option", 9);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(11, RulesConfigurationComponent_Conditional_0_For_12_Template, 2, 5, "option", 9, _forTrack0);
    \u0275\u0275elementStart(13, "option", 10);
    \u0275\u0275i18n(14, 1);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(15, "form", 11)(16, "fieldset", 12);
    \u0275\u0275conditionalCreate(17, RulesConfigurationComponent_Conditional_0_Conditional_17_Template, 3, 0, "div", 13);
    \u0275\u0275repeaterCreate(18, RulesConfigurationComponent_Conditional_0_For_19_Template, 12, 5, "div", 14, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275property("disabled", ctx_r1.editable() === false);
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("config-dropdown-", ctx_r1.rulesConfigDescription.getDefaultConfig().name()))("value", ctx_r1.rulesConfigDescription.getDefaultConfig().name())("selected", ctx_r1.isSelectedConfig(ctx_r1.rulesConfigDescription.getDefaultConfig().name()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.rulesConfigDescription.getDefaultConfig().name(), " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.rulesConfigDescription.getNonDefaultStandardConfigs());
    \u0275\u0275advance(2);
    \u0275\u0275property("selected", ctx_r1.isSelectedConfig("Custom"));
    \u0275\u0275advance(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("", ctx_r1.getChosenConfigName(), "_values"))("formGroup", ctx_r1.rulesConfigForm);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.errorMessages.length > 0 ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.getFields());
  }
}
var RulesConfigurationComponent = class _RulesConfigurationComponent extends BaseWrapperComponent {
  rulesConfigDescriptionOptional = input.required(...ngDevMode ? [{ debugName: "rulesConfigDescriptionOptional" }] : []);
  rulesConfigDescription;
  // Only needed for the non-creator
  rulesConfigToDisplay = input(...ngDevMode ? [void 0, { debugName: "rulesConfigToDisplay" }] : []);
  // Whether this config can be edited or not
  editable = model(false, ...ngDevMode ? [{ debugName: "editable" }] : []);
  /**
   * notify that the config has been updated
   * if the optional is empty, the last update was invalid
   * we do want to emit something when the current config is invalid,
   * so that the parent component knows that the situation is not ok
   */
  updateCallback = output();
  rulesConfigForm = new FormGroup({});
  urlName;
  // set in onInit
  chosenConfigName = "";
  errorMessages = [];
  checkInputs() {
    if (this.editable() === false) {
      Utils.assert(this.rulesConfigToDisplay() !== void 0, "Config should be provided if RulesConfigurationComponent is not editable");
    }
  }
  getChosenConfigName() {
    return this.chosenConfigName;
  }
  ngOnInit() {
    this.checkInputs();
    this.urlName = this.getGameUrlName();
    if (this.isCustomisable()) {
      const defaultConfig = this.rulesConfigDescription.getDefaultConfig();
      this.setChosenConfig(defaultConfig.name());
    } else {
      return this.updateCallback.emit(MGPOptional.of({}));
    }
  }
  generateForm(config, configurable) {
    const group = {};
    Object.keys(config).forEach((parameterName) => {
      const value = this.getRulesConfigDescriptionValue(parameterName, config[parameterName]);
      group[parameterName] = this.getFormControl(value, configurable);
    });
    this.rulesConfigForm = new FormGroup(group);
  }
  getRulesConfigDescriptionValue(name, defaultValue) {
    if (this.editable()) {
      return defaultValue;
    } else {
      const configuration = Utils.getNonNullable(this.rulesConfigToDisplay());
      return configuration[name];
    }
  }
  getFormControl(value, configurable) {
    const formControl = new FormControl(value);
    if (configurable === false) {
      formControl.disable();
    }
    formControl.valueChanges.subscribe(() => {
      this.onUpdate();
    });
    return formControl;
  }
  isEditableAndCustom() {
    return this.editable() && this.chosenConfigName === "Custom";
  }
  onUpdate() {
    const rulesConfig = {};
    const fieldNames = this.rulesConfigDescription.getFields();
    for (const field of fieldNames) {
      if (this.isValid(field)) {
        rulesConfig[field] = this.rulesConfigForm.controls[field].value;
      } else {
        this.updateCallback.emit(MGPOptional.empty());
        return;
      }
    }
    return this.checkForValidators(rulesConfig);
  }
  checkForValidators(rulesConfig) {
    const validators = this.rulesConfigDescription.defaultConfigDescription.validators ?? [];
    this.errorMessages = [];
    for (const validator of validators) {
      const validation = validator(rulesConfig);
      if (validation.isFailure()) {
        this.errorMessages.push(validation.getReason());
      }
    }
    if (this.errorMessages.length > 0) {
      this.updateCallback.emit(MGPOptional.empty());
    } else {
      this.updateCallback.emit(MGPOptional.of(rulesConfig));
    }
  }
  typeOfConfig(field) {
    const config = this.rulesConfigDescription.getDefaultConfig().config;
    const value = config[field];
    return typeof value;
  }
  isValid(field) {
    return this.rulesConfigDescription.isValid(field, this.rulesConfigForm.controls[field].value);
  }
  getErrorMessage(field) {
    const fieldValue = this.rulesConfigForm.controls[field].value;
    return this.rulesConfigDescription.getValidityError(field, fieldValue);
  }
  getFields() {
    return this.rulesConfigDescription.getFields();
  }
  onChange(event) {
    const select = event.target;
    this.setChosenConfig(select.value);
  }
  getEnumValues(field) {
    const defaultConfig = this.rulesConfigDescription.defaultConfigDescription;
    const config = defaultConfig.config[field];
    return Object.keys(config.possibleValues).map((key) => {
      return {
        enumValue: key,
        localized: config.possibleValues[key]
      };
    });
  }
  isSelectedEnum(configParameter, enumValue) {
    return enumValue === this.rulesConfigForm.controls[configParameter].getRawValue();
  }
  onEnumChange(field, event) {
    const select = event.target;
    this.rulesConfigForm.controls[field].setValue(select.value);
  }
  setChosenConfig(configName) {
    this.chosenConfigName = configName;
    if (this.chosenConfigName === "Custom") {
      const defaultConfig = this.rulesConfigDescription.getDefaultConfig().config;
      this.generateForm(defaultConfig, this.editable());
    } else {
      const chosenConfig = this.rulesConfigDescription.getConfig(this.chosenConfigName);
      this.generateForm(chosenConfig, false);
      this.updateCallback.emit(MGPOptional.of(chosenConfig));
    }
  }
  isCustomisable() {
    if (this.rulesConfigDescriptionOptional().isAbsent()) {
      return false;
    } else {
      Utils.assert(this.rulesConfigDescriptionOptional().get().getFields().length > 0, "If rulesConfigDescriptionOptional is present it should have fields !");
      this.rulesConfigDescription = this.rulesConfigDescriptionOptional().get();
      return true;
    }
  }
  setEditable(editable) {
    this.editable.set(editable);
    if (this.editable() && this.chosenConfigName === "Custom") {
      this.rulesConfigForm.enable();
    } else {
      this.rulesConfigForm.disable();
    }
  }
  isSelectedConfig(configName) {
    if (this.rulesConfigToDisplay() == null) {
      return this.chosenConfigName === configName;
    } else {
      const defactoConfigName = this.getDefactoConfigName();
      return defactoConfigName === configName;
    }
  }
  /*
   * Checks the config parameter values.
   * If it matches an existing configuration, returns its name.
   * Otherwise, returns the custom config name ("Custom")
   */
  getDefactoConfigName() {
    const currentConfig = this.rulesConfigToDisplay();
    const defaultConfigs = this.rulesConfigDescription.getStandardConfigs();
    const matchingConfigs = defaultConfigs.filter((nameConfig) => {
      return comparableEquals(nameConfig.config, currentConfig);
    });
    if (matchingConfigs.length === 1) {
      return matchingConfigs[0].name();
    } else {
      return RulesConfigDescriptionLocalizable.CUSTOM();
    }
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275RulesConfigurationComponent_BaseFactory;
    return function RulesConfigurationComponent_Factory(__ngFactoryType__) {
      return (\u0275RulesConfigurationComponent_BaseFactory || (\u0275RulesConfigurationComponent_BaseFactory = \u0275\u0275getInheritedFactory(_RulesConfigurationComponent)))(__ngFactoryType__ || _RulesConfigurationComponent);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RulesConfigurationComponent, selectors: [["app-rules-configuration"]], inputs: { rulesConfigDescriptionOptional: [1, "rulesConfigDescriptionOptional"], rulesConfigToDisplay: [1, "rulesConfigToDisplay"], editable: [1, "editable"] }, outputs: { editable: "editableChange", updateCallback: "updateCallback" }, features: [\u0275\u0275InheritDefinitionFeature], decls: 1, vars: 1, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_3008420115644088420$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_RULES_CONFIGURATION_RULES_CONFIGURATION_COMPONENT_TS_0 = goog.getMsg("Configuration");
      i18n_0 = MSG_EXTERNAL_3008420115644088420$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_RULES_CONFIGURATION_RULES_CONFIGURATION_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Configuration`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_7590013429208346303$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_RULES_CONFIGURATION_RULES_CONFIGURATION_COMPONENT_TS_1 = goog.getMsg("Custom");
      i18n_1 = MSG_EXTERNAL_7590013429208346303$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_RULES_CONFIGURATION_RULES_CONFIGURATION_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Custom`;
    }
    return [i18n_0, i18n_1, [1, "field", "columns", "is-gapless", "mb-0"], [1, "field-label", "column"], [1, "label", "has-text-left"], [1, "field-body", "column", "has-text-right"], [1, "control"], [1, "select", "is-primary", "is-fullwidth"], ["id", "ruleSelect", 3, "change", "disabled"], [3, "id", "value", "selected"], ["value", "Custom", "id", "config-dropdown-custom", 3, "selected"], [1, "mt-2", 3, "formGroup", "id"], [1, "left-border"], ["id", "form-error", "role", "alert", 1, "help", "is-danger"], [1, "mb-2", 3, "id"], [1, "field", "is-horizontal", "columns", "is-gapless"], [1, "field-label", "column", "is-three-quarters"], [1, "field", "is-narrow"], [1, "checkbox"], ["type", "number", "required", "", 1, "input", "is-small", 3, "id", "formControlName", "ngClass", "placeholder"], ["role", "alert", 1, "help", "is-danger", 3, "id"], ["type", "checkbox", "required", "", 1, "checkbox", 3, "id", "formControlName"], [3, "change", "id", "disabled"], [3, "id", "selected", "value"]];
  }, template: function RulesConfigurationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, RulesConfigurationComponent_Conditional_0_Template, 20, 11, "div");
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isCustomisable() ? 0 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, CheckboxRequiredValidator, FormGroupDirective, FormControlName, NgClass], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RulesConfigurationComponent, [{
    type: Component,
    args: [{ selector: "app-rules-configuration", changeDetection: ChangeDetectionStrategy.OnPush, imports: [ReactiveFormsModule, NgClass], template: `@if (isCustomisable()) {
    <div>
        <div class="field columns is-gapless mb-0">
            <div class="field-label column">
                <label class="label has-text-left"
                       i18n>Configuration</label>
            </div>
            <div class="field-body column has-text-right">
                <div class="control">
                    <div class="select is-primary is-fullwidth">
                        <select id="ruleSelect"
                                [disabled]="editable() === false"
                                (change)="onChange($event)">
                            <option id="config-dropdown-{{ rulesConfigDescription.getDefaultConfig().name() }}"
                                    [value]="rulesConfigDescription.getDefaultConfig().name()"
                                    [selected]="isSelectedConfig(rulesConfigDescription.getDefaultConfig().name())">
                                {{ rulesConfigDescription.getDefaultConfig().name() }}
                            </option>
                            @for (standardConfig of rulesConfigDescription.getNonDefaultStandardConfigs(); track standardConfig.name()) {
                                <option id="config-dropdown-{{ standardConfig.name() }}"
                                        [value]="standardConfig.name()"
                                        [selected]="isSelectedConfig(standardConfig.name())">
                                    {{ standardConfig.name() }}
                                </option>
                            }
                            <option value="Custom"
                                    id="config-dropdown-custom"
                                    [selected]="isSelectedConfig('Custom')"
                                    i18n>Custom</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <form [formGroup]="rulesConfigForm"
              class="mt-2"
              id="{{ getChosenConfigName() }}_values">
            <fieldset class="left-border">
                @if (errorMessages.length > 0) {
                    <div id="form-error"
                         class="help is-danger"
                         role="alert">
                        @for (errorMessage of errorMessages; track errorMessage) {
                            <div>{{ errorMessage }}</div>
                        }
                    </div>
                }
                @for (configParameter of getFields(); track configParameter) {
                    <div id="{{ configParameter }}_config"
                         class="mb-2">
                        <div class="field is-horizontal columns is-gapless">
                            <div class="field-label column is-three-quarters">
                                <label class="label has-text-left">{{ rulesConfigDescription.getFieldLocalizedName(configParameter) }}</label>
                            </div>
                            <div class="field-body column has-text-right">
                                <div class="field is-narrow">
                                    <div class="control">
                                        @switch (typeOfConfig(configParameter)) {
                                            @case ('boolean') {
                                                <label class="checkbox">
                                                    <input id="{{ configParameter }}_boolean_config_input"
                                                           [formControlName]="configParameter"
                                                           type="checkbox"
                                                           class="checkbox"
                                                           required/>
                                                </label>
                                            }
                                            @case ('number') {
                                                <input id="{{ configParameter }}_number_config_input"
                                                       [formControlName]="configParameter"
                                                       type="number"
                                                       class="input is-small"
                                                       [ngClass]="isValid(configParameter) === false ? 'is-danger' : ''"
                                                       required
                                                       placeholder="{{ rulesConfigDescription.getFieldLocalizedName(configParameter) }}"/>
                                            }
                                            @case ('string') {
                                                <label class="checkbox">
                                                    <div class="select is-primary is-fullwidth">
                                                        <select id="{{ configParameter }}_enum_config_input"
                                                                [disabled]="isEditableAndCustom() === false"
                                                                (change)="onEnumChange(configParameter, $event)">
                                                            @for (value of getEnumValues(configParameter); track value.enumValue) {
                                                                <option id="{{ configParameter }}_value_{{ value.enumValue }}"
                                                                        [selected]="isSelectedEnum(configParameter, value.enumValue)"
                                                                        [value]="value.enumValue">
                                                                    {{ value.localized() }}
                                                                </option>
                                                            }
                                                        </select>
                                                    </div>
                                                </label>
                                            }
                                        }
                                    </div>
                                    @if (isValid(configParameter) === false) {
                                        <div id="{{configParameter}}-error"
                                             class="help is-danger"
                                             role="alert">{{ getErrorMessage(configParameter) }}</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </fieldset>
        </form>
    </div>
}
` }]
  }], null, { rulesConfigDescriptionOptional: [{ type: Input, args: [{ isSignal: true, alias: "rulesConfigDescriptionOptional", required: true }] }], rulesConfigToDisplay: [{ type: Input, args: [{ isSignal: true, alias: "rulesConfigToDisplay", required: false }] }], editable: [{ type: Input, args: [{ isSignal: true, alias: "editable", required: false }] }, { type: Output, args: ["editableChange"] }], updateCallback: [{ type: Output, args: ["updateCallback"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RulesConfigurationComponent, { className: "RulesConfigurationComponent", filePath: "src/app/components/wrapper-components/rules-configuration/rules-configuration.component.ts", lineNumber: 23 });
})();

// src/app/components/normal-component/view-config/view-config.component.ts
function ViewConfigComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 4);
    \u0275\u0275listener("click", function ViewConfigComponent_Conditional_0_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeConfig());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 5)(3, "header", 6)(4, "p", 7);
    \u0275\u0275i18n(5, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 8);
    \u0275\u0275listener("click", function ViewConfigComponent_Conditional_0_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeConfig());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "section", 9);
    \u0275\u0275element(8, "app-rules-configuration", 10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275property("rulesConfigDescriptionOptional", ctx_r1.rulesConfigDescription())("rulesConfigToDisplay", ctx_r1.rulesConfig().get())("editable", false);
  }
}
function ViewConfigComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 11);
    \u0275\u0275listener("click", function ViewConfigComponent_Conditional_3_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openConfig());
    });
    \u0275\u0275element(1, "fa-icon", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r1.faCog);
  }
}
var ViewConfigComponent = class _ViewConfigComponent {
  rulesConfig = input.required(...ngDevMode ? [{ debugName: "rulesConfig" }] : []);
  rulesConfigDescription = input.required(...ngDevMode ? [{ debugName: "rulesConfigDescription" }] : []);
  gameName = input.required(...ngDevMode ? [{ debugName: "gameName" }] : []);
  faCog = faCog;
  viewConfig = false;
  openConfig() {
    this.viewConfig = true;
  }
  closeConfig() {
    this.viewConfig = false;
  }
  static \u0275fac = function ViewConfigComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ViewConfigComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ViewConfigComponent, selectors: [["app-view-config"]], inputs: { rulesConfig: [1, "rulesConfig"], rulesConfigDescription: [1, "rulesConfigDescription"], gameName: [1, "gameName"] }, decls: 4, vars: 3, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_1781858426685447922$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VIEW_CONFIG_VIEW_CONFIG_COMPONENT_TS_0 = goog.getMsg("View configuration");
      i18n_0 = MSG_EXTERNAL_1781858426685447922$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VIEW_CONFIG_VIEW_CONFIG_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`View configuration`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_4780631467843839550$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VIEW_CONFIG_VIEW_CONFIG_COMPONENT_TS_1 = goog.getMsg("Rules configuration");
      i18n_1 = MSG_EXTERNAL_4780631467843839550$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VIEW_CONFIG_VIEW_CONFIG_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Rules configuration`;
    }
    return [i18n_1, ["id", "config-modal", 1, "modal", "is-active"], [1, "title"], ["id", "show-config", "data-tooltip", i18n_0, 1, "primary-fg"], ["id", "close-config", 1, "modal-background", 3, "click"], [1, "modal-card"], [1, "modal-card-head", "is-primary"], [1, "modal-card-title"], ["aria-label", "close", 1, "delete", 3, "click"], [1, "modal-card-body"], ["id", "rules-config-component", 3, "rulesConfigDescriptionOptional", "rulesConfigToDisplay", "editable"], ["id", "show-config", "data-tooltip", i18n_0, 1, "primary-fg", 3, "click"], [3, "icon"]];
  }, template: function ViewConfigComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ViewConfigComponent_Conditional_0_Template, 9, 3, "div", 1);
      \u0275\u0275elementStart(1, "p", 2);
      \u0275\u0275text(2);
      \u0275\u0275conditionalCreate(3, ViewConfigComponent_Conditional_3_Template, 2, 1, "a", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.viewConfig ? 0 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.gameName(), " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.rulesConfig().isPresent() ? 3 : -1);
    }
  }, dependencies: [RulesConfigurationComponent, FaIconComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ViewConfigComponent, [{
    type: Component,
    args: [{ selector: "app-view-config", imports: [RulesConfigurationComponent, FaIconComponent], template: '@if (viewConfig) {\n    <div id="config-modal"\n         class="modal is-active">\n        <div id="close-config"\n             class="modal-background"\n             (click)="closeConfig()"></div>\n        <div class="modal-card">\n            <header class="modal-card-head is-primary">\n                <p class="modal-card-title"\n                   i18n>Rules configuration</p>\n                <button class="delete"\n                        aria-label="close"\n                        (click)="closeConfig()"></button>\n            </header>\n            <section class="modal-card-body">\n                <app-rules-configuration id="rules-config-component"\n                                         [rulesConfigDescriptionOptional]="rulesConfigDescription()"\n                                         [rulesConfigToDisplay]="rulesConfig().get()"\n                                         [editable]="false">\n                </app-rules-configuration>\n            </section>\n        </div>\n    </div>\n}\n<p class="title">\n    {{ gameName() }}\n    @if (rulesConfig().isPresent()) {\n        <a id="show-config"\n           (click)="openConfig()"\n           class="primary-fg"\n           i18n-data-tooltip\n           data-tooltip="View configuration"><fa-icon [icon]="faCog"></fa-icon></a>\n    }\n</p>\n' }]
  }], null, { rulesConfig: [{ type: Input, args: [{ isSignal: true, alias: "rulesConfig", required: true }] }], rulesConfigDescription: [{ type: Input, args: [{ isSignal: true, alias: "rulesConfigDescription", required: true }] }], gameName: [{ type: Input, args: [{ isSignal: true, alias: "gameName", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ViewConfigComponent, { className: "ViewConfigComponent", filePath: "src/app/components/normal-component/view-config/view-config.component.ts", lineNumber: 16 });
})();

export {
  RulesConfigurationComponent,
  ViewConfigComponent
};
//# sourceMappingURL=chunk-CGJWMBI7.js.map
