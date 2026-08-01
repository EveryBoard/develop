import {
  TutorialGameWrapperMessages
} from "./chunk-F7TXPG54.js";
import {
  GameWrapper
} from "./chunk-RCK4B5LT.js";
import {
  PlayerOrNone
} from "./chunk-RF4KHUBP.js";
import {
  MGPValidation,
  Utils
} from "./chunk-KTC3UZQD.js";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  __async,
  inject,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵgetInheritedFactory
} from "./chunk-AC6ULWDE.js";

// src/app/components/wrapper-components/demo-card-wrapper/demo-card-wrapper.component.ts
var DemoCardWrapperComponent = class _DemoCardWrapperComponent extends GameWrapper {
  cdr = inject(ChangeDetectorRef);
  elementRef = inject(ElementRef);
  demoNodeInfo = input.required(...ngDevMode ? [{ debugName: "demoNodeInfo" }] : []);
  gameComponentIsSetup = false;
  ngAfterViewInit() {
    return __async(this, null, function* () {
      setTimeout(() => __async(this, null, function* () {
        yield this.createMatchingGameComponent();
        this.gameComponent.node = this.demoNodeInfo().node;
        yield this.setInteractive(true);
        yield this.setRole(this.gameComponent.getCurrentPlayer());
        this.cdr.detectChanges();
        const demoNodeInfo = this.demoNodeInfo();
        if (demoNodeInfo.click.isPresent()) {
          const clickSelector = demoNodeInfo.click.get();
          const element = Utils.getNonNullable(this.elementRef.nativeElement.querySelector(clickSelector));
          element.dispatchEvent(new Event("click"));
          this.cdr.detectChanges();
        }
        this.gameComponentIsSetup = true;
        yield this.setRole(PlayerOrNone.NONE);
      }), 1);
    });
  }
  ngOnChanges(_changes) {
    return __async(this, null, function* () {
      if (this.gameComponent != null) {
        this.gameComponent.node = this.demoNodeInfo().node;
        yield this.gameComponent.updateBoardAndRedraw(false);
      }
    });
  }
  getGameUrlName() {
    return this.demoNodeInfo().name;
  }
  onLegalUserMove(_move, _scores) {
    return __async(this, null, function* () {
      Utils.assert(false, "DemoCardWrapper should not call applyLegalMove, as it does no move");
    });
  }
  getPlayer() {
    return "no-player";
  }
  canUserPlay(_clickedElementName) {
    return __async(this, null, function* () {
      if (this.gameComponentIsSetup) {
        return MGPValidation.failure(TutorialGameWrapperMessages.THIS_IS_A_DEMO());
      } else {
        return MGPValidation.SUCCESS;
      }
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275DemoCardWrapperComponent_BaseFactory;
    return function DemoCardWrapperComponent_Factory(__ngFactoryType__) {
      return (\u0275DemoCardWrapperComponent_BaseFactory || (\u0275DemoCardWrapperComponent_BaseFactory = \u0275\u0275getInheritedFactory(_DemoCardWrapperComponent)))(__ngFactoryType__ || _DemoCardWrapperComponent);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DemoCardWrapperComponent, selectors: [["app-demo-card"]], inputs: { demoNodeInfo: [1, "demoNodeInfo"] }, features: [\u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature], decls: 3, vars: 0, consts: [["board", ""], [1, "is-fullheight"]], template: function DemoCardWrapperComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 1);
      \u0275\u0275domElement(1, "div", null, 0);
      \u0275\u0275domElementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DemoCardWrapperComponent, [{
    type: Component,
    args: [{
      selector: "app-demo-card",
      template: `<div class="is-fullheight"><div #board></div></div>`
    }]
  }], null, { demoNodeInfo: [{ type: Input, args: [{ isSignal: true, alias: "demoNodeInfo", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DemoCardWrapperComponent, { className: "DemoCardWrapperComponent", filePath: "src/app/components/wrapper-components/demo-card-wrapper/demo-card-wrapper.component.ts", lineNumber: 27 });
})();

export {
  DemoCardWrapperComponent
};
//# sourceMappingURL=chunk-HZDSVAMR.js.map
