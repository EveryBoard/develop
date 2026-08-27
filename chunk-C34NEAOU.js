import {
  ViewConfigComponent
} from "./chunk-R2CO53FA.js";
import {
  GameWrapper
} from "./chunk-YDP6VHNV.js";
import {
  GameNode,
  Move
} from "./chunk-6LVSLROB.js";
import {
  Debug
} from "./chunk-Y4TVVAIH.js";
import {
  NgSelectOption,
  ReactiveFormsModule,
  ɵNgSelectMultipleOption
} from "./chunk-CIU2KL3F.js";
import {
  MGPOptional,
  MGPValidation,
  Utils
} from "./chunk-KI3WLQMB.js";
import {
  NgClass
} from "./chunk-6LTRXF6Y.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  __async,
  __superGet,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵi18n,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate3
} from "./chunk-XHN637UA.js";

// src/app/components/wrapper-components/tutorial-game-wrapper/TutorialFailure.ts
var TutorialFailure = class {
  static STEP_FINISHED = () => $localize`Step finished!`;
  static INFORMATIONAL_STEP = () => $localize`This step is not expecting any move from your part.`;
};

// src/app/components/wrapper-components/tutorial-game-wrapper/tutorial-game-wrapper.component.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function TutorialGameWrapperComponent_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 31);
    \u0275\u0275i18n(2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "div", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("innerHTML", ctx_r1.currentReason.get(), \u0275\u0275sanitizeHtml);
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function TutorialGameWrapperComponent_Conditional_2_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.retry());
    });
    \u0275\u0275i18n(1, 2);
    \u0275\u0275elementEnd();
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 3);
    \u0275\u0275elementContainerEnd();
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_10_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 4);
    \u0275\u0275elementContainerEnd();
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_10_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 5);
    \u0275\u0275elementContainerEnd();
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TutorialGameWrapperComponent_Conditional_2_Conditional_10_Conditional_2_Conditional_0_Template, 2, 0, "ng-container")(1, TutorialGameWrapperComponent_Conditional_2_Conditional_10_Conditional_2_Conditional_1_Template, 2, 0, "ng-container");
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.stepFinished && ctx_r1.stepFinished[ctx_r1.stepIndex] ? 0 : 1);
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function TutorialGameWrapperComponent_Conditional_2_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.next());
    });
    \u0275\u0275conditionalCreate(1, TutorialGameWrapperComponent_Conditional_2_Conditional_10_Conditional_1_Template, 2, 0, "ng-container")(2, TutorialGameWrapperComponent_Conditional_2_Conditional_10_Conditional_2_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.steps[ctx_r1.stepIndex] && ctx_r1.steps[ctx_r1.stepIndex].isInformation() ? 1 : 2);
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function TutorialGameWrapperComponent_Conditional_2_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.start());
    });
    \u0275\u0275i18n(1, 6);
    \u0275\u0275elementEnd();
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function TutorialGameWrapperComponent_Conditional_2_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.playLocally());
    });
    \u0275\u0275i18n(1, 7);
    \u0275\u0275elementEnd();
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275listener("click", function TutorialGameWrapperComponent_Conditional_2_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.createGame());
    });
    \u0275\u0275i18n(1, 8);
    \u0275\u0275elementEnd();
  }
}
function TutorialGameWrapperComponent_Conditional_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function TutorialGameWrapperComponent_Conditional_2_Conditional_14_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showSolution());
    });
    \u0275\u0275i18n(1, 9);
    \u0275\u0275elementEnd();
  }
}
function TutorialGameWrapperComponent_Conditional_2_For_18_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext();
    const step_r10 = ctx_r8.$implicit;
    const \u0275$index_78_r11 = ctx_r8.$index;
    \u0275\u0275property("id", \u0275\u0275interpolate1("step_", \u0275$index_78_r11))("value", \u0275$index_78_r11);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(step_r10.title);
  }
}
function TutorialGameWrapperComponent_Conditional_2_For_18_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " v ");
  }
}
function TutorialGameWrapperComponent_Conditional_2_For_18_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " x ");
  }
}
function TutorialGameWrapperComponent_Conditional_2_For_18_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 40);
    \u0275\u0275conditionalCreate(1, TutorialGameWrapperComponent_Conditional_2_For_18_Conditional_1_Conditional_1_Template, 1, 0)(2, TutorialGameWrapperComponent_Conditional_2_For_18_Conditional_1_Conditional_2_Template, 1, 0);
    \u0275\u0275elementStart(3, "span", 41);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext();
    const step_r10 = ctx_r8.$implicit;
    const \u0275$index_78_r11 = ctx_r8.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", \u0275$index_78_r11);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.stepFinished[\u0275$index_78_r11] ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("step_", \u0275$index_78_r11));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(step_r10.title);
  }
}
function TutorialGameWrapperComponent_Conditional_2_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TutorialGameWrapperComponent_Conditional_2_For_18_Conditional_0_Template, 2, 4, "option", 39)(1, TutorialGameWrapperComponent_Conditional_2_For_18_Conditional_1_Template, 5, 5, "option", 40);
  }
  if (rf & 2) {
    const \u0275$index_78_r11 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(\u0275$index_78_r11 === ctx_r1.stepIndex ? 0 : 1);
  }
}
function TutorialGameWrapperComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "app-view-config", 16)(2, "progress", 17);
    \u0275\u0275elementStart(3, "div", 18)(4, "p", 19);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "p", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, TutorialGameWrapperComponent_Conditional_2_Conditional_7_Template, 4, 1, "div", 21);
    \u0275\u0275elementStart(8, "div", 22);
    \u0275\u0275conditionalCreate(9, TutorialGameWrapperComponent_Conditional_2_Conditional_9_Template, 2, 0, "button", 23);
    \u0275\u0275conditionalCreate(10, TutorialGameWrapperComponent_Conditional_2_Conditional_10_Template, 3, 1, "button", 24);
    \u0275\u0275conditionalCreate(11, TutorialGameWrapperComponent_Conditional_2_Conditional_11_Template, 2, 0, "button", 25);
    \u0275\u0275conditionalCreate(12, TutorialGameWrapperComponent_Conditional_2_Conditional_12_Template, 2, 0, "button", 26);
    \u0275\u0275conditionalCreate(13, TutorialGameWrapperComponent_Conditional_2_Conditional_13_Template, 2, 0, "button", 27);
    \u0275\u0275conditionalCreate(14, TutorialGameWrapperComponent_Conditional_2_Conditional_14_Template, 2, 0, "button", 28);
    \u0275\u0275elementStart(15, "div", 29)(16, "select", 30);
    \u0275\u0275listener("change", function TutorialGameWrapperComponent_Conditional_2_Template_select_change_16_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.changeStep($event));
    });
    \u0275\u0275repeaterCreate(17, TutorialGameWrapperComponent_Conditional_2_For_18_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rulesConfig", ctx_r1.getConfig())("rulesConfigDescription", ctx_r1.getRulesConfigDescription())("gameName", ctx_r1.getGameName().getOrElse(""));
    \u0275\u0275advance();
    \u0275\u0275attribute("value", ctx_r1.successfulSteps)("max", ctx_r1.getNumberOfSteps());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3("", ctx_r1.getCurrentStepTitle(), " [", ctx_r1.stepIndex + 1, "/", ctx_r1.getNumberOfSteps(), "]");
    \u0275\u0275advance();
    \u0275\u0275property("innerHTML", ctx_r1.currentMessage, \u0275\u0275sanitizeHtml);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.currentReason.isPresent() ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.tutorialOver === false && (ctx_r1.stepFinished && ctx_r1.stepFinished[ctx_r1.stepIndex] || ctx_r1.moveAttemptMade) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.tutorialOver === false ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.tutorialOver ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.tutorialOver ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.tutorialOver ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.moveAttemptMade && ctx_r1.stepFinished[ctx_r1.stepIndex] === false ? 14 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.steps);
  }
}
var TutorialGameWrapperMessages = class {
  static COMPLETED_TUTORIAL_MESSAGE = () => $localize`Congratulations, you completed the tutorial.`;
  static THIS_IS_A_DEMO = () => $localize`You cannot click, this is a demo.`;
};
var TutorialGameWrapperComponent = class TutorialGameWrapperComponent2 extends GameWrapper {
  cdr = inject(ChangeDetectorRef);
  steps = [];
  successfulSteps = 0;
  stepIndex = 0;
  currentMessage = "";
  // Initially empty, will always be set once tutorial has started
  currentReason = MGPOptional.empty();
  moveAttemptMade = false;
  stepFinished = [];
  tutorialOver = false;
  canUserPlay(elementName) {
    return __async(this, null, function* () {
      this.currentReason = MGPOptional.empty();
      if (this.stepFinished[this.stepIndex] || this.moveAttemptMade) {
        return MGPValidation.failure(TutorialFailure.STEP_FINISHED());
      }
      const currentStep = this.steps[this.stepIndex];
      if (currentStep.isClick()) {
        this.gameComponent.hideLastMove();
        this.moveAttemptMade = true;
        if (Utils.getNonNullable(currentStep.acceptedClicks).some((m) => m === elementName)) {
          this.showStepSuccess(currentStep.getSuccessMessage());
        } else {
          this.currentMessage = currentStep.getFailureMessage();
        }
        return MGPValidation.SUCCESS;
      } else if (currentStep.isMove() || currentStep.isPredicate() || currentStep.isAnyMove()) {
        this.gameComponent.hideLastMove();
        return MGPValidation.SUCCESS;
      } else {
        return MGPValidation.failure(TutorialFailure.INFORMATIONAL_STEP());
      }
    });
  }
  onCancelMove(reason) {
    return __async(this, null, function* () {
      yield __superGet(TutorialGameWrapperComponent2.prototype, this, "onCancelMove").call(this, reason);
      if (reason !== void 0) {
        this.currentReason = MGPOptional.of(reason);
      }
      this.cdr.detectChanges();
    });
  }
  onLegalUserMove(move) {
    return __async(this, null, function* () {
      const currentStep = this.steps[this.stepIndex];
      const config = this.getConfig();
      const currentNode = this.gameComponent.node();
      const newNode = this.gameComponent.rules.choose(currentNode, move, config);
      Utils.assert(newNode.isSuccess(), "It should be impossible to call onLegalUserMove with an illegal move, but got " + newNode.getReasonOr(""));
      this.gameComponent.node.set(newNode.get());
      yield this.showNewMove(false);
      this.moveAttemptMade = true;
      if (currentStep.isPredicate()) {
        const previousState = this.gameComponent.getPreviousState();
        const resultingState = this.gameComponent.getState();
        const moveValidity = Utils.getNonNullable(currentStep.predicate)(move, previousState, resultingState);
        if (moveValidity.isSuccess()) {
          this.showStepSuccess(currentStep.getSuccessMessage());
        } else {
          this.currentReason = MGPOptional.of(moveValidity.getReason());
        }
      } else if (currentStep.isAnyMove()) {
        Debug.display("TutorialGameWrapperComponent", "onLegalUserMove", "awaited move!");
        this.showStepSuccess(currentStep.getSuccessMessage());
      } else if (currentStep.isMove()) {
        const currentStepMove = currentStep;
        if (currentStepMove.acceptedMoves.some((m) => m.equals(move))) {
          Debug.display("TutorialGameWrapperComponent", "onLegalUserMove", "awaited move!");
          this.showStepSuccess(currentStepMove.getSuccessMessage());
        } else {
          Debug.display("TutorialGameWrapperComponent", "onLegalUserMove", "not the move that was awaited.");
          this.currentReason = MGPOptional.of(currentStepMove.getFailureMessage());
        }
      } else {
        Utils.assert(currentStep.isClick(), "Here, we should have a click");
      }
      yield this.setInteractive(false);
      this.cdr.detectChanges();
    });
  }
  getPlayer() {
    return "tutorial-player";
  }
  ngAfterViewInit() {
    return __async(this, null, function* () {
      const createdSuccessfully = yield this.createMatchingGameComponent();
      if (createdSuccessfully) {
        yield this.start();
      }
    });
  }
  getNumberOfSteps() {
    return this.steps.length;
  }
  getCurrentStepTitle() {
    Utils.assert(this.steps.length > 0, "Tutorial has no step");
    return this.steps[this.stepIndex].title;
  }
  start() {
    return __async(this, null, function* () {
      const tutorial = this.gameComponent.tutorial;
      yield this.startTutorial(tutorial);
    });
  }
  startTutorial(tutorial) {
    return __async(this, null, function* () {
      this.steps = tutorial;
      this.tutorialOver = false;
      this.stepFinished = this.getCompletionArray();
      this.successfulSteps = 0;
      yield this.showStep(0);
    });
  }
  getCompletionArray() {
    return this.steps.map(() => {
      return false;
    });
  }
  changeStep(event) {
    return __async(this, null, function* () {
      const target = event.target;
      yield this.showStep(Number.parseInt(target.value, 10));
    });
  }
  showStep(stepIndex) {
    return __async(this, null, function* () {
      this.moveAttemptMade = false;
      this.stepFinished[stepIndex] = false;
      this.updateSuccessCount();
      this.stepIndex = stepIndex;
      const currentStep = this.steps[this.stepIndex];
      this.currentMessage = currentStep.instruction;
      this.currentReason = MGPOptional.empty();
      const state = currentStep.state;
      const node = new GameNode(state, currentStep.parent, currentStep.previousMove);
      this.gameComponent.node.set(node);
      const defaultConfig = this.gameComponent.rules.getDefaultRulesConfig();
      this.gameComponent.setConfig(currentStep.config.getOrElse(defaultConfig));
      yield this.setRole(this.gameComponent.getCurrentPlayer());
      yield this.setInteractive(currentStep.isInformation() === false);
      this.cdr.detectChanges();
    });
  }
  retry() {
    return __async(this, null, function* () {
      this.moveAttemptMade = false;
      yield this.showStep(this.stepIndex);
    });
  }
  showStepSuccess(successMessage) {
    this.currentMessage = successMessage;
    this.stepFinished[this.stepIndex] = true;
    this.updateSuccessCount();
  }
  updateSuccessCount() {
    let count = 0;
    for (const stepSuccess of this.stepFinished) {
      if (stepSuccess) {
        count++;
      }
    }
    this.successfulSteps = count;
  }
  next() {
    return __async(this, null, function* () {
      if (this.steps[this.stepIndex].isInformation()) {
        this.stepFinished[this.stepIndex] = true;
        this.updateSuccessCount();
      }
      if (this.stepFinished.length === this.successfulSteps) {
        this.currentMessage = TutorialGameWrapperMessages.COMPLETED_TUTORIAL_MESSAGE();
        this.tutorialOver = true;
      } else {
        let indexUndone = (this.stepIndex + 1) % this.steps.length;
        while (this.stepFinished[indexUndone]) {
          indexUndone = (indexUndone + 1) % this.steps.length;
        }
        yield this.showStep(indexUndone);
      }
    });
  }
  showSolution() {
    return __async(this, null, function* () {
      const step = this.steps[this.stepIndex];
      Utils.assert(step.hasSolution(), "step must have solution");
      const solutionStep = step;
      const solution = solutionStep.getSolution();
      const config = this.getConfig();
      if (solution instanceof Move) {
        yield this.showStep(this.stepIndex);
        const oldNode = this.gameComponent.node();
        const chosenNode = this.gameComponent.rules.choose(oldNode, solution, config).get();
        this.gameComponent.node.set(chosenNode);
        yield this.showCurrentState(true);
      } else {
        yield this.showStep(this.stepIndex);
        const element = window.document.querySelector(solution);
        element.dispatchEvent(new Event("click"));
        yield Promise.resolve();
        yield this.gameComponent.updateBoardAndRedraw(false);
      }
      this.currentMessage = solutionStep.getSuccessMessage();
      this.moveAttemptMade = true;
      this.cdr.detectChanges();
    });
  }
  playLocally() {
    return __async(this, null, function* () {
      const urlName = this.getGameUrlName();
      yield this.router.navigate(["/local", urlName, "config"]);
    });
  }
  createGame() {
    return __async(this, null, function* () {
      const urlName = this.getGameUrlName();
      yield this.router.navigate(["/play", urlName]);
    });
  }
  getConfig() {
    if (this.steps.length === 0) {
      return super.getConfig();
    }
    const step = this.steps[this.stepIndex];
    const config = step.config;
    if (config.isPresent()) {
      return config.get();
    } else {
      return super.getConfig();
    }
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275TutorialGameWrapperComponent_BaseFactory;
    return function TutorialGameWrapperComponent_Factory(__ngFactoryType__) {
      return (\u0275TutorialGameWrapperComponent_BaseFactory || (\u0275TutorialGameWrapperComponent_BaseFactory = \u0275\u0275getInheritedFactory(TutorialGameWrapperComponent2)))(__ngFactoryType__ || TutorialGameWrapperComponent2);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: TutorialGameWrapperComponent2, selectors: [["app-tutorial-game-wrapper"]], features: [\u0275\u0275InheritDefinitionFeature], decls: 8, vars: 2, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_6439401135646542284$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_0 = goog.getMsg("Failure");
      i18n_0 = MSG_EXTERNAL_6439401135646542284$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Failure`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_6650633628037596693$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_1 = goog.getMsg("Try again");
      i18n_1 = MSG_EXTERNAL_6650633628037596693$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Try again`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_8720977247725652816$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_2 = goog.getMsg("Ok");
      i18n_2 = MSG_EXTERNAL_8720977247725652816$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Ok`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_6962699013778688473$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_3 = goog.getMsg("Continue");
      i18n_3 = MSG_EXTERNAL_6962699013778688473$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Continue`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_4563965495368336177$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_4 = goog.getMsg("Skip");
      i18n_4 = MSG_EXTERNAL_4563965495368336177$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`Skip`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_6650633628037596693$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_5 = goog.getMsg("Try again");
      i18n_5 = MSG_EXTERNAL_6650633628037596693$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`Try again`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_7757774343229747209$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_6 = goog.getMsg("Play locally");
      i18n_6 = MSG_EXTERNAL_7757774343229747209$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Play locally`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_2009811124619716606$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_7 = goog.getMsg("Create an online game");
      i18n_7 = MSG_EXTERNAL_2009811124619716606$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`Create an online game`;
    }
    let i18n_8;
    if (false) {
      const MSG_EXTERNAL_6620520011512200697$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_8 = goog.getMsg("See solution");
      i18n_8 = MSG_EXTERNAL_6620520011512200697$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_TUTORIAL_GAME_WRAPPER_TUTORIAL_GAME_WRAPPER_COMPONENT_TS_8;
    } else {
      i18n_8 = $localize`See solution`;
    }
    return [["board", ""], i18n_0, i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, i18n_8, [1, "columns", "is-vcentered", "is-align-items-stretch"], [1, "column", "is-one-third"], ["id", "infos", 1, "box", "is-fullheight"], [1, "column"], [1, "box", "is-fullheight", "p-5", 3, "ngClass"], ["id", "board", 1, "box", "is-fullheight"], [3, "rulesConfig", "rulesConfigDescription", "gameName"], [1, "progress", "is-primary"], [1, "content", "is-medium"], [1, "title"], ["id", "currentMessage", 3, "innerHTML"], ["role", "alert", 1, "message", "is-danger"], [1, "block"], ["id", "retryButton", 1, "button", "mr-3"], ["id", "nextButton", 1, "button", "is-primary", "mr-3", "mb-1"], ["id", "restartButton", 1, "button"], ["id", "playLocallyButton", 1, "button"], ["id", "playOnlineButton", 1, "button"], ["id", "showSolutionButton", 1, "button"], [1, "select"], ["id", "steps", 3, "change"], [1, "message-header"], ["id", "currentReason", 1, "message-body", 3, "innerHTML"], ["id", "retryButton", 1, "button", "mr-3", 3, "click"], ["id", "nextButton", 1, "button", "is-primary", "mr-3", "mb-1", 3, "click"], ["id", "restartButton", 1, "button", 3, "click"], ["id", "playLocallyButton", 1, "button", 3, "click"], ["id", "playOnlineButton", 1, "button", 3, "click"], ["id", "showSolutionButton", 1, "button", 3, "click"], ["selected", "", 3, "id", "value"], [3, "value"], [3, "id"]];
  }, template: function TutorialGameWrapperComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 10)(1, "div", 11);
      \u0275\u0275conditionalCreate(2, TutorialGameWrapperComponent_Conditional_2_Template, 19, 16, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 13)(4, "div", 14)(5, "div", 15);
      \u0275\u0275element(6, "div", null, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.gameComponent ? 2 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", ctx.getBoardHighlight());
    }
  }, dependencies: [ViewConfigComponent, ReactiveFormsModule, NgSelectOption, \u0275NgSelectMultipleOption, NgClass], encapsulation: 2, changeDetection: 0 });
};
TutorialGameWrapperComponent = __decorate([
  Debug.log
], TutorialGameWrapperComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TutorialGameWrapperComponent, [{
    type: Component,
    args: [{ selector: "app-tutorial-game-wrapper", changeDetection: ChangeDetectionStrategy.OnPush, imports: [ViewConfigComponent, ReactiveFormsModule, NgClass], template: `<div class="columns is-vcentered is-align-items-stretch">
    <div class="column is-one-third">
        @if (gameComponent) {
            <div id="infos"
                 class="box is-fullheight">
                <app-view-config [rulesConfig]="getConfig()"
                                 [rulesConfigDescription]="getRulesConfigDescription()"
                                 [gameName]="getGameName().getOrElse('')">
                </app-view-config>
                <progress class="progress is-primary"
                          [attr.value]="successfulSteps"
                          [attr.max]="getNumberOfSteps()"></progress>
                <div class="content is-medium">
                    <p class="title">{{ getCurrentStepTitle() }} [{{stepIndex + 1}}/{{ getNumberOfSteps() }}]</p>
                    <p id="currentMessage"
                       [innerHTML]="currentMessage"></p>
                </div>
                @if (currentReason.isPresent()) {
                    <div class="message is-danger"
                         role="alert">
                        <div class="message-header"
                             i18n>Failure</div>
                        <div class="message-body"
                             id="currentReason"
                             [innerHTML]="currentReason.get()"></div>
                    </div>
                }
                <div class="block">
                    @if (tutorialOver === false && ((stepFinished && stepFinished[stepIndex]) || moveAttemptMade)) {
                        <button id="retryButton"
                                class="button mr-3"
                                (click)="retry()"
                                i18n>Try again</button>
                    }
                    @if (tutorialOver === false) {
                        <button id="nextButton"
                                class="button is-primary mr-3 mb-1"
                                (click)="next()">
                            @if (steps[stepIndex] && steps[stepIndex].isInformation()) {
                                <ng-container i18n>Ok</ng-container>
                            } @else {
                                @if (stepFinished && stepFinished[stepIndex]) {
                                    <ng-container i18n>Continue</ng-container>
                                } @else {
                                    <ng-container i18n>Skip</ng-container>
                                }
                            }
                        </button>
                    }
                    @if (tutorialOver) {
                        <button id="restartButton"
                                class="button"
                                (click)="start()"
                                i18n>Try again</button>
                    }
                    @if (tutorialOver) {
                        <button id="playLocallyButton"
                                class="button"
                                (click)="playLocally()"
                                i18n>Play locally</button>
                    }
                    @if (tutorialOver) {
                        <button id="playOnlineButton"
                                class="button"
                                (click)="createGame()"
                                i18n>Create an online game</button>
                    }
                    @if (moveAttemptMade && stepFinished[stepIndex] === false) {
                        <button id="showSolutionButton"
                                class="button"
                                (click)="showSolution()"
                                i18n>See solution</button>
                    }
                    <div class="select">
                        <select id="steps"
                                (change)="changeStep($event)">
                            @for (step of steps; track $index; let i = $index) {
                                @if (i === stepIndex) {
                                    <option id="step_{{ i }}"
                                            [value]="i"
                                            selected>{{ step.title }}</option>
                                } @else {
                                    <option [value]="i">
                                        @if (stepFinished[i]) {
                                            v
                                        } @else {
                                            x
                                        }
                                        <span id="step_{{ i }}">{{ step.title }}</span>
                                    </option>
                                }
                            }
                        </select>
                    </div>
                </div>
            </div>
        }
    </div>
    <div class="column">
        <div class="box is-fullheight p-5"
             [ngClass]="getBoardHighlight()">
            <div id="board"
                 class="box is-fullheight">
                <div #board></div>
            </div>
        </div>
    </div>
</div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TutorialGameWrapperComponent, { className: "TutorialGameWrapperComponent", filePath: "src/app/components/wrapper-components/tutorial-game-wrapper/tutorial-game-wrapper.component.ts", lineNumber: 36 });
})();

export {
  TutorialGameWrapperMessages,
  TutorialGameWrapperComponent
};
//# sourceMappingURL=chunk-C34NEAOU.js.map
