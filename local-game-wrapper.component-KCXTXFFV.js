import {
  ViewConfigComponent
} from "./chunk-XZHSVPAI.js";
import {
  GameWrapper,
  RulesConfigUtils
} from "./chunk-JAFSLBC5.js";
import {
  AIStats,
  AbstractMinimax,
  BoardValue,
  GameNode,
  GameNodeStats,
  GameStatus,
  Minimax,
  Player,
  PlayerMap
} from "./chunk-JBKFZJ3T.js";
import "./chunk-PC6ZDXKZ.js";
import "./chunk-VZWZQOY5.js";
import {
  Debug
} from "./chunk-Y4TVVAIH.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-CIU2KL3F.js";
import {
  ArrayUtils,
  JSONParser,
  MGPOptional,
  MGPValidation,
  Utils,
  isJSONPrimitive
} from "./chunk-KI3WLQMB.js";
import {
  NgClass
} from "./chunk-6LTRXF6Y.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  __async,
  __publicField,
  __superGet,
  computed,
  inject,
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
  ɵɵi18n,
  ɵɵi18nApply,
  ɵɵi18nExp,
  ɵɵinterpolate1,
  ɵɵinterpolate2,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XHN637UA.js";

// src/app/jscaip/AI/IterativeDeepeningMinimax.ts
var IterativeDeepeningMinimax = class extends AbstractMinimax {
  MAX_MINIMAX_LEVEL = 10;
  constructor(name, rules, heuristic, moveGenerator, hash) {
    super(name, rules, heuristic, moveGenerator, hash);
    for (let i = 1; i < this.MAX_MINIMAX_LEVEL; i++) {
      this.availableOptions.push({ name: `${i * i} seconds`, maxSeconds: i * i });
    }
  }
  doChooseNextMove(node, options, config) {
    Utils.assert(this.rules.getGameStatus(node, config).isEndGame === false, "Minimax has been asked to choose a move from a finished game");
    const boardValue = this.getExpectedExtremum(node, config);
    const start = Date.now();
    const endTime = Date.now() + options.maxSeconds * 1e3;
    this.endSearchBy = MGPOptional.of(endTime);
    let currentDepth = 1;
    let achievedDepth = 1;
    let bestMove = MGPOptional.empty();
    while (Date.now() < endTime) {
      const candidateOptional = this.alphaBeta(node, currentDepth, boardValue.toMinimum(), boardValue.toMaximum(), config);
      if (candidateOptional.isAbsent()) {
        break;
      }
      const candidate = candidateOptional.get();
      if (candidate.complete && Date.now() < this.endSearchBy.get()) {
        bestMove = MGPOptional.of(candidate.move);
        achievedDepth = currentDepth;
      }
      currentDepth++;
    }
    Utils.assert(bestMove.isPresent(), "best move should have been computed");
    console.log("achieved depth: " + achievedDepth + " in " + (Date.now() - start) + "ms");
    this.endSearchBy = MGPOptional.empty();
    return bestMove.get();
  }
};

// src/app/jscaip/AI/MCTS.ts
var MCTS = class {
  name;
  moveGenerator;
  rules;
  // The exploration parameter influences the MCTS results.
  // It is chosen "empirically". The generally recommended value from Wikipedia is Math.sqrt(2),
  // but in our case it seems to work much better with a higher exploration parameter.
  // A higher exploration parameter steers MCTS towards exploring more unexplored playouts, vs. exploring its wins.
  explorationParameter = 80;
  // The longest a game can be before we decide to stop simulating it
  maxGameLength = 7 * 6;
  // Set to the number of moves in connect 4
  availableOptions = [];
  // An id unique to this MCTS, used to store/retrieve cached value in nodes without clashing with other AIs
  uniqueId;
  constructor(name, moveGenerator, rules) {
    this.name = name;
    this.moveGenerator = moveGenerator;
    this.rules = rules;
    this.uniqueId = Math.random().toString(36).substring(2, 8);
    for (let i = 1; i < 10; i++) {
      this.availableOptions.push({ name: `${i * i} seconds`, maxSeconds: i * i });
    }
  }
  /**
   * Performs the search, given a node representing a board.
   * The search is performed for at most `iterations` iterations.
   */
  chooseNextMove(root, options, config) {
    Utils.assert(this.rules.getGameStatus(root, config).isEndGame === false, "cannot search from a finished game");
    const player = root.gameState.getCurrentPlayer();
    const startTime = Date.now();
    const endTime = Date.now() + options.maxSeconds * 1e3;
    let iterations = 0;
    while (Date.now() < endTime) {
      const expansionResult = this.expand(this.select({ node: root, path: [root] }, player), config);
      const gameStatus = this.simulate(expansionResult.node, endTime, config);
      this.backpropagate(expansionResult.path, this.score(expansionResult.node, config, gameStatus, player));
      iterations++;
    }
    Debug.display("MCTS", "chooseNextMove", "root winRatio: " + this.winRatio(root));
    Debug.display("MCTS", "chooseNextMove", "children winRatio: " + root.getChildren().map((n) => n.id + ": " + this.winRatio(n)));
    const bestChildren = ArrayUtils.maximumsBy(root.getChildren(), (n) => this.winRatio(n));
    const bestChild = ArrayUtils.getRandomElement(bestChildren);
    const seconds = (Date.now() - startTime) / 1e3;
    Debug.display("MCTS", "chooseNextMove", `Computed ${iterations} in ${seconds} (rate: ${iterations / seconds} it/s)`);
    Debug.display("MCTS", "chooseNextMove", "Best child has a win ratio of: " + this.winRatio(bestChild));
    return bestChild.previousMove.get();
  }
  /**
   * Returns 1 for win, 0 for losses. Must return a result between 0 and 1 otherwise.
   */
  score(_node, _config, gameStatus, player) {
    switch (gameStatus) {
      case GameStatus.DRAW:
      case GameStatus.ONGOING:
        return 0.01;
      // Prefer ongoing/draw to loss
      default:
        if (gameStatus.winner === player)
          return 1;
        else
          return 0;
    }
  }
  /**
   * Computes the UCB value of a node.
   * The UCB (Upper-Confidence-Bound) is a value used to select nodes to explore.
   */
  adversarialUcb(node, parentSimulations, player) {
    const simulations = this.simulations(node);
    if (parentSimulations === 0 || simulations === 0) {
      return Number.POSITIVE_INFINITY;
    }
    const winRatio = this.wins(node) / simulations;
    const exploitation = node.gameState.getPreviousPlayer() === player ? winRatio : 1 - winRatio;
    return exploitation + this.explorationParameter * Math.sqrt(Math.log(parentSimulations) / simulations);
  }
  /**
   * Computes the win ratio for this node, as how many simulations have been won.
   */
  winRatio(node) {
    const simulations = this.simulations(node);
    if (simulations === 0) {
      return 1;
    }
    return this.wins(node) / simulations;
  }
  wins(node) {
    return this.getCounterFromCache(node, "wins");
  }
  simulations(node) {
    return this.getCounterFromCache(node, "simulations");
  }
  getCounterFromCache(node, name) {
    const cachedValue = node.getCache(this.uniqueId + name);
    if (cachedValue.isPresent()) {
      return cachedValue.get();
    } else {
      node.setCache(this.uniqueId + name, 0);
      return 0;
    }
  }
  /**
   * Selects the node that we will consider in this iteration.
   * This takes the first unexplored node it finds in a BFS fashion.
   * @returns the selected node
   */
  select(nodeAndPath, player) {
    const node = nodeAndPath.node;
    Debug.display("MCTS", "select", "Exploring node: " + node.id);
    if (node.hasChildren()) {
      const simulations = this.simulations(node);
      Debug.display("MCTS", "select", "UCB values: " + node.getChildren().map((n) => n.id + ": " + this.adversarialUcb(n, simulations, player)));
      const bestChildren = ArrayUtils.maximumsBy(node.getChildren(), (n) => this.adversarialUcb(n, simulations, player));
      const childToVisit = ArrayUtils.getRandomElement(bestChildren);
      Debug.display("MCTS", "select", "selecting children " + childToVisit.id);
      return this.select({ node: childToVisit, path: nodeAndPath.path.concat([childToVisit]) }, player);
    } else {
      Debug.display("MCTS", "select", "this is a leaf node, we select it");
      return nodeAndPath;
    }
  }
  /**
   * Expands a node, i.e., creates children to explore if needed, or returns the node directly.
   * @returns one of the created child, or the node itself if it is terminal
   */
  expand(nodeAndPath, config) {
    if (this.rules.getGameStatus(nodeAndPath.node, config).isEndGame) {
      return nodeAndPath;
    }
    const node = nodeAndPath.node;
    const moves = this.moveGenerator.getListMoves(node, config);
    Utils.assert(moves.length > 0, `${this.name}: move generator did not return any move on a non-finished game: ${this.moveGenerator.constructor.name}`);
    for (const move of moves) {
      node.addChild(this.play(node, move, config));
    }
    const pickedChild = ArrayUtils.getRandomElement(node.getChildren());
    return { node: pickedChild, path: nodeAndPath.path.concat([pickedChild]) };
  }
  /**
   * Simulate a game from the given node. Does not change anything in the node.
   * @returns the game status at the end of the simulation
   */
  simulate(node, endTime, config) {
    Debug.display("MCTS", "simulate", "simulate from node which has a last move of " + node.previousMove.get().toString());
    let current = node;
    let steps = 0;
    while (steps < this.maxGameLength && Date.now() < endTime) {
      const status = this.rules.getGameStatus(current, config);
      if (status.isEndGame) {
        Debug.display("MCTS", "simulate", `end game in ${steps} steps, winner is ${status.winner}`);
        return status;
      }
      steps++;
      current = this.playRandomStep(current, config);
    }
    return GameStatus.ONGOING;
  }
  /**
   * Picks a random move and play it
   * @returns the state after the move
   */
  playRandomStep(node, config) {
    const moves = this.moveGenerator.getListMoves(node, config);
    Utils.assert(moves.length > 0, "MoveGenerator gave empty list of moves for ongoing game to MCTS");
    const move = ArrayUtils.getRandomElement(moves);
    return this.play(node, move, config);
  }
  /**
   * Plays a move.
   * @returns the state after the move
   */
  play(node, move, config) {
    const legality = this.rules.isLegal(move, node.gameState, config);
    Utils.assert(legality.isSuccess(), "heuristic returned illegal move", { move: move.toString() });
    const childState = this.rules.applyLegalMove(move, node.gameState, config, legality.get());
    const childNode = new GameNode(childState, MGPOptional.of(node), MGPOptional.of(move));
    return childNode;
  }
  /**
   * Backpropagates the result of a simulation in a path from the simulated node to the root of the tree.
   * @returns nothing, as it modifies the nodes directly
   */
  backpropagate(path, score) {
    for (const node of path) {
      this.addSimulationResult(node, score);
      Debug.display("MCTS", "backpropagate", `backpropagate to node which now has ${this.wins(node) / this.simulations(node)}`);
    }
  }
  addSimulationResult(node, score) {
    const simulations = this.simulations(node) + 1;
    const wins = this.wins(node) + score;
    node.setCache(this.uniqueId + "wins", wins);
    node.setCache(this.uniqueId + "simulations", simulations);
  }
  getInfo(node) {
    const wins = this.getCounterFromCache(node, "wins");
    const simulations = this.getCounterFromCache(node, "simulations");
    return `wins/simulations=${wins}/${simulations}`;
  }
};

// src/app/jscaip/AI/MCTSWithHeuristic.ts
var MCTSWithHeuristic = class extends MCTS {
  heuristic;
  constructor(name, moveGenerator, rules, heuristic) {
    super(name, moveGenerator, rules);
    this.heuristic = heuristic;
  }
  /**
   * Return a score which is the average of all metrics
   */
  score(node, config, gameStatus, player) {
    if (gameStatus === GameStatus.ONGOING) {
      const boardValue = this.heuristic.getBoardValue(node, config);
      const bounds = this.heuristic.getBounds(config);
      Utils.assert(boardValue.metrics.length === bounds.player0Best.metrics.length && boardValue.metrics.length === bounds.player1Best.metrics.length, `MCTSWithHeuristic ${this.name}: metrics and bound values should have the same shape`);
      let value = 0;
      for (let i = 0; i < boardValue.metrics.length; i++) {
        const player0Best = bounds.player0Best.metrics[i];
        const metric = boardValue.metrics[i];
        const player1Best = bounds.player1Best.metrics[i];
        const isOutOfBounds = metric < player0Best || player1Best < metric;
        const isPreVictory = BoardValue.isPreVictoryValue(metric);
        if (isOutOfBounds && isPreVictory === false) {
          console.warn(`MCTSWithHeuristic ${this.name} got a value outside its bounds: ${metric} is outside of [${player0Best}, ${player1Best}]`);
        }
        const boundedMetric = Math.max(player0Best, Math.min(metric, player1Best));
        const denom = player1Best - player0Best;
        if (denom === 0) {
          value += 0.5;
        } else {
          value += (boundedMetric - player0Best) / denom;
        }
      }
      value = value / boardValue.metrics.length;
      Utils.assert(0 <= value && value <= 1, `MCTSWithHeuristic ${this.name} got a value outside of [0,1]`);
      if (player === Player.ONE) {
        return value;
      } else {
        return 1 - value;
      }
    } else {
      return super.score(node, config, gameStatus, player);
    }
  }
};

// src/app/jscaip/AI/AIConfigUtils.ts
var AIInstanceRegistry = class {
  instances = /* @__PURE__ */ new Map();
  getOrCreate(config, strategy, factory) {
    let instancesForConfig = this.instances.get(config);
    if (instancesForConfig == null) {
      instancesForConfig = /* @__PURE__ */ new Map();
      this.instances.set(config, instancesForConfig);
    }
    const existing = instancesForConfig.get(strategy);
    if (existing != null) {
      return existing;
    }
    const ai = factory();
    instancesForConfig.set(strategy, ai);
    return ai;
  }
};
function createMinimaxFromConfig(rules, config) {
  const minimax = new Minimax(config.name, rules, config.heuristic(), config.moveGenerator(), config.hash);
  minimax.configureFromConfig(config);
  return minimax;
}
function createIterativeDeepeningMinimaxFromConfig(rules, config) {
  const minimax = new IterativeDeepeningMinimax(config.name, rules, config.heuristic(), config.moveGenerator(), config.hash);
  minimax.configureFromConfig(config);
  return minimax;
}
function createMCTSFromConfig(rules, config) {
  if (config.heuristic == null) {
    return new MCTS(config.name, config.moveGenerator(), rules);
  } else {
    return new MCTSWithHeuristic(config.name, config.moveGenerator(), rules, config.heuristic());
  }
}

// src/app/components/wrapper-components/local-game-wrapper/local-game-wrapper.component.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LocalGameWrapperComponent_1;
var _forTrack0 = ($index, $item) => $item.getValue();
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.name;
function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.winnerMessage.get());
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 24);
    \u0275\u0275i18n(1, 3);
    \u0275\u0275elementEnd();
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275conditionalCreate(1, LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_4_Conditional_1_Template, 2, 1, "p", 23);
    \u0275\u0275conditionalCreate(2, LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_4_Conditional_2_Template, 2, 0, "p", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.winnerMessage.isPresent() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.winnerMessage.isAbsent() ? 2 : -1);
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const strategy_r5 = ctx.$implicit;
    const player_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("id", \u0275\u0275interpolate2("player-", player_r4.getValue(), "-ai-", strategy_r5.id))("value", strategy_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(strategy_r5.name);
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_9_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const profile_r7 = ctx.$implicit;
    const player_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("id", \u0275\u0275interpolate2("player-", player_r4.getValue(), "-profile-", profile_r7.id))("value", profile_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(profile_r7.name);
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "select", 27);
    \u0275\u0275listener("ngModelChange", function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_9_Template_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const player_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onAIProfileChange(player_r4, $event));
    });
    \u0275\u0275elementStart(2, "option", 31);
    \u0275\u0275i18n(3, 6);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_9_For_5_Template, 2, 5, "option", 29, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const player_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("ai-profile-select-", player_r4.getValue()))("ngModel", ctx_r1.getAIProfile(player_r4));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.availableAIProfiles(player_r4));
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_10_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r9 = ctx.$implicit;
    const player_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("id", \u0275\u0275interpolate2("player-", player_r4.getValue(), "-option-", option_r9.name))("value", option_r9.name);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r9.name);
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "select", 27);
    \u0275\u0275listener("ngModelChange", function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_10_Template_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      const player_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onAIOptionChange(player_r4, $event));
    });
    \u0275\u0275elementStart(2, "option", 31);
    \u0275\u0275i18n(3, 7);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_10_For_5_Template, 2, 5, "option", 29, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const player_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("ai-option-select-", player_r4.getValue()))("ngModel", ctx_r1.getAIOption(player_r4));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.availableAIOptions(player_r4));
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const player_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("id", \u0275\u0275interpolate1("score-", player_r4.getValue()))("ngClass", player_r4.getHTMLClass("-fg"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.gameComponent.getScoreString(player_r4));
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "p", 25);
    \u0275\u0275i18n(2, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "select", 27);
    \u0275\u0275listener("ngModelChange", function LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Template_select_ngModelChange_4_listener($event) {
      const player_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onPlayerSelectionChange(player_r4, $event));
    });
    \u0275\u0275elementStart(5, "option", 28);
    \u0275\u0275i18n(6, 5);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_For_8_Template, 2, 5, "option", 29, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_9_Template, 6, 3, "div", 26);
    \u0275\u0275conditionalCreate(10, LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_10_Template, 6, 3, "div", 26);
    \u0275\u0275conditionalCreate(11, LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Conditional_11_Template, 2, 4, "p", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const player_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", player_r4.getHTMLClass("-bg"));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", player_r4.getHTMLClass("-fg"));
    \u0275\u0275advance();
    \u0275\u0275i18nExp(player_r4.getValue() + 1);
    \u0275\u0275i18nApply(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("player-select-", player_r4.getValue()))("ngModel", ctx_r1.getPlayerSelection(player_r4));
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("player-", player_r4.getValue(), "-human"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.availableAIStrategies());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.mustSelectAIProfile(player_r4) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.players.get(player_r4).equalsValue("human") === false && ctx_r1.isAIProfileSelected(player_r4) ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.gameComponent.hasScores() ? 11 : -1);
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_7_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.gameComponent.pass());
    });
    \u0275\u0275i18n(1, 8);
    \u0275\u0275elementEnd();
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.takeBack());
    });
    \u0275\u0275i18n(1, 9);
    \u0275\u0275elementEnd();
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_11_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275element(1, "br");
  }
  if (rf & 2) {
    const info_r13 = ctx.$implicit;
    \u0275\u0275textInterpolate1(" ", info_r13, " ");
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.viewTreeFromCurrentNode());
    });
    \u0275\u0275text(1, " DOT from current node");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 35);
    \u0275\u0275listener("click", function LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_11_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.viewTreeFromPreviousNode());
    });
    \u0275\u0275text(3, " DOT from previous node");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 36);
    \u0275\u0275repeaterCreate(5, LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_11_For_6_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275text(7);
    \u0275\u0275element(8, "br");
    \u0275\u0275text(9);
    \u0275\u0275element(10, "br");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.getAIInfoLines());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Created ", ctx_r1.getCreatedNodes(), " nodes.");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Minimax times: ", ctx_r1.getMinimaxTimes());
  }
}
function LocalGameWrapperComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "app-view-config", 16);
    \u0275\u0275elementStart(2, "p", 17);
    \u0275\u0275i18n(3, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_4_Template, 3, 2, "div", 18);
    \u0275\u0275repeaterCreate(5, LocalGameWrapperComponent_Conditional_0_Conditional_2_For_6_Template, 12, 11, "div", 19, _forTrack0);
    \u0275\u0275conditionalCreate(7, LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_7_Template, 2, 0, "button", 20);
    \u0275\u0275conditionalCreate(8, LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_8_Template, 2, 0, "button", 21);
    \u0275\u0275elementStart(9, "button", 22);
    \u0275\u0275listener("click", function LocalGameWrapperComponent_Conditional_0_Conditional_2_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.restartGame());
    });
    \u0275\u0275i18n(10, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, LocalGameWrapperComponent_Conditional_0_Conditional_2_Conditional_11_Template, 11, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("rulesConfig", ctx_r1.rulesConfig)("rulesConfigDescription", ctx_r1.getRulesConfigDescription())("gameName", ctx_r1.getGameName().getOrElse(""));
    \u0275\u0275advance(2);
    \u0275\u0275i18nExp(ctx_r1.gameComponent.getTurn() + 1);
    \u0275\u0275i18nApply(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.endGame ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.Player.PLAYERS);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.endGame === false && ctx_r1.gameComponent.canPass ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canTakeBack() ? 8 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.mustDisplayAIInfo() ? 11 : -1);
  }
}
function LocalGameWrapperComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11);
    \u0275\u0275conditionalCreate(2, LocalGameWrapperComponent_Conditional_0_Conditional_2_Template, 12, 8, "div", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 13)(4, "div", 14)(5, "div", 15);
    \u0275\u0275element(6, "div", null, 0);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.gameComponent ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getBoardHighlight());
  }
}
var _a;
var LocalGameWrapperComponent = (_a = class extends GameWrapper {
  cdr = inject(ChangeDetectorRef);
  aiInstances = new AIInstanceRegistry();
  aiTimeout = MGPOptional.empty();
  aiProfiles = PlayerMap.ofValues("none", "none");
  aiOptions = PlayerMap.ofValues("none", "none");
  playerSelection = PlayerMap.ofValues("human", "human");
  winnerMessage = MGPOptional.empty();
  rulesConfig;
  // Set in constructor and in ngAfterViewInit
  mustDisplayAIInfo = computed(() => {
    return this.gameComponent.node().previousMove.isPresent() && this.displayAIInfo();
  }, ...ngDevMode ? [{ debugName: "mustDisplayAIInfo" }] : []);
  constructor() {
    super();
    this.players = PlayerMap.ofValues(MGPOptional.of(this.playerSelection.get(Player.ZERO)), MGPOptional.of(this.playerSelection.get(Player.ONE)));
    this.role = Player.ZERO;
  }
  getCreatedNodes() {
    return GameNodeStats.createdNodes;
  }
  getMinimaxTimes() {
    return Array.from(AIStats.aiTime.entries()).map(([key, value]) => `${key}: ${value.toFixed(0)}ms`).join(",");
  }
  getAIInfoLines() {
    const config = this.getConfig();
    return [
      ...this.getMinimaxConfigs().map((minimaxConfig) => {
        const ai = this.createMinimax(minimaxConfig);
        return `${ai.name}: ${ai.getInfo(this.gameComponent.node(), config)}`;
      }),
      ...this.getMCTSConfigs().map((mctsConfig) => {
        const ai = this.createMCTS(mctsConfig);
        return `${ai.name}: ${ai.getInfo(this.gameComponent.node())}`;
      })
    ];
  }
  ngAfterViewInit() {
    return __async(this, null, function* () {
      setTimeout(() => __async(this, null, function* () {
        const createdSuccessfully = yield this.createMatchingGameComponent();
        if (createdSuccessfully) {
          yield this.restartGame();
          this.cdr.detectChanges();
        }
      }), 1);
    });
  }
  createGameComponentAndSetConfig(componentType) {
    return __async(this, null, function* () {
      yield this.setConfigFromParams();
      yield __superGet(_a.prototype, this, "createGameComponentAndSetConfig").call(this, componentType);
    });
  }
  /**
   * Reads the URL to get the config from query parameters (e.g., /P4?width=5&height=5)
   * If the config is invalid, redirect to page that lets the user select the config.
   * Public for being able to trigger it from tests.
   */
  setConfigFromParams() {
    return __async(this, null, function* () {
      const params = this.activatedRoute.snapshot.queryParamMap;
      const noConfigIsProvided = params.keys.length === 0;
      const defaultConfig = RulesConfigUtils.getGameDefaultConfig(this.getGameUrlName());
      const gameIsNotConfigurable = Object.keys(defaultConfig).length === 0;
      if (noConfigIsProvided || gameIsNotConfigurable) {
        this.rulesConfig = defaultConfig;
      } else {
        const rulesConfigDescription = this.getRulesConfigDescription();
        const config = {};
        this.rulesConfig = defaultConfig;
        for (const key of rulesConfigDescription.getFields()) {
          const paramValue = params.get(key);
          if (paramValue == null) {
            return this.redirectToConfiguration();
          } else {
            const value = JSONParser.parseJSONSafely(paramValue);
            if (value.isPresent()) {
              const actualValue = value.get();
              if (isJSONPrimitive(actualValue) && rulesConfigDescription.isValid(key, actualValue)) {
                config[key] = value.get();
              } else {
                return this.redirectToConfiguration();
              }
            } else {
              return this.redirectToConfiguration();
            }
          }
        }
        const areValidatorsValid = this.areGlobalValidatorsValid(rulesConfigDescription, config);
        if (areValidatorsValid === false) {
          return this.redirectToConfiguration();
        }
        this.rulesConfig = config;
      }
    });
  }
  areGlobalValidatorsValid(rulesConfigDescription, config) {
    const validators = rulesConfigDescription.defaultConfigDescription.validators ?? [];
    for (const validator of validators) {
      const validation = validator(config);
      if (validation.isFailure()) {
        return false;
      }
    }
    return true;
  }
  redirectToConfiguration() {
    return __async(this, null, function* () {
      yield this.router.navigate(["/local", this.getGameUrlName(), "config"]);
    });
  }
  getPlayerSelection(player) {
    return this.playerSelection.get(player);
  }
  onPlayerSelectionChange(player, value) {
    return __async(this, null, function* () {
      this.playerSelection.put(player, value);
      yield this.updatePlayer(player);
    });
  }
  getAIProfile(player) {
    return this.aiProfiles.get(player);
  }
  onAIProfileChange(player, value) {
    return __async(this, null, function* () {
      this.aiProfiles.put(player, value);
      yield this.updatePlayer(player);
    });
  }
  getAIOption(player) {
    return this.aiOptions.get(player);
  }
  onAIOptionChange(player, value) {
    return __async(this, null, function* () {
      this.aiOptions.put(player, value);
      yield this.updatePlayer(player);
    });
  }
  updatePlayer(player) {
    return __async(this, null, function* () {
      this.resetInvalidAISelection(player);
      this.players.put(player, MGPOptional.of(this.playerSelection.get(player)));
      const playerZeroIsHuman = this.playerSelection.get(Player.ZERO) === "human";
      const playerOneIsHuman = this.playerSelection.get(Player.ONE) === "human";
      if (playerZeroIsHuman) {
        yield this.setInteractive(true);
        yield this.setRole(Player.ZERO);
      } else if (playerOneIsHuman) {
        yield this.setInteractive(false);
        yield this.setRole(Player.ONE);
      } else {
        yield this.setInteractive(false);
        yield this.setRole(Player.ZERO);
      }
      yield this.proposeAIToPlay();
    });
  }
  resetInvalidAISelection(player) {
    if (this.playerSelection.get(player) === "human") {
      this.aiProfiles.put(player, "none");
      this.aiOptions.put(player, "none");
      return;
    }
    if (this.mustSelectAIProfile(player) === false) {
      this.aiProfiles.put(player, this.availableAIProfiles(player)[0]?.id ?? "none");
    }
    const profileExists = this.availableAIProfiles(player).some((profile) => {
      return profile.id === this.aiProfiles.get(player);
    });
    if (profileExists === false) {
      this.aiProfiles.put(player, "none");
      this.aiOptions.put(player, "none");
    } else if (this.availableAIOptions(player).some((option) => {
      return option.name === this.aiOptions.get(player);
    }) === false) {
      this.aiOptions.put(player, "none");
    }
  }
  mustSelectAIProfile(player) {
    return this.playerSelection.get(player) !== "human" && (this.playerSelection.get(player) !== "mcts" || this.availableAIProfiles(player).length > 1);
  }
  isAIProfileSelected(player) {
    return this.mustSelectAIProfile(player) === false || this.aiProfiles.get(player) !== "none";
  }
  onLegalUserMove(move) {
    return __async(this, null, function* () {
      const config = this.getConfig();
      const oldNode = this.gameComponent.node();
      const chosenNode = this.gameComponent.rules.choose(oldNode, move, config).get();
      this.gameComponent.node.set(chosenNode);
      yield this.applyNewMove();
    });
  }
  updateWrapper() {
    return __async(this, null, function* () {
      const config = this.getConfig();
      const gameStatus = this.gameComponent.rules.getGameStatus(this.gameComponent.node(), config);
      if (gameStatus.isEndGame) {
        this.endGame = true;
        if (gameStatus.winner.isPlayer()) {
          const winner = $localize`Player ${gameStatus.winner.getValue() + 1}`;
          const loser = gameStatus.winner.getOpponent();
          if (this.players.get(gameStatus.winner).equalsValue("human")) {
            if (this.players.get(loser).equalsValue("human")) {
              this.winnerMessage = MGPOptional.of($localize`${winner} won`);
            } else {
              this.winnerMessage = MGPOptional.of($localize`You won`);
            }
          } else {
            if (this.players.get(loser).equalsValue("human")) {
              this.winnerMessage = MGPOptional.of($localize`You lost`);
            } else {
              this.winnerMessage = MGPOptional.of($localize`${this.getPlayerName(gameStatus.winner)} (Player ${gameStatus.winner.getValue() + 1}) won`);
            }
          }
        }
      }
      this.cdr.detectChanges();
    });
  }
  getPlayerName(player) {
    if (this.playerSelection.get(player) === "human") {
      return $localize`Human`;
    }
    const profile = this.availableAIProfiles(player).find((candidate) => {
      return candidate.id === this.aiProfiles.get(player);
    });
    return Utils.getNonNullable(profile).name;
  }
  proposeAIToPlay() {
    return __async(this, null, function* () {
      this.cancelPendingAIMove();
      const currentPlayerIsHuman = (yield this.hasSelectedAI()) === false;
      yield this.setInteractive(currentPlayerIsHuman);
      this.cancelPendingAIMove();
      if (currentPlayerIsHuman === false) {
        const playingAI = this.getPlayingAI();
        if (playingAI.isPresent()) {
          this.aiTimeout = MGPOptional.of(setTimeout(() => __async(this, null, function* () {
            this.aiTimeout = MGPOptional.empty();
            const config = this.getConfig();
            const node = this.gameComponent.node();
            const gameIsOngoing = this.gameComponent.rules.getGameStatus(node, config) === GameStatus.ONGOING;
            if (gameIsOngoing) {
              yield this.doAIMove(playingAI.get().ai, playingAI.get().options);
            }
          }), LocalGameWrapperComponent_1.AI_TIMEOUT));
        }
      }
    });
  }
  cancelPendingAIMove() {
    if (this.aiTimeout.isPresent()) {
      window.clearTimeout(this.aiTimeout.get());
      this.aiTimeout = MGPOptional.empty();
    }
  }
  ngOnDestroy() {
    this.cancelPendingAIMove();
  }
  /**
   * @returns false if the game is finished
   *          false if no AI is selected
   *          true if an AI is selected even if its option is not selected yet
   */
  hasSelectedAI() {
    return __async(this, null, function* () {
      const config = this.getConfig();
      if (this.gameComponent.rules.getGameStatus(this.gameComponent.node(), config).isEndGame) {
        return false;
      }
      const player = this.gameComponent.getCurrentPlayer();
      return this.playerSelection.get(player) !== "human";
    });
  }
  lastMoveWasAI() {
    const opponent = this.gameComponent.getCurrentOpponent();
    return this.playerSelection.get(opponent) !== "human";
  }
  getPlayingAI() {
    return this.getAI(this.gameComponent.getCurrentPlayer());
  }
  getOpponentAI() {
    return this.getAI(this.gameComponent.getCurrentOpponent());
  }
  getAI(player) {
    const strategy = this.playerSelection.get(player);
    if (strategy === "human") {
      return MGPOptional.empty();
    }
    const profileId = this.aiProfiles.get(player);
    const optionName = this.aiOptions.get(player);
    const options = MGPOptional.ofNullable(this.availableAIOptions(player).find((option) => option.name === optionName));
    if (options.isAbsent()) {
      return MGPOptional.empty();
    }
    switch (strategy) {
      case "minimax":
        return this.getMinimaxConfig(profileId).map((config) => {
          const minimax = this.createMinimax(config);
          return { ai: minimax, options: options.get() };
        });
      case "iterative-deepening":
        return this.getMinimaxConfig(profileId).map((config) => {
          return { ai: this.createIterativeMinimax(config), options: options.get() };
        });
      case "mcts":
        return this.getMCTSConfig(profileId).map((config) => {
          const mcts = this.createMCTS(config);
          return { ai: mcts, options: options.get() };
        });
    }
  }
  getMinimaxConfig(id) {
    return MGPOptional.ofNullable(this.getMinimaxConfigs().find((config) => {
      return config.id === id;
    }));
  }
  getMCTSConfig(id) {
    return MGPOptional.ofNullable(this.getMCTSConfigs().find((config) => {
      return config.id === id;
    }));
  }
  getMinimaxConfigs() {
    return this.gameComponent.aiConfig.minimax;
  }
  createMinimax(config) {
    return this.aiInstances.getOrCreate(config, "minimax", () => {
      return createMinimaxFromConfig(this.gameComponent.rules, config);
    });
  }
  createIterativeMinimax(config) {
    return this.aiInstances.getOrCreate(config, "iterative-deepening", () => {
      return createIterativeDeepeningMinimaxFromConfig(this.gameComponent.rules, config);
    });
  }
  getMCTSConfigs() {
    return this.gameComponent.aiConfig.mcts;
  }
  createMCTS(config) {
    return this.aiInstances.getOrCreate(config, "mcts", () => {
      return createMCTSFromConfig(this.gameComponent.rules, config);
    });
  }
  doAIMove(playingAI, options) {
    return __async(this, null, function* () {
      const ruler = this.gameComponent.rules;
      const config = this.getConfig();
      const gameStatus = ruler.getGameStatus(this.gameComponent.node(), config);
      Utils.assert(gameStatus === GameStatus.ONGOING, "AI should not try to play when game is over!");
      const aiMove = playingAI.chooseNextMove(this.gameComponent.node(), options, config);
      const nextNode = ruler.choose(this.gameComponent.node(), aiMove, config);
      if (nextNode.isSuccess()) {
        this.gameComponent.hideLastMove();
        this.gameComponent.node.set(nextNode.get());
        yield this.applyNewMove();
        return MGPValidation.SUCCESS;
      } else {
        return this.handleAIError(playingAI, aiMove, nextNode.getReason());
      }
    });
  }
  applyNewMove() {
    return __async(this, null, function* () {
      const lastMoveWasAI = this.lastMoveWasAI();
      yield this.showNewMove(lastMoveWasAI);
      yield this.updateWrapper();
      yield this.proposeAIToPlay();
      this.cdr.detectChanges();
    });
  }
  handleAIError(playingAI, illegalMove, error) {
    return __async(this, null, function* () {
      this.messageDisplayer.criticalMessage($localize`The AI chose an illegal move! This is an unexpected situation that we logged, we will try to solve this as soon as possible. In the meantime, consider that you won!`);
      return Utils.logError("LocalGameWrapper", "AI chose illegal move", {
        game: this.getGameUrlName(),
        name: playingAI.name,
        move: illegalMove.toString(),
        reason: error
      });
    });
  }
  availableAIOptions(player) {
    switch (this.playerSelection.get(player)) {
      case "minimax":
        return this.depthOptions();
      case "iterative-deepening":
      case "mcts":
        return this.timeOptions();
      case "human":
        return [];
    }
  }
  availableAIStrategies() {
    const strategies = [];
    if (this.getMinimaxConfigs().length > 0) {
      strategies.push({ id: "minimax", name: $localize`Minimax` });
      strategies.push({ id: "iterative-deepening", name: $localize`Iterative deepening` });
    }
    if (this.getMCTSConfigs().length > 0) {
      strategies.push({ id: "mcts", name: $localize`MCTS` });
    }
    return strategies;
  }
  availableAIProfiles(player) {
    switch (this.playerSelection.get(player)) {
      case "minimax":
      case "iterative-deepening":
        return this.getMinimaxConfigs();
      case "mcts":
        return this.getMCTSConfigs();
      case "human":
        return [];
    }
  }
  depthOptions() {
    const options = [];
    for (let i = 1; i < 10; i++) {
      options.push({ name: `Level ${i}`, maxDepth: i });
    }
    return options;
  }
  timeOptions() {
    const options = [];
    for (let i = 1; i < 10; i++) {
      options.push({ name: `${i * i} seconds`, maxSeconds: i * i });
    }
    return options;
  }
  canTakeBack() {
    if (this.players.get(Player.ZERO).equalsValue("human")) {
      return this.gameComponent.getTurn() > 0;
    } else if (this.players.get(Player.ONE).equalsValue("human")) {
      return this.gameComponent.getTurn() > 1;
    } else {
      return false;
    }
  }
  takeBack() {
    return __async(this, null, function* () {
      let oldNode = this.gameComponent.node();
      this.gameComponent.node.set(oldNode.parent.get());
      if (this.isTurnOfPlayingAI()) {
        Utils.assert(this.gameComponent.node().parent.isPresent(), "Cannot take back in first turn when AI is Player.ZERO");
        oldNode = this.gameComponent.node();
        this.gameComponent.node.set(oldNode.parent.get());
      }
      yield this.showCurrentState(false);
    });
  }
  isTurnOfPlayingAI() {
    return this.getPlayingAI().isPresent();
  }
  restartGame() {
    return __async(this, null, function* () {
      const config = this.getConfig();
      this.gameComponent.node.set(this.gameComponent.rules.getInitialNode(config));
      this.gameComponent.cancelMoveAttempt();
      this.gameComponent.hideLastMove();
      yield this.gameComponent.updateBoardAndRedraw(false);
      this.endGame = false;
      this.winnerMessage = MGPOptional.empty();
      yield this.proposeAIToPlay();
    });
  }
  getPlayer() {
    return "human";
  }
  onCancelMove(reason) {
    return __async(this, null, function* () {
      yield __superGet(_a.prototype, this, "onCancelMove").call(this, reason);
      if (this.gameComponent.node().previousMove.isPresent()) {
        yield this.gameComponent.showLastMoveAndRedraw();
      }
    });
  }
  getConfig() {
    return this.rulesConfig;
  }
  displayAIInfo() {
    return localStorage.getItem("displayAIInfo") === "true";
  }
  viewTreeFromCurrentNode() {
    this.viewTreeFrom(this.gameComponent.node());
  }
  viewTreeFromPreviousNode() {
    this.viewTreeFrom(this.gameComponent.node().parent.get());
  }
  viewTreeFrom(node) {
    const opponentAI = this.getOpponentAI();
    function mctsLabel(nodeToLabel) {
      if (opponentAI.isPresent() && opponentAI.get().ai instanceof MCTS) {
        const mcts = opponentAI.get().ai;
        const wins = mcts.getCounterFromCache(nodeToLabel, "wins");
        const simulations = mcts.getCounterFromCache(nodeToLabel, "simulations");
        return `${wins}/${simulations} = ${Math.round(wins / simulations * 100)}%`;
      } else {
        return "";
      }
    }
    const maxDepth = Number(localStorage.getItem("tree-depth") ?? "2");
    const result = node.showDot(this.gameComponent.rules, this.rulesConfig, mctsLabel, maxDepth);
    window.open("https://dreampuf.github.io/GraphvizOnline/#" + encodeURI(result.dot));
  }
}, LocalGameWrapperComponent_1 = _a, __publicField(_a, "AI_TIMEOUT", 1500), __publicField(_a, "\u0275fac", function LocalGameWrapperComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _a)();
}), __publicField(_a, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _a, selectors: [["app-local-game-wrapper"]], features: [\u0275\u0275InheritDefinitionFeature], decls: 1, vars: 1, consts: () => {
  let i18n_0;
  if (false) {
    const MSG_EXTERNAL_7339426552397711569$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_0 = goog.getMsg("Turn n\xB0{$interpolation}", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ gameComponent.getTurn() + 1 }}" } });
    i18n_0 = MSG_EXTERNAL_7339426552397711569$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_0;
  } else {
    i18n_0 = $localize`Turn n°${"\uFFFD0\uFFFD"}:INTERPOLATION:`;
  }
  let i18n_1;
  if (false) {
    const MSG_EXTERNAL_2981217201452500939$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_1 = goog.getMsg("Start a new game");
    i18n_1 = MSG_EXTERNAL_2981217201452500939$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_1;
  } else {
    i18n_1 = $localize`Start a new game`;
  }
  let i18n_2;
  if (false) {
    const MSG_EXTERNAL_8647687729200262691$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_2 = goog.getMsg("Draw");
    i18n_2 = MSG_EXTERNAL_8647687729200262691$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_2;
  } else {
    i18n_2 = $localize`Draw`;
  }
  let i18n_3;
  if (false) {
    const MSG_EXTERNAL_8534758003292610735$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_3 = goog.getMsg("Player {$interpolation}", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ player.getValue()+1 }}" } });
    i18n_3 = MSG_EXTERNAL_8534758003292610735$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_3;
  } else {
    i18n_3 = $localize`Player ${"\uFFFD0\uFFFD"}:INTERPOLATION:`;
  }
  let i18n_4;
  if (false) {
    const MSG_EXTERNAL_7800061171704298797$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_4 = goog.getMsg("Human");
    i18n_4 = MSG_EXTERNAL_7800061171704298797$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_4;
  } else {
    i18n_4 = $localize`Human`;
  }
  let i18n_5;
  if (false) {
    const MSG_EXTERNAL_3307352846832849992$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_5 = goog.getMsg("Pick the profile");
    i18n_5 = MSG_EXTERNAL_3307352846832849992$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_5;
  } else {
    i18n_5 = $localize`Pick the profile`;
  }
  let i18n_6;
  if (false) {
    const MSG_EXTERNAL_3795472118461355324$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_6 = goog.getMsg("Pick the options");
    i18n_6 = MSG_EXTERNAL_3795472118461355324$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_6;
  } else {
    i18n_6 = $localize`Pick the options`;
  }
  let i18n_7;
  if (false) {
    const MSG_EXTERNAL_6267418979719843573$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_7 = goog.getMsg("Pass a turn");
    i18n_7 = MSG_EXTERNAL_6267418979719843573$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_7;
  } else {
    i18n_7 = $localize`Pass a turn`;
  }
  let i18n_8;
  if (false) {
    const MSG_EXTERNAL_6128115494237258310$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_8 = goog.getMsg("Take back move");
    i18n_8 = MSG_EXTERNAL_6128115494237258310$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_8;
  } else {
    i18n_8 = $localize`Take back move`;
  }
  return [["board", ""], i18n_0, i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, i18n_8, [1, "columns", "is-vcentered", "is-align-items-stretch"], [1, "column", "is-one-quarter", "has-text-centered"], ["id", "infos", 1, "box", "is-fullheight"], [1, "column"], ["id", "board-highlight", 1, "p-5", "is-fullheight", 3, "ngClass"], ["id", "board", 1, "box", "is-fullheight"], [3, "rulesConfig", "rulesConfigDescription", "gameName"], [1, "subtitle"], ["id", "game-result", 1, "block"], [1, "px-2", "py-4", "mb-4", 3, "ngClass"], ["id", "pass-button", 1, "button", "is-primary", "is-fullwidth", "mb-1"], ["id", "take-back", 1, "button", "is-fullwidth", "mb-1"], ["id", "restart-button", 1, "button", "is-fullwidth", 3, "click"], ["id", "winner", 1, "title"], ["id", "draw", 1, "title"], [1, "mb-2", "subtitle", 3, "ngClass"], [1, "select", "is-fullwidth"], [3, "ngModelChange", "id", "ngModel"], ["selected", "", "value", "human", 3, "id"], [3, "id", "value"], [3, "id", "ngClass"], ["selected", "", "value", "none"], ["id", "pass-button", 1, "button", "is-primary", "is-fullwidth", "mb-1", 3, "click"], ["id", "take-back", 1, "button", "is-fullwidth", "mb-1", 3, "click"], ["id", "viewTreeFromCurrentNode", 1, "button", "is-medium", "is-fullwidth", "is-primary", "mb-1", 3, "click"], ["id", "viewTreeFromPreviousNode", 1, "button", "is-medium", "is-fullwidth", "is-primary", "mb-1", 3, "click"], ["id", "ai-info"]];
}, template: function LocalGameWrapperComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, LocalGameWrapperComponent_Conditional_0_Template, 8, 2, "div", 10);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.getGameName().isPresent() ? 0 : -1);
  }
}, dependencies: [ViewConfigComponent, NgClass, ReactiveFormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, FormsModule, NgModel], encapsulation: 2, changeDetection: 0 })), _a);
LocalGameWrapperComponent = LocalGameWrapperComponent_1 = __decorate([
  Debug.log
], LocalGameWrapperComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalGameWrapperComponent, [{
    type: Component,
    args: [{ selector: "app-local-game-wrapper", changeDetection: ChangeDetectionStrategy.OnPush, imports: [ViewConfigComponent, NgClass, ReactiveFormsModule, FormsModule], template: `@if (getGameName().isPresent()) {
    <div class="columns is-vcentered is-align-items-stretch">
        <div class="column is-one-quarter has-text-centered">
            @if (gameComponent) {
                <div id="infos"
                     class="box is-fullheight">
                    <app-view-config [rulesConfig]="rulesConfig"
                                     [rulesConfigDescription]="getRulesConfigDescription()"
                                     [gameName]="getGameName().getOrElse('')">
                    </app-view-config>
                    <p class="subtitle"
                       i18n>Turn n\xB0{{ gameComponent.getTurn() + 1 }}</p>
                    @if (endGame) {
                        <div id="game-result"
                             class="block">
                            @if (winnerMessage.isPresent()) {
                                <p id="winner"
                                   class="title">{{ winnerMessage.get() }}</p>
                            }
                            @if (winnerMessage.isAbsent()) {
                                <p id="draw"
                                   class="title"
                                   i18n>Draw</p>
                            }
                        </div>
                    }
                    @for (player of Player.PLAYERS; track player.getValue()) {
                        <div class="px-2 py-4 mb-4"
                             [ngClass]="player.getHTMLClass('-bg')">
                            <p class="mb-2 subtitle"
                               [ngClass]="player.getHTMLClass('-fg')"
                               i18n>Player {{ player.getValue()+1 }}</p>
                            <div class="select is-fullwidth">
                                <select id="player-select-{{ player.getValue() }}"
                                        [ngModel]="getPlayerSelection(player)"
                                        (ngModelChange)="onPlayerSelectionChange(player, $event)">
                                    <option selected
                                            id="player-{{ player.getValue() }}-human"
                                            value="human"
                                            i18n>Human</option>
                                    @for (strategy of availableAIStrategies(); track strategy.id) {
                                        <option id="player-{{ player.getValue() }}-ai-{{ strategy.id }}"
                                                [value]="strategy.id">{{ strategy.name }}</option>
                                    }
                                </select>
                            </div>
                            @if (mustSelectAIProfile(player)) {
                                <div class="select is-fullwidth">
                                    <select id="ai-profile-select-{{ player.getValue() }}"
                                            [ngModel]="getAIProfile(player)"
                                            (ngModelChange)="onAIProfileChange(player, $event)">
                                        <option selected
                                                value="none"
                                                i18n>Pick the profile</option>
                                        @for (profile of availableAIProfiles(player); track profile.id) {
                                            <option id="player-{{ player.getValue() }}-profile-{{ profile.id }}"
                                                    [value]="profile.id">{{ profile.name }}</option>
                                        }
                                    </select>
                                </div>
                            }
                            @if (players.get(player).equalsValue('human') === false && isAIProfileSelected(player)) {
                                <div class="select is-fullwidth">
                                    <select id="ai-option-select-{{ player.getValue() }}"
                                            [ngModel]="getAIOption(player)"
                                            (ngModelChange)="onAIOptionChange(player, $event)">
                                        <option selected
                                                value="none"
                                                i18n>Pick the options</option>
                                        @for (option of availableAIOptions(player); track option.name) {
                                            <option id="player-{{ player.getValue() }}-option-{{ option.name }}"
                                                    [value]="option.name">{{ option.name }}</option>
                                        }
                                    </select>
                                </div>
                            }
                            @if (gameComponent.hasScores()) {
                                <p id="score-{{ player.getValue() }}"
                                   [ngClass]="player.getHTMLClass('-fg')">{{ gameComponent.getScoreString(player) }}</p>
                            }
                        </div>
                    }
                    @if (endGame === false && gameComponent.canPass) {
                        <button id="pass-button"
                                class="button is-primary is-fullwidth mb-1"
                                (click)="gameComponent.pass()"
                                i18n>Pass a turn</button>
                    }
                    @if (canTakeBack()) {
                        <button id="take-back"
                                class="button is-fullwidth mb-1"
                                (click)="takeBack()"
                                i18n>Take back move</button>
                    }
                    <button id="restart-button"
                            class="button is-fullwidth"
                            (click)="restartGame()"
                            i18n>Start a new game</button>
                    @if (mustDisplayAIInfo()) {
                        <button id="viewTreeFromCurrentNode"
                                (click)="viewTreeFromCurrentNode()"
                                class="button is-medium is-fullwidth is-primary mb-1">
                            DOT from current node</button>
                        <button id="viewTreeFromPreviousNode"
                                (click)="viewTreeFromPreviousNode()"
                                class="button is-medium is-fullwidth is-primary mb-1">
                            DOT from previous node</button>
                        <div id="ai-info">
                            @for (info of getAIInfoLines(); track $index) {
                                {{ info }} <br/>
                            }
                            Created {{ getCreatedNodes() }} nodes.<br/>
                            Minimax times: {{ getMinimaxTimes() }}<br/>
                        </div>
                    }
                </div>
            }
        </div>
        <div class="column">
            <div class="p-5 is-fullheight"
                 id="board-highlight"
                 [ngClass]="getBoardHighlight()">
                <div id="board"
                     class="box is-fullheight">
                    <div #board></div>
                </div>
            </div>
        </div>
    </div>
}
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LocalGameWrapperComponent, { className: "LocalGameWrapperComponent", filePath: "src/app/components/wrapper-components/local-game-wrapper/local-game-wrapper.component.ts", lineNumber: 40 });
})();
export {
  LocalGameWrapperComponent
};
//# sourceMappingURL=local-game-wrapper.component-KCXTXFFV.js.map
