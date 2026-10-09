// lib/dist/Utils.js
var Utils = class _Utils {
  /**
   * The error logger is called in order to log errors when they arise.
   * It should be set by the codebase relying on this, for example by doing:
   * Utils.logError = myErrorLogger;
   */
  static logError = (_kind, message, _data) => {
    return MGPValidation.failure(message);
  };
  static expectToBe(value, expected, message) {
    if (value !== expected) {
      if (message !== void 0) {
        throw new Error(message);
      }
      throw new Error(`A default switch case did not observe the correct value, expected ${expected}, but got ${value} instead.`);
    }
  }
  static expectToBeMultiple(value, expectedValues) {
    for (const expected of expectedValues) {
      if (value === expected) {
        return;
      }
    }
    throw new Error(`A default switch case did not observe the correct value, expected a value among ${expectedValues}, but got ${value} instead.`);
  }
  static getNonNullable(value) {
    if (value == null) {
      throw new Error(`Expected value not to be null or undefined, but it was.`);
    } else {
      return value;
    }
  }
  static assert(condition, message, data) {
    if (condition === false) {
      _Utils.logError("Assertion failure", message, data);
      if (data === void 0) {
        throw new Error(`Assertion failure: ${message}`);
      } else {
        throw new Error(`Assertion failure: ${message} (${JSON.stringify(data)})`);
      }
    }
  }
  static identity(thing) {
    return thing;
  }
};

// lib/dist/Encoder.js
var Encoder = class _Encoder {
  static fromFunctions(toJSON, fromJSON) {
    return new class extends _Encoder {
      encode(value) {
        return toJSON(value);
      }
      decode(encoded) {
        return fromJSON(encoded);
      }
    }();
  }
  static identity() {
    function identity(x) {
      return x;
    }
    return _Encoder.fromFunctions(identity, identity);
  }
  static constant(constant, onlyValue) {
    return new class extends _Encoder {
      encode(_value) {
        return constant;
      }
      decode(_encoded) {
        return onlyValue;
      }
    }();
  }
  static tuple(encoders, encode, decode) {
    return new class extends _Encoder {
      encode(value) {
        const fields = encode(value);
        const encoded = {};
        Object.keys(fields).forEach((key) => {
          encoded[key] = encoders[key].encode(fields[key]);
        });
        return encoded;
      }
      decode(encoded) {
        const fields = {};
        Object.keys(encoders).forEach((key) => {
          const field = encoded[key];
          fields[key] = encoders[key].decode(field);
        });
        const actualFields = Object.keys(encoders).map((k) => fields[k]);
        return decode(actualFields);
      }
    }();
  }
  /**
   * This creates a "sum" encoder, i.e., it encodes values of either type T and U and V and ...
   */
  static disjunction(typePredicates, encoders) {
    Utils.assert(typePredicates.length === encoders.length, "typePredicates and encoders should have same length");
    return new class extends _Encoder {
      encode(value) {
        let indexClass = 0;
        for (const identifier of typePredicates) {
          if (identifier(value)) {
            return {
              type: indexClass,
              encoded: encoders[indexClass].encode(value)
            };
          }
          indexClass++;
        }
        throw new Error(`cannot encode value: ${value}`);
      }
      decode(encoded) {
        const type_ = Utils.getNonNullable(encoded)["type"];
        const content = Utils.getNonNullable(encoded)["encoded"];
        Utils.assert(type_ <= encoders.length, `Encoders.disjunction got invalid data: ${type_} is not an existing type`);
        return encoders[type_].decode(content);
      }
    }();
  }
  static list(encoder) {
    return new class extends _Encoder {
      encode(list) {
        return list.map((t) => {
          const encodedCoord = encoder.encode(t);
          Utils.assert(Array.isArray(encodedCoord) === false, "This encoder should not encode as array");
          return encodedCoord;
        });
      }
      decode(encoded) {
        Utils.assert(Array.isArray(encoded), `Encoders.list got invalid data ${encoded} is not an array`);
        const casted = encoded;
        return casted.map(encoder.decode);
      }
    }();
  }
};

// lib/dist/MGPOptional.js
var MGPOptional = class _MGPOptional {
  static of(value) {
    return new MGPOptionalPresent(value);
  }
  static ofNullable(value) {
    if (value == null) {
      return _MGPOptional.empty();
    } else {
      return _MGPOptional.of(value);
    }
  }
  static empty() {
    return new MGPOptionalAbsent();
  }
  /**
   * Encodes a MGPOptional<T> using an encoder of T.
   * It will use the same encoding as T, and use null to encode an empty optional.
   */
  static getEncoder(encoderT) {
    return new class extends Encoder {
      encode(opt) {
        if (opt.isPresent()) {
          return encoderT.encode(opt.get());
        } else {
          return null;
        }
      }
      decode(encoded) {
        if (encoded === null) {
          return _MGPOptional.empty();
        } else {
          return _MGPOptional.of(encoderT.decode(encoded));
        }
      }
    }();
  }
};
var MGPOptionalAbsent = class extends MGPOptional {
  isPresent() {
    return false;
  }
  isAbsent() {
    return true;
  }
  get() {
    throw new Error("Value is absent");
  }
  getOrElse(defaultValue) {
    return defaultValue;
  }
  orElse(other) {
    return other;
  }
  equals(other) {
    return other.isAbsent();
  }
  equalsValue(_other) {
    return false;
  }
  toString() {
    return "MGPOptional.empty()";
  }
  map(f) {
    return MGPOptional.empty();
  }
};
var MGPOptionalPresent = class extends MGPOptional {
  value;
  constructor(value) {
    super();
    this.value = value;
  }
  isPresent() {
    return true;
  }
  isAbsent() {
    return false;
  }
  get() {
    return this.value;
  }
  getOrElse(_defaultValue) {
    return this.value;
  }
  orElse(_other) {
    return this;
  }
  equals(other) {
    return other.isPresent() && this.equalsValue(other.get());
  }
  equalsValue(other) {
    return comparableEquals(other, this.value);
  }
  toString() {
    return `MGPOptional.of(${this.value})`;
  }
  map(f) {
    return MGPOptional.of(f(this.value));
  }
};

// lib/dist/JSON.js
function isJSONPrimitive(value) {
  if (typeof value === "string")
    return true;
  if (typeof value === "number")
    return true;
  if (typeof value === "boolean")
    return true;
  if (value === null)
    return true;
  return false;
}
var JSONParser = class _JSONParser {
  static toJSONValue(v) {
    if (isJSONPrimitive(v))
      return v;
    if (Array.isArray(v)) {
      const array = [];
      for (const item of v) {
        array.push(_JSONParser.toJSONValueWithoutArray(item));
      }
      return array;
    } else {
      return _JSONParser.toJSONObject(v);
    }
  }
  static toJSONObject(v) {
    const obj = {};
    for (const [key, value] of Object.entries(v)) {
      obj[key] = _JSONParser.toJSONValue(value);
    }
    return obj;
  }
  static toJSONValueWithoutArray(v) {
    if (isJSONPrimitive(v))
      return v;
    if (Array.isArray(v)) {
      throw Error(`this is array contained in another array, which is forbidden: ${v}`);
    } else {
      return _JSONParser.toJSONObject(v);
    }
  }
  // Try to parse a JSONValue and to return it. Fails with MGPOptional.empty otherwise.
  static parseJSONSafely(json) {
    try {
      return MGPOptional.of(_JSONParser.toJSONValue(JSON.parse(json)));
    } catch (e) {
      return MGPOptional.empty();
    }
  }
};

// lib/dist/Comparable.js
function comparableEqualsStrict(a, b) {
  if (a != null && b != null && typeof a === "object") {
    if (a.equals != null) {
      const comparableValue = a;
      const otherComparable = b;
      return comparableValue.equals(otherComparable);
    } else {
      const aJSON = a;
      const aKeys = Object.keys(a);
      const bJSON = b;
      const bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) {
        return false;
      }
      for (const key of aKeys) {
        if (key in bJSON) {
          if (comparableEqualsStrict(aJSON[key], bJSON[key]) === false) {
            return false;
          }
        } else {
          return false;
        }
      }
      return true;
    }
  } else {
    return a === b;
  }
}
function isComparableObject(value) {
  return typeof value === "object" && value != null && value["equals"] != null;
}
function isComparableJSON(value) {
  if (typeof value === "object") {
    if (value === null) {
      return false;
    }
    for (const key of Object.keys(value)) {
      if (value[key] != null && isComparableValue(value[key]) === false) {
        return false;
      }
    }
    return value.constructor.prototype === Object.prototype || Array.isArray(value);
  } else {
    return false;
  }
}
function isComparableValue(value) {
  return value == null || isComparableObject(value) || isJSONPrimitive(value) || isComparableJSON(value);
}
function comparableEquals(a, b) {
  if (isComparableValue(a) && isComparableValue(b)) {
    return comparableEqualsStrict(a, b);
  } else {
    throw new Error(`Comparing non comparable objects: ${a.constructor.name} and ${b.constructor.name}`);
  }
}

// lib/dist/MGPFallible.js
var MGPFallible = class {
  static success(value) {
    return new MGPFallibleSuccess(value);
  }
  static failure(reason) {
    return new MGPFallibleFailure(reason);
  }
  constructor() {
  }
  equals(other) {
    if (this.isFailure()) {
      return other.isFailure() && this.getReason() === other.getReason();
    }
    if (other.isFailure()) {
      return false;
    }
    return comparableEquals(this.get(), other.get());
  }
};
var MGPFallibleSuccess = class extends MGPFallible {
  value;
  __nominal;
  // For strict typing
  constructor(value) {
    super();
    this.value = value;
  }
  isSuccess() {
    return true;
  }
  isFailure() {
    return false;
  }
  get() {
    return this.value;
  }
  getReason() {
    throw new Error("Cannot get failure reason from a success");
  }
  getReasonOr(value) {
    return value;
  }
  toOptional() {
    return MGPOptional.of(this.value);
  }
  map(f) {
    return MGPFallible.success(f(this.value));
  }
  toString() {
    return `MGPFallible.success(${this.value})`;
  }
};
var MGPFallibleFailure = class extends MGPFallible {
  reason;
  __nominal;
  // For strict typing
  constructor(reason) {
    super();
    this.reason = reason;
  }
  isSuccess() {
    return false;
  }
  isFailure() {
    return true;
  }
  get() {
    throw new Error("Value is absent from failure, with the following reason: " + this.reason);
  }
  getReason() {
    return this.reason;
  }
  getReasonOr(_value) {
    return this.getReason();
  }
  toOptional() {
    return MGPOptional.empty();
  }
  map(f) {
    return this.toOtherFallible();
  }
  toString() {
    return `MGPFallible.failure(${this.reason})`;
  }
  toOtherFallible() {
    return MGPFallible.failure(this.reason);
  }
};

// lib/dist/MGPValidation.js
var MGPValidation;
(function(MGPValidation2) {
  MGPValidation2.SUCCESS = MGPFallible.success(void 0);
  function ofFallible(fallible) {
    if (fallible.isSuccess()) {
      return MGPValidation2.SUCCESS;
    } else {
      return MGPValidation2.failure(fallible.getReason());
    }
  }
  MGPValidation2.ofFallible = ofFallible;
  function failure(reason) {
    return MGPFallible.failure(reason);
  }
  MGPValidation2.failure = failure;
})(MGPValidation || (MGPValidation = {}));

// lib/dist/ArrayUtils.js
var ArrayUtils = class _ArrayUtils {
  /**
   * Create an array of size width containing initValue.
   * Watch out: initValue is repeated without copy,
   * so if it is an object that will be mutated,
   * it will also change the values of all fields.
   * General rule: don't mutate objects stored in such arrays.
   */
  static create(width, initValue) {
    const array = [];
    for (let x = 0; x < width; x++) {
      array.push(initValue);
    }
    return array;
  }
  static copy(array) {
    return array.map((t) => t);
  }
  static sortByDescending(array, by) {
    array.sort((t1, t2) => {
      const v1 = by(t1);
      const v2 = by(t2);
      if (v1 < v2) {
        return 1;
      } else if (v1 > v2) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  static equals(t1, t2) {
    if (t1.length !== t2.length) {
      return false;
    }
    for (let i = 0; i < t1.length; i++) {
      if (comparableEquals(t1[i], t2[i]) === false)
        return false;
    }
    return true;
  }
  static isPrefix(prefix, list) {
    if (prefix.length > list.length)
      return false;
    return _ArrayUtils.equals(prefix, list.slice(0, prefix.length));
  }
  /**
   * range(n) returns the list [0, 1, 2, ..., n-1]
   * Enables doing *ngFor="let x in ArrayUtils.range(5)" in an Angular template
   */
  static range(n) {
    const range = [];
    for (let i = 0; i < n; i++) {
      range.push(i);
    }
    return range;
  }
  /**
   * A method that can be used to sort an array with the smallest number first with xs.sort(ArrayUtils.smallerFirst);
   */
  static smallerFirst(a, b) {
    return a - b;
  }
  /**
   * Gets a random element from an array.
   * Throws if the array is empty.
   * Does not use a cryptographically secure random selection.
   */
  static getRandomElement(array) {
    Utils.assert(array.length > 0, "ArrayUtils.getRandomElement must be called on an array containing elements");
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  /**
   * Gets the maximum elements of an array, according to a given metric.
   * Returns an array containing all the maximal values
   */
  static maximumsBy(array, metric) {
    let maximums = [];
    let maxMetricValue = Number.NEGATIVE_INFINITY;
    for (const element of array) {
      const currentMetricValue = metric(element);
      if (currentMetricValue >= maxMetricValue) {
        if (currentMetricValue > maxMetricValue) {
          maximums = [];
        }
        maxMetricValue = currentMetricValue;
        maximums.push(element);
      }
    }
    return maximums;
  }
  /**
   * Counts the number of element in an array that have the provided value
   */
  static count(array, value) {
    return _ArrayUtils.countByPredicate(array, (element) => comparableEquals(element, value));
  }
  static countByPredicate(array, predicate) {
    let total = 0;
    for (const element of array) {
      if (predicate(element)) {
        total++;
      }
    }
    return total;
  }
  static contains(array, value) {
    for (const element of array) {
      if (comparableEquals(value, element)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Check whether the first argument is strictly smaller than the second, element-wise
   */
  static isLessThan(inferior, superior) {
    Utils.assert(inferior.length > 0 && superior.length > 0, "ArrayUtils.isLessThan/isGreaterThan should have two non-empty list as parameter");
    const maximumIndex = Math.min(inferior.length, superior.length);
    for (let i = 0; i < maximumIndex; i++) {
      if (superior[i] !== inferior[i]) {
        return inferior[i] < superior[i];
      }
    }
    return false;
  }
  /**
   * Check whether the first argument is strictly greater than the second, element-wise.
   */
  static isGreaterThan(superior, inferior) {
    return _ArrayUtils.isLessThan(inferior, superior);
  }
  /**
   * Return the minimal array (comparing element-wise) between two arrays.
   */
  static min(left, right) {
    if (_ArrayUtils.isLessThan(left, right)) {
      return left;
    } else {
      return right;
    }
  }
  /**
   * Return the maximal array (comparing element-wise) between two arrays.
   */
  static max(left, right) {
    if (_ArrayUtils.isGreaterThan(left, right)) {
      return left;
    } else {
      return right;
    }
  }
  static map(list, mapper) {
    const result = [];
    for (const element of list) {
      result.push(mapper(element));
    }
    return result;
  }
};

// lib/dist/Sets.js
var Sets = class {
  static toComparableSet(list) {
    const result = [];
    list.forEach((other) => {
      if (result.some((el) => comparableEquals(el, other)) === false) {
        result.push(other);
      }
    });
    return result;
  }
};

// lib/dist/Set.js
var Set = class _Set {
  values;
  constructor(values) {
    if (values === void 0) {
      this.values = [];
    } else {
      this.values = Sets.toComparableSet(values);
    }
  }
  provideInstance(values) {
    const { constructor } = Object.getPrototypeOf(this);
    return new constructor(values);
  }
  equals(other) {
    if (other.size() !== this.size()) {
      return false;
    }
    for (const coord of this) {
      if (other.contains(coord) === false) {
        return false;
      }
    }
    return true;
  }
  size() {
    return this.values.length;
  }
  toString() {
    const result = ArrayUtils.map(this.values, (v) => {
      if (v == null) {
        return "null";
      } else {
        return v.toString();
      }
    });
    return "[" + result.join(", ") + "]";
  }
  contains(element) {
    return ArrayUtils.contains(this.values, element);
  }
  toList() {
    return ArrayUtils.copy(this.values);
  }
  getAnyElement() {
    if (this.size() > 0) {
      return MGPOptional.of(this.values[0]);
    } else {
      return MGPOptional.empty();
    }
  }
  isEmpty() {
    return this.values.length === 0;
  }
  hasElements() {
    return this.isEmpty() === false;
  }
  findAnyCommonElement(other) {
    for (const element of other) {
      if (this.contains(element)) {
        return MGPOptional.of(element);
      }
    }
    return MGPOptional.empty();
  }
  /**
   * @param other the "reference" set
   * @returns an empty optional is nothing miss in this set; the first element missing as an optional if there is one
   */
  getMissingElementFrom(other) {
    for (const element of other) {
      if (this.contains(element) === false) {
        return MGPOptional.of(element);
      }
    }
    return MGPOptional.empty();
  }
  [Symbol.iterator]() {
    return this.values.values();
  }
  union(otherSet) {
    const values = this.toList().concat(otherSet.toList());
    return this.provideInstance(values);
  }
  unionList(list) {
    return this.provideInstance(list.concat(this.values));
  }
  addElement(element) {
    return this.provideInstance(this.values.concat([element]));
  }
  filter(f) {
    return this.provideInstance(this.toList().filter(f));
  }
  removeElement(element) {
    return this.filter((e) => comparableEquals(e, element) === false);
  }
  map(mapper) {
    const result = ArrayUtils.map(this.values, mapper);
    return new _Set(result);
  }
  flatMap(f) {
    let result = new _Set();
    for (const element of this) {
      result = result.union(f(element));
    }
    return result;
  }
  intersection(other) {
    let result = this.provideInstance();
    for (const element of other) {
      if (this.contains(element)) {
        result = result.addElement(element);
      }
    }
    return result;
  }
};

// lib/dist/MGPMap.js
var MGPMap = class _MGPMap {
  map;
  isImmutable;
  static from(record) {
    const keys = Object.keys(record);
    const map = new _MGPMap();
    for (const key of keys) {
      map.set(key, record[key]);
    }
    return map;
  }
  constructor(map = [], isImmutable = false) {
    this.map = map;
    this.isImmutable = isImmutable;
  }
  makeImmutable() {
    this.isImmutable = true;
  }
  get(key) {
    for (const keymap of this.map) {
      if (comparableEquals(keymap.key, key)) {
        return MGPOptional.of(keymap.value);
      }
    }
    return MGPOptional.empty();
  }
  getAnyPair() {
    if (this.size() > 0) {
      return MGPOptional.of(this.map[0]);
    } else {
      return MGPOptional.empty();
    }
  }
  [Symbol.iterator]() {
    const entries = this.map;
    let index = 0;
    return {
      /* istanbul ignore next */
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (index < entries.length) {
          const entry = entries[index];
          index += 1;
          return { value: [entry.key, entry.value], done: false };
        }
        return { value: void 0, done: true };
      }
    };
  }
  clear() {
    this.assertImmutability("clear");
    this.map = [];
  }
  putAll(m) {
    this.assertImmutability("putAll");
    for (const entry of m.map) {
      this.put(entry.key, entry.value);
    }
  }
  assertImmutability(methodCalled) {
    Utils.assert(this.isImmutable === false, "Cannot call " + methodCalled + " on immutable map!");
  }
  put(key, value) {
    this.assertImmutability("put");
    for (const entry of this.map) {
      if (comparableEquals(entry.key, key)) {
        const oldValue = entry.value;
        entry.value = value;
        return MGPOptional.of(oldValue);
      }
    }
    this.map.push({ key, value });
    return MGPOptional.empty();
  }
  containsKey(key) {
    return this.map.some((entry) => comparableEquals(entry.key, key));
  }
  size() {
    return this.map.length;
  }
  getKeyList() {
    return this.map.map((entry) => entry.key);
  }
  getValueList() {
    return this.map.map((entry) => entry.value);
  }
  getKeySet() {
    return new Set(this.getKeyList());
  }
  filter(predicate) {
    const filtered = new _MGPMap();
    for (const keyValue of this.map) {
      if (predicate(keyValue.key, keyValue.value)) {
        filtered.set(keyValue.key, keyValue.value);
      }
    }
    return filtered;
  }
  replace(key, newValue) {
    this.assertImmutability("replace");
    const oldValue = this.get(key);
    if (oldValue.isAbsent()) {
      throw new Error("No Value to replace for key " + key.toString() + "!");
    } else {
      this.put(key, newValue);
      return newValue;
    }
  }
  set(key, firstValue) {
    this.assertImmutability("set");
    if (this.containsKey(key)) {
      throw new Error("Key " + key.toString() + " already exists in map!");
    } else {
      this.map.push({ key, value: firstValue });
    }
  }
  delete(key) {
    this.assertImmutability("delete");
    for (let i = 0; i < this.map.length; i++) {
      const entry = this.map[i];
      if (comparableEquals(entry.key, key)) {
        const oldValue = this.map[i].value;
        const beforeDeleted = this.map.slice(0, i);
        const afterDeleted = this.map.slice(i + 1);
        this.map = beforeDeleted.concat(afterDeleted);
        return oldValue;
      }
    }
    throw new Error('No value to delete for key "' + key.toString() + '"!');
  }
  getCopy() {
    const newMap = new this.constructor();
    for (const key of this.getKeyList()) {
      newMap.set(key, this.get(key).get());
    }
    return newMap;
  }
  equals(other) {
    const thisKeySet = this.getKeySet();
    const otherKeySet = other.getKeySet();
    if (thisKeySet.equals(otherKeySet) === false) {
      return false;
    }
    for (const key of thisKeySet) {
      const thisValue = this.get(key).get();
      const otherValue = other.get(key);
      Utils.assert(otherValue.isPresent(), "value is absent in a map even though its key is present!");
      if (comparableEquals(thisValue, otherValue.get()) === false) {
        return false;
      }
    }
    return true;
  }
};

// lib/dist/Combinatorics.js
var Combinatorics = class {
  static getCombinations(elements, size) {
    Utils.assert(size <= elements.length, "cannot compute combinations for less elements than needed");
    return this.getSubsetsOfSize(elements, size).map((subset) => {
      return this.getPermutations(subset);
    }).reduce((accumulator, combinations) => {
      return accumulator.concat(combinations);
    });
  }
  static getPermutations(elements) {
    const length = elements.length;
    const result = [elements.slice()];
    const c = new Array(length).fill(0);
    let i = 1;
    while (i < length) {
      if (c[i] < i) {
        const k = i % 2 && c[i];
        const element = elements[i];
        elements[i] = elements[k];
        elements[k] = element;
        ++c[i];
        i = 1;
        result.push(elements.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }
  static getSubsetsOfSize(elements, size) {
    function subsets(length, start) {
      if (elements.length <= start || length < 1) {
        return [[]];
      } else {
        const results = [];
        while (start <= elements.length - length) {
          const first = elements[start];
          for (const subset of subsets(length - 1, start + 1)) {
            subset.push(first);
            results.push(subset);
          }
          ++start;
        }
        return results;
      }
    }
    return subsets(size, 0);
  }
};

// lib/dist/MathUtils.js
var MathUtils = class _MathUtils {
  /**
   * Returns the greatest common divisor between two numbers a and b.
   * Uses the euclidean algorithm. Negative inputs are supported.
   */
  static gcd(a, b) {
    if (b === 0) {
      return Math.abs(a);
    } else {
      return _MathUtils.gcd(b, a % b);
    }
  }
};

// lib/dist/ReversibleMap.js
var ReversibleMap = class _ReversibleMap extends MGPMap {
  reverse() {
    const reversedMap = new _ReversibleMap();
    for (const key of this.getKeyList()) {
      const value = this.get(key).get();
      if (reversedMap.containsKey(value)) {
        const newSet = reversedMap.get(value).get().addElement(key);
        reversedMap.put(value, newSet);
      } else {
        const newSet = new Set([key]);
        reversedMap.set(value, newSet);
      }
    }
    return reversedMap;
  }
};

// lib/dist/MGPUniqueList.js
var MGPUniqueList = class extends Set {
  equals(other) {
    if (other.size() !== this.size()) {
      return false;
    }
    for (let i = 0; i < this.size(); i++) {
      const otherValue = other.get(i);
      const thisValue = this.get(i);
      if (comparableEquals(otherValue, thisValue) === false) {
        return false;
      }
    }
    return true;
  }
  get(index) {
    Utils.assert(index < this.values.length, "MGPUniqueList: index out of bounds: " + index);
    return this.values[index];
  }
  /**
    * Get element starting to count from the end (0 for the last)
    * @param index the index of the element to fetch, starting from the end (0 as last)
    */
  getFromEnd(index) {
    Utils.assert(index < this.values.length, "MGPUniqueList: index (from end) out of bounds: " + index);
    const lastIndex = this.values.length - 1;
    return this.get(lastIndex - index);
  }
};

// lib/dist/NumberMap.js
var NumberMap = class extends MGPMap {
  add(key, value) {
    const oldValue = this.get(key);
    Utils.assert(oldValue.isPresent(), `NumberMap.add called on an invalid key: ${key}`);
    return this.put(key, oldValue.get() + value);
  }
  addOrSet(key, value) {
    if (this.containsKey(key)) {
      return this.add(key, value);
    } else {
      this.set(key, value);
      return MGPOptional.of(value);
    }
  }
};

// lib/dist/OptimizedSet.js
var OptimizedSet = class extends Set {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueMap;
  constructor(values) {
    super();
    this.valueMap = [];
    this.values = [];
    if (values !== void 0) {
      for (const value of values) {
        this.add(value);
      }
    }
  }
  add(element) {
    const fields = this.toFields(element);
    let indirection = this.valueMap;
    for (const field of fields[0]) {
      if (indirection[field] === void 0) {
        indirection[field] = [];
      }
      indirection = indirection[field];
    }
    const finalField = fields[1];
    if (indirection[finalField] === void 0) {
      indirection[finalField] = true;
      this.values.push(element);
      return true;
    } else {
      return false;
    }
  }
  contains(element) {
    const fields = this.toFields(element);
    let indirection = this.valueMap;
    for (const field of fields[0]) {
      if (indirection[field] === void 0) {
        return false;
      }
      indirection = indirection[field];
    }
    const finalField = fields[1];
    return indirection[finalField] !== void 0;
  }
  [Symbol.iterator]() {
    return this.values.values();
  }
};

// lib/dist/TimeUtils.js
var TimeUtils = class {
  static sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
};

// games/dist/jscaip/AI/AI.js
var MoveGenerator = class {
};
var AIStats = class {
  static aiTime = /* @__PURE__ */ new Map();
};

// games/dist/jscaip/Player.js
var PlayerNone = class _PlayerNone {
  static NONE = new _PlayerNone();
  value = 2;
  constructor() {
  }
  isPlayer() {
    return false;
  }
  isNone() {
    return true;
  }
  toString() {
    return "PLAYER_NONE";
  }
  equals(other) {
    return this === other;
  }
  getValue() {
    return this.value;
  }
};
var Player = class _Player {
  value;
  static ZERO = new _Player(0);
  static ONE = new _Player(1);
  static PLAYERS = [_Player.ZERO, _Player.ONE];
  static encoder = Encoder.tuple([Encoder.identity()], (player) => [player.getValue()], (fields) => _Player.of(fields[0]));
  static of(value) {
    switch (value) {
      case 0:
        return _Player.ZERO;
      default:
        Utils.expectToBe(value, 1);
        return _Player.ONE;
    }
  }
  static ofTurn(turn) {
    return turn % 2 === 0 ? _Player.ZERO : _Player.ONE;
  }
  constructor(value) {
    this.value = value;
  }
  isPlayer() {
    return true;
  }
  isNone() {
    return false;
  }
  toString() {
    switch (this) {
      case _Player.ZERO:
        return "PLAYER_ZERO";
      default:
        Utils.expectToBe(this, _Player.ONE, "Player should not be something else than Player.ZERO and Player.ONE");
        return "PLAYER_ONE";
    }
  }
  equals(other) {
    return this === other;
  }
  getScoreModifier() {
    if (this.value === 0) {
      return -1;
    } else {
      return 1;
    }
  }
  getYDirection() {
    return this.getScoreModifier();
  }
  getOpponent() {
    switch (this) {
      case _Player.ZERO:
        return _Player.ONE;
      default:
        Utils.expectToBe(this, _Player.ONE);
        return _Player.ZERO;
    }
  }
  getValue() {
    return this.value;
  }
  getHTMLClass(postfix) {
    return "player" + this.getValue() + postfix;
  }
};
var PlayerOrNone;
(function(PlayerOrNone2) {
  PlayerOrNone2.ZERO = Player.ZERO;
  PlayerOrNone2.ONE = Player.ONE;
  PlayerOrNone2.NONE = PlayerNone.NONE;
  PlayerOrNone2.encoder = new class extends Encoder {
    encode(player) {
      return player.getValue();
    }
    decode(encoded) {
      if (encoded === 2)
        return PlayerOrNone2.NONE;
      Utils.assert(encoded === 0 || encoded === 1, "Invalid encoded player: " + encoded);
      return Player.of(encoded);
    }
  }();
})(PlayerOrNone || (PlayerOrNone = {}));

// games/dist/utils/Debug.js
var Debug = class _Debug {
  /**
   * Enables logging for a class or method programmatically.
   * For example, call `Debug.enableLog([true, false], 'YourClass', 'yourMethod')` in app.component.ts
   * `entryExit` is composed of two booleans: the first states if we want to log entry to a method,
   * the second if we want to log exit
   */
  static enableLog(entryExit, className, methodName) {
    const verbosityJSON = localStorage.getItem("verbosity");
    let verbosity = {};
    if (verbosityJSON != null) {
      verbosity = JSON.parse(verbosityJSON);
    }
    if (methodName === void 0) {
      verbosity[className] = entryExit;
    } else {
      verbosity[className + "." + methodName] = entryExit;
    }
    const stringifiedVerbosity = _Debug.getStringified(verbosity);
    localStorage.setItem("verbosity", stringifiedVerbosity);
  }
  static getStringified(o) {
    try {
      return JSON.stringify(o);
    } catch (e) {
      return "recursive and not stringifiable!";
    }
  }
  static isVerbose(name) {
    const verbosityJSON = localStorage.getItem("verbosity");
    if (verbosityJSON == null)
      return [false, false];
    try {
      const verbosity = JSON.parse(verbosityJSON);
      if (verbosity[name] == null)
        return [false, false];
      Utils.assert(Array.isArray(verbosity[name]), `malformed verbosity levels for ${name}: ${verbosity[name]}`);
      return verbosity[name];
    } catch (e) {
      throw new Error(`malformed verbosity object: ${verbosityJSON}`);
    }
  }
  static isMethodVerboseEntry(className, methodName) {
    return _Debug.isVerbose(className)[0] || _Debug.isVerbose(className + "." + methodName)[0];
  }
  static isMethodVerboseExit(className, methodName) {
    return _Debug.isVerbose(className)[1] || _Debug.isVerbose(className + "." + methodName)[1];
  }
  static display(className, methodName, message) {
    if (_Debug.isMethodVerboseEntry(className, methodName)) {
      console.log(`${className}.${methodName}: ${message}`);
    }
  }
  /**
   * Class decorator that enables logging for all methods of a class
   * Note: we could think that T should be typed `T extends { new(...args: unknown[]): unknown }`
   * but this would restrict the decorator to only be applied to classes with public constructors.
   */
  static log(constructor) {
    const className = constructor["name"];
    for (const propertyName of Object.getOwnPropertyNames(constructor["prototype"])) {
      const nullableDescriptor = Object.getOwnPropertyDescriptor(
        // eslint-disable-next-line dot-notation
        constructor["prototype"],
        propertyName
      );
      const descriptor = Utils.getNonNullable(nullableDescriptor);
      const isMethod = descriptor.value instanceof Function;
      Utils.assert(isMethod, "cannot add logging to properties that are not methods!");
      const originalMethod = descriptor.value;
      descriptor.value = function(...args) {
        if (_Debug.isMethodVerboseEntry(className, propertyName)) {
          const strArgs = Array.from(args).map(_Debug.getStringified).join(", ");
          console.log(`> ${className}.${propertyName}(${strArgs})`);
        }
        const result = originalMethod.apply(this, args);
        if (_Debug.isMethodVerboseExit(className, propertyName)) {
          console.log(`< ${className}.${propertyName} -> ${_Debug.getStringified(result)}`);
        }
        return result;
      };
      Object.defineProperty(constructor["prototype"], propertyName, descriptor);
    }
  }
};
window["enableLog"] = Debug.enableLog;

// games/dist/jscaip/AI/BoardValue.js
var BoardValue = class _BoardValue {
  metrics;
  static max(left, right) {
    const max = ArrayUtils.max(left.metrics, right.metrics);
    return _BoardValue.multiMetric(max);
  }
  static min(left, right) {
    const min = ArrayUtils.min(left.metrics, right.metrics);
    return _BoardValue.multiMetric(min);
  }
  static getVictoryValueOf(player) {
    if (player === Player.ZERO) {
      return Number.NEGATIVE_INFINITY;
    } else {
      return Number.POSITIVE_INFINITY;
    }
  }
  static getPreVictoryValueOf(player) {
    if (player === Player.ZERO) {
      return Number.MIN_SAFE_INTEGER + 1;
    } else {
      return Number.MAX_SAFE_INTEGER - 1;
    }
  }
  static isVictoryValue(score) {
    return score === _BoardValue.getVictoryValueOf(Player.ZERO) || score === _BoardValue.getVictoryValueOf(Player.ONE);
  }
  static isPreVictoryValue(score) {
    return score === _BoardValue.getPreVictoryValueOf(Player.ZERO) || score === _BoardValue.getPreVictoryValueOf(Player.ONE);
  }
  /**
   * return the board value corresponding to the players' scores
   * @param playerZeroScore the positive score of player zero
   * @param playerOneScore the positive score of player one
   */
  static ofSingle(playerZeroScore, playerOneScore) {
    return _BoardValue.ofMultiple([playerZeroScore], [playerOneScore]);
  }
  /**
   * return the board value corresponding to the players' scores, as a number map
   */
  static ofPlayerNumberMap(map) {
    return _BoardValue.ofSingle(map.get(Player.ZERO), map.get(Player.ONE));
  }
  /**
   * return the board value corresponding to the players' scores
   * @param playerZeroScores the positive score list of player zero
   * @param playerOneScores the positive score list of player one
   */
  static ofMultiple(playerZeroScores, playerOneScores) {
    Utils.assert(playerZeroScores.length === playerOneScores.length, "both player should have the same number of metric");
    Utils.assert(playerZeroScores.length !== 0, "scores list should not be empty");
    const subValues = [];
    for (let i = 0; i < playerZeroScores.length; i++) {
      const playerZeroScore = playerZeroScores[i] * Player.ZERO.getScoreModifier();
      const playerOneScore = playerOneScores[i] * Player.ONE.getScoreModifier();
      subValues.push(playerZeroScore + playerOneScore);
    }
    return new _BoardValue(subValues);
  }
  static of(value) {
    return new _BoardValue([value]);
  }
  static multiMetric(metrics) {
    return new _BoardValue(metrics);
  }
  static isLessThan(left, right) {
    return ArrayUtils.isLessThan(left.metrics, right.metrics);
  }
  static isGreaterThan(left, right) {
    return ArrayUtils.isGreaterThan(left.metrics, right.metrics);
  }
  constructor(metrics) {
    this.metrics = metrics;
  }
  toMaximum() {
    const size = this.metrics.length;
    const maximums = ArrayUtils.create(size, _BoardValue.getVictoryValueOf(Player.ONE));
    return _BoardValue.multiMetric(maximums);
  }
  toMinimum() {
    const size = this.metrics.length;
    const minimums = ArrayUtils.create(size, _BoardValue.getVictoryValueOf(Player.ZERO));
    return _BoardValue.multiMetric(minimums);
  }
  equals(other) {
    return ArrayUtils.equals(this.metrics, other.metrics);
  }
};

// games/dist/jscaip/GameStatus.js
var GameStatus = class _GameStatus {
  isEndGame;
  winner;
  static ZERO_WON = new _GameStatus(true, Player.ZERO);
  static ONE_WON = new _GameStatus(true, Player.ONE);
  static DRAW = new _GameStatus(true, PlayerOrNone.NONE);
  static ONGOING = new _GameStatus(false, PlayerOrNone.NONE);
  static getVictory(player) {
    if (player === Player.ZERO) {
      return _GameStatus.ZERO_WON;
    } else {
      return _GameStatus.ONE_WON;
    }
  }
  static getDefeat(player) {
    if (player === Player.ZERO) {
      return _GameStatus.ONE_WON;
    } else {
      return _GameStatus.ZERO_WON;
    }
  }
  constructor(isEndGame, winner) {
    this.isEndGame = isEndGame;
    this.winner = winner;
  }
  toBoardValue() {
    if (this.winner.isPlayer()) {
      return BoardValue.of(BoardValue.getVictoryValueOf(this.winner));
    } else {
      return BoardValue.of(0);
    }
  }
};

// games/dist/jscaip/AI/GameNode.js
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GameNode_1;
var GameNodeStats = class {
  static createdNodes = 0;
};
var GameNode = class GameNode2 {
  static {
    GameNode_1 = this;
  }
  gameState;
  parent;
  previousMove;
  static ID = 0;
  id;
  // Used for debug purposes to uniquely identify nodes
  /**
   * The children of this node.
   * It is a map keyed with moves, with as value the child that corresponds
   * to applying that move to the current state.
   */
  children = new MGPMap();
  /**
   * A cache that AIs can use. It is up to the AIs to properly name and type the values in the cache.
   */
  cache = new MGPMap();
  constructor(gameState, parent = MGPOptional.empty(), previousMove = MGPOptional.empty()) {
    this.gameState = gameState;
    this.parent = parent;
    this.previousMove = previousMove;
    this.id = GameNode_1.ID++;
    GameNodeStats.createdNodes++;
  }
  /**
   * Returns the child corresponding to applying the given move to the current state,
   * or empty if it has not yet been calculated.
   */
  getChild(move) {
    return this.children.get(move);
  }
  /**
   * Checks whether this node has children
   */
  hasChildren() {
    return this.getChildren().length > 0;
  }
  /**
   * Returns all the children of the node
   */
  getChildren() {
    return this.children.getValueList();
  }
  /**
   * Adds a child to this node.
   */
  addChild(node) {
    Utils.assert(node.previousMove.isPresent(), "GameNode: addChild expects a node with a previous move");
    this.children.set(node.previousMove.get(), node);
  }
  /**
   * Represents the tree starting at this node as a DOT graph.
   * You can view the DOT graph with a tool like xdot,
   * or by pasting it on a website like https://dreampuf.github.io/GraphvizOnline/
   */
  showDot(rules, config, labelFn, max, level = 0, id = 0) {
    let buffer = "";
    if (level === 0) {
      buffer += "digraph G {\n";
    }
    const gameStatus = rules.getGameStatus(this, config);
    let winner = PlayerOrNone.NONE;
    if (gameStatus.isEndGame) {
      winner = gameStatus.winner;
    }
    let nextId = id + 1;
    const currentPlayer = this.gameState.getCurrentPlayer();
    let onlyLosses = true;
    if (max === void 0 || level < max) {
      const children = this.children.getValueList();
      for (const child of children) {
        const playerColor = this.getPlayerDotColor(this.gameState.getCurrentPlayer());
        buffer += `    node_${id} -> node_${nextId} [label="${child.previousMove.get()}"; color="${playerColor}"];
`;
        const result = child.showDot(rules, config, labelFn, max, level + 1, nextId);
        nextId = result.nextId;
        buffer += result.dot;
        if (result.winner === currentPlayer) {
          winner = result.winner;
          onlyLosses = false;
        }
        if (result.winner !== currentPlayer.getOpponent()) {
          onlyLosses = false;
        }
      }
    }
    if (onlyLosses && gameStatus === GameStatus.ONGOING) {
      onlyLosses = false;
    }
    let color = "white";
    if (winner.isPlayer()) {
      color = this.getPlayerDotColor(winner);
    }
    if (gameStatus === GameStatus.DRAW) {
      color = "gray";
    }
    let label = `#${this.gameState.turn}: ${this.id}`;
    if (labelFn !== void 0) {
      label += ` - ${labelFn(this)}`;
    }
    buffer += `    node_${id} [label="${label}", style=filled, fillcolor="${color}"];
`;
    if (level === 0) {
      buffer += "}";
    }
    return { dot: buffer, nextId, winner };
  }
  getPlayerDotColor(player) {
    switch (player) {
      case Player.ZERO:
        return "#994d00";
      default:
        Utils.expectToBe(player, Player.ONE);
        return "#ffc34d";
    }
  }
  /**
   * Get a value from the cache, or MGPOptional if it does not exist in the cache.
   */
  getCache(key) {
    return this.cache.get(key);
  }
  /**
   * Set or replace a value from the cache.
   */
  setCache(key, value) {
    if (this.cache.containsKey(key)) {
      this.cache.replace(key, value);
    } else {
      this.cache.set(key, value);
    }
  }
};
GameNode = GameNode_1 = __decorate([
  Debug.log
], GameNode);

// games/dist/jscaip/AI/MCTS.js
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

// games/dist/jscaip/AI/AbstractMinimax.js
var AbstractMinimax = class {
  name;
  rules;
  heuristic;
  moveGenerator;
  hashOverride;
  // States whether the minimax takes random moves from the list of best moves.
  useRandomness = false;
  // States whether alpha-beta pruning must be done. It probably is never useful to set it to false.
  prune = true;
  // States whether transposition tables should be used.
  // It's rare you don't want this, as you get 1-2 level extra in the same duration.
  useTranspositionTables = true;
  // The options of this minimax. Usually filled in by the constructor.
  availableOptions = [];
  // Can be set dynamically to stop the search early and return the current best results
  endSearchBy = MGPOptional.empty();
  transpositionTable = /* @__PURE__ */ new Map();
  constructor(name, rules, heuristic, moveGenerator, hashOverride) {
    this.name = name;
    this.rules = rules;
    this.heuristic = heuristic;
    this.moveGenerator = moveGenerator;
    this.hashOverride = hashOverride;
  }
  toString() {
    return this.name;
  }
  // Hash used for transposition tables
  hash(state) {
    if (this.hashOverride != null) {
      return this.hashOverride(state);
    }
    return JSON.stringify(state);
  }
  configureFromConfig(config) {
    this.useRandomness = config.useRandomness ?? this.useRandomness;
    this.prune = config.prune ?? this.prune;
    this.useTranspositionTables = config.useTranspositionTables ?? this.useTranspositionTables;
  }
  chooseNextMove(node, options, config) {
    const start = performance.now();
    try {
      return this.doChooseNextMove(node, options, config);
    } finally {
      const duration = performance.now() - start;
      const key = this.toString();
      const previous = AIStats.aiTime.get(key) ?? 0;
      AIStats.aiTime.set(key, previous + duration);
    }
  }
  // Performs an alpha-beta search to find the best move from the given node
  // @return empty when there is no best move (because the game or search has finished)
  alphaBeta(node, depth, alpha, beta, config) {
    if (depth < 1) {
      return MGPOptional.empty();
    } else if (this.rules.getGameStatus(node, config).isEndGame) {
      return MGPOptional.empty();
    }
    let ttKey = "";
    let ttEntry = void 0;
    const alphaOrig = alpha;
    const betaOrig = beta;
    if (this.useTranspositionTables) {
      ttKey = this.hash(node.gameState);
      ttEntry = this.transpositionTable.get(ttKey);
      if (ttEntry && ttEntry.depth >= depth) {
        switch (ttEntry.bound) {
          case "EXACT":
            this.setScore(node, ttEntry.score);
            return MGPOptional.of({ move: ttEntry.bestMove, score: ttEntry.score, complete: true });
          case "LOWER":
            alpha = BoardValue.max(alpha, ttEntry.score);
            break;
          case "UPPER":
            beta = BoardValue.min(beta, ttEntry.score);
            break;
        }
        if (BoardValue.isGreaterThan(alpha, beta) || alpha.equals(beta)) {
          this.setScore(node, ttEntry.score);
          return MGPOptional.of({ move: ttEntry.bestMove, score: ttEntry.score, complete: true });
        }
      }
    }
    let possibleMoves = this.getPossibleMoves(node, config);
    Utils.assert(possibleMoves.size() > 0, "Minimax " + this.name + " should give move, received none!");
    if (this.useTranspositionTables && ttEntry?.bestMove) {
      Utils.assert(possibleMoves.contains(ttEntry.bestMove), "TT bestMove " + ttEntry.bestMove.toString() + " is not in possible moves for state " + this.hash(node.gameState));
      possibleMoves.removeElement(ttEntry.bestMove);
      possibleMoves = new Set([ttEntry.bestMove, ...possibleMoves]);
    }
    const search = this.getBestMoves(node, possibleMoves, depth, alpha, beta, config);
    const bestMove = this.getBestMoveAmong(search.bestMoves);
    Utils.assert(possibleMoves.contains(bestMove.move), "best child is not a possible move?!" + bestMove.move.toString());
    this.setScore(node, bestMove.score);
    if (this.useTranspositionTables && search.complete) {
      let bound;
      if (BoardValue.isLessThan(bestMove.score, alphaOrig) || bestMove.score.equals(alphaOrig)) {
        bound = "UPPER";
      } else if (BoardValue.isGreaterThan(bestMove.score, betaOrig) || bestMove.score.equals(betaOrig)) {
        bound = "LOWER";
      } else {
        bound = "EXACT";
      }
      this.transpositionTable.set(ttKey, {
        depth,
        score: bestMove.score,
        bound,
        bestMove: bestMove.move
      });
    }
    return MGPOptional.of({
      move: bestMove.move,
      score: bestMove.score,
      complete: search.complete
    });
  }
  getPossibleMoves(node, config) {
    const currentMoves = this.getMoves(node);
    if (currentMoves.isAbsent()) {
      const moves = this.moveGenerator.getListMoves(node, config);
      this.setMoves(node, new Set(moves));
      return new Set(moves);
    } else {
      return currentMoves.get();
    }
  }
  getBestMoves(node, possibleMoves, depth, alpha, beta, config) {
    let bestMoves = [];
    let complete = true;
    const currentPlayer = node.gameState.getCurrentPlayer();
    let extremumExpected = this.getExpectedExtremum(node, config);
    const newValueIsBetter = currentPlayer === Player.ZERO ? BoardValue.isLessThan : BoardValue.isGreaterThan;
    for (const move of possibleMoves) {
      if (this.endSearchBy.isPresent() && Date.now() > this.endSearchBy.get() && bestMoves.length > 0) {
        return { bestMoves, complete: false };
      }
      const child = this.getOrCreateChild(node, move, config);
      const bestMoveOptional = this.alphaBeta(child, depth - 1, alpha, beta, config);
      let bestMove;
      if (bestMoveOptional.isAbsent()) {
        bestMove = { move, score: this.getScore(child, config), complete: true };
      } else {
        bestMove = bestMoveOptional.get();
        bestMove = {
          move,
          score: bestMove.score,
          complete: bestMove.complete
        };
        complete = complete && bestMove.complete;
      }
      if (newValueIsBetter(bestMove.score, extremumExpected) || bestMoves.length === 0) {
        extremumExpected = bestMove.score;
        bestMoves = [bestMove];
      } else if (bestMove.score.equals(extremumExpected)) {
        bestMoves.push(bestMove);
      }
      if (this.prune && newValueIsBetter(extremumExpected, currentPlayer === Player.ZERO ? alpha : beta)) {
        break;
      }
      if (currentPlayer === Player.ZERO) {
        beta = BoardValue.min(extremumExpected, beta);
      } else {
        alpha = BoardValue.max(extremumExpected, alpha);
      }
    }
    return { bestMoves, complete };
  }
  getExpectedExtremum(node, config) {
    const childValue = this.getScore(node, config);
    const currentPlayer = node.gameState.getCurrentPlayer();
    if (currentPlayer === Player.ZERO) {
      return childValue.toMaximum();
    } else {
      return childValue.toMinimum();
    }
  }
  getBestMoveAmong(moves) {
    Utils.assert(moves.length > 0, "getBestChildAmong expects at least one child");
    if (this.useRandomness) {
      return ArrayUtils.getRandomElement(moves);
    } else {
      return moves[0];
    }
  }
  getOrCreateChild(node, move, config) {
    const child = node.getChild(move);
    if (child.isAbsent()) {
      const legality = this.rules.isLegal(move, node.gameState, config);
      const moveString = move.toString();
      Utils.assert(legality.isSuccess(), 'The minimax "' + this.name + '" has proposed an illegal move at turn ' + node.gameState.turn + " (" + moveString + '), refusal reason: "' + legality.getReasonOr("") + '", this should not happen.');
      const state = this.rules.applyLegalMove(move, node.gameState, config, legality.get());
      const newChild = new GameNode(state, MGPOptional.of(node), MGPOptional.of(move));
      node.addChild(newChild);
      this.setScore(newChild, this.computeBoardValue(newChild, config));
      return newChild;
    }
    return child.get();
  }
  setScore(node, score) {
    node.setCache(this.name + "-score", score);
  }
  getScore(node, config) {
    const score = node.getCache(this.name + "-score");
    if (score.isPresent()) {
      return score.get();
    } else {
      const boardValue = this.computeBoardValue(node, config);
      this.setScore(node, boardValue);
      return boardValue;
    }
  }
  computeBoardValue(node, config) {
    const gameStatus = this.rules.getGameStatus(node, config);
    if (gameStatus.isEndGame) {
      return gameStatus.toBoardValue();
    } else {
      return this.heuristic.getBoardValue(node, config);
    }
  }
  setMoves(node, moves) {
    node.setCache(this.name + "-moves", moves);
  }
  getMoves(node) {
    return node.getCache(this.name + "-moves");
  }
  getInfo(node, config) {
    return "BoardValue=" + this.heuristic.getBoardValue(node, config).metrics;
  }
};

// games/dist/jscaip/AI/IterativeDeepeningMinimax.js
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

// games/dist/jscaip/AI/MCTSWithHeuristic.js
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

// games/dist/jscaip/AI/Heuristic.js
var Heuristic = class {
};
var HeuristicWithBounds = class extends Heuristic {
};

// games/dist/jscaip/AI/Minimax.js
var PlayerMetricHeuristicWithBounds = class extends HeuristicWithBounds {
  // Yes, this is duplicated from PlayerMetricHeuristic, because we don't have multiple inheritance
  // and probably don't want to use mixins!
  getBoardValue(node, config) {
    const metrics = this.getMetrics(node, config);
    return BoardValue.ofMultiple(metrics.get(Player.ZERO).get(), metrics.get(Player.ONE).get());
  }
};
var Minimax = class extends AbstractMinimax {
  constructor(name, rules, heuristic, moveGenerator, hash) {
    super(name, rules, heuristic, moveGenerator, hash);
    for (let i = 1; i < 10; i++) {
      this.availableOptions.push({ name: `Level ${i}`, maxDepth: i });
    }
  }
  doChooseNextMove(node, options, config) {
    Utils.assert(this.rules.getGameStatus(node, config).isEndGame === false, "Minimax has been asked to choose a move from a finished game");
    const boardValue = this.getExpectedExtremum(node, config);
    return this.alphaBeta(node, options.maxDepth, boardValue.toMinimum(), boardValue.toMaximum(), config).get().move;
  }
};

// games/dist/jscaip/AI/AIConfigUtils.js
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

// games/dist/jscaip/Move.js
var Move = class {
  __nominal;
  // For strict typing
};

// games/dist/jscaip/PlayerNumberTable.js
var PlayerNumberTable = class _PlayerNumberTable extends MGPMap {
  static of(playerZero, playerOne) {
    return new _PlayerNumberTable([
      { key: Player.ZERO, value: playerZero },
      { key: Player.ONE, value: playerOne }
    ]);
  }
  static ofSingle(playerZero, playerOne) {
    return _PlayerNumberTable.of([playerZero], [playerOne]);
  }
  add(player, index, value) {
    const list = ArrayUtils.copy(this.get(player).get());
    list[index] += value;
    return this.put(player, list);
  }
  concat(other) {
    const playerZeroStart = this.get(Player.ZERO).get();
    const playerOneStart = this.get(Player.ONE).get();
    const playerZeroEnd = other.get(Player.ZERO).get();
    const playerOneEnd = other.get(Player.ONE).get();
    return _PlayerNumberTable.of(playerZeroStart.concat(playerZeroEnd), playerOneStart.concat(playerOneEnd));
  }
};

// games/dist/jscaip/PlayerMap.js
var PlayerMap = class _PlayerMap {
  map;
  static ofValues(playerZeroValue, playerOneValue) {
    const map = new MGPMap([
      { key: Player.ZERO, value: playerZeroValue },
      { key: Player.ONE, value: playerOneValue }
    ]);
    return new _PlayerMap(map);
  }
  constructor(map) {
    this.map = map;
  }
  makeImmutable() {
    return this.map.makeImmutable();
  }
  equals(other) {
    return this.map.equals(other.map);
  }
  get(player) {
    return this.map.get(player).get();
  }
  put(player, value) {
    return this.map.put(player, value).get();
  }
};
var PlayerNumberMap = class _PlayerNumberMap extends PlayerMap {
  static of(playerZeroValue, playerOneValue) {
    const map = new MGPMap([
      { key: Player.ZERO, value: playerZeroValue },
      { key: Player.ONE, value: playerOneValue }
    ]);
    return new _PlayerNumberMap(map);
  }
  add(player, value) {
    const oldValue = this.get(player);
    return this.map.put(player, oldValue + value);
  }
  subtract(player, value) {
    const oldValue = this.get(player);
    return this.map.put(player, oldValue - value);
  }
  toTable() {
    return PlayerNumberTable.ofSingle(this.get(Player.ZERO), this.get(Player.ONE));
  }
  getCopy() {
    return new _PlayerNumberMap(this.map.getCopy());
  }
};

// games/dist/utils/LocaleUtils.js
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

// games/dist/config/ConfigLine.js
var ConfigLine = class {
  defaultValue;
  title;
  constructor(defaultValue, title) {
    this.defaultValue = defaultValue;
    this.title = title;
  }
};

// games/dist/config/BooleanConfig.js
var BooleanConfig = class extends ConfigLine {
  constructor(defaultValue, title) {
    super(defaultValue, title);
  }
  checkValidity(value) {
    if (typeof value === "boolean") {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure("BooleanConfig expects a boolean value");
    }
  }
};

// games/dist/config/EnumConfig.js
var EnumConfig = class extends ConfigLine {
  possibleValues;
  validator;
  constructor(value, title, possibleValues, validator = (_) => MGPValidation.SUCCESS) {
    super(value, title);
    this.possibleValues = possibleValues;
    this.validator = validator;
  }
  checkValidity(fieldValue) {
    if (typeof fieldValue !== "string") {
      return MGPValidation.failure("EnumConfig expects a string value");
    } else if (Object.keys(this.possibleValues).indexOf(fieldValue) === -1) {
      return MGPValidation.failure("This value is not among the possible values");
    } else {
      return this.validator(fieldValue);
    }
  }
};

// games/dist/config/NumberConfig.js
var NumberConfig = class extends ConfigLine {
  validator;
  constructor(defaultValue, title, validator) {
    super(defaultValue, title);
    this.validator = validator;
  }
  checkValidity(value) {
    if (typeof value === "number") {
      return this.validator(value);
    } else {
      return MGPValidation.failure("NumberConfig expects a number value");
    }
  }
};

// games/dist/config/RulesConfigDescription.js
var RulesConfigDescription = class _RulesConfigDescription {
  defaultConfigDescription;
  nonDefaultStandardConfigs;
  static EMPTY = new _RulesConfigDescription({
    name: () => $localize`Default`,
    config: {}
  });
  defaultConfig;
  constructor(defaultConfigDescription, nonDefaultStandardConfigs = []) {
    this.defaultConfigDescription = defaultConfigDescription;
    this.nonDefaultStandardConfigs = nonDefaultStandardConfigs;
    const config = {};
    for (const field of this.getFields()) {
      config[field] = defaultConfigDescription.config[field].defaultValue;
    }
    this.defaultConfig = {
      name: defaultConfigDescription.name,
      config
    };
    const defaultKeys = new Set(Object.keys(defaultConfigDescription.config));
    for (const otherStandardConfig of nonDefaultStandardConfigs) {
      const key = new Set(Object.keys(otherStandardConfig.config));
      Utils.assert(key.equals(defaultKeys), `Field missing in ${otherStandardConfig.name()} config!`);
    }
  }
  isCustomizable() {
    return this.getFields().length > 0;
  }
  getStandardConfigs() {
    return [this.defaultConfig].concat(this.nonDefaultStandardConfigs);
  }
  getDefaultConfig() {
    return this.defaultConfig;
  }
  getNonDefaultStandardConfigs() {
    return this.nonDefaultStandardConfigs;
  }
  getConfig(configName) {
    const rulesConfig = this.getStandardConfigs().filter((v) => v.name() === configName)[0];
    return rulesConfig.config;
  }
  getFields() {
    return Object.keys(this.defaultConfigDescription.config);
  }
  getFieldLocalizedName(field) {
    return this.defaultConfigDescription.config[field].title();
  }
  getFieldValidity(field, value) {
    if (value == null) {
      return MGPValidation.failure($localize`This value is mandatory`);
    }
    const configLine = this.defaultConfigDescription.config[field];
    if (configLine == null) {
      return MGPValidation.failure($localize`There is no such configuration element`);
    } else {
      return configLine.checkValidity(value);
    }
  }
  isValid(field, value) {
    return this.getFieldValidity(field, value).isSuccess();
  }
  getValidityError(field, value) {
    return this.getFieldValidity(field, value).getReason();
  }
};

// games/dist/jscaip/AI/PlayerMetricHeuristic.js
var PlayerMetricHeuristic = class extends Heuristic {
  getBoardValue(node, config) {
    const metrics = this.getMetrics(node, config);
    return BoardValue.ofMultiple(metrics.get(Player.ZERO).get(), metrics.get(Player.ONE).get());
  }
};

// games/dist/jscaip/AI/DummyHeuristic.js
var DummyHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(_node, _config) {
    return PlayerNumberTable.ofSingle(0, 0);
  }
};

// games/dist/jscaip/Vector.js
var Vector = class _Vector {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  isSingleOrthogonalStep() {
    const isUnitary = Math.abs(this.x) + Math.abs(this.y) === 1;
    return this.isOrthogonal() && isUnitary;
  }
  isOrthogonal() {
    return this.x === 0 || this.y === 0;
  }
  isDiagonal() {
    return this.x !== 0 && Math.abs(this.x) === Math.abs(this.y);
  }
  isDiagonalOfLength(length) {
    return Math.abs(this.x) === length && Math.abs(this.y) === length;
  }
  toMinimalVector() {
    const greatestCommonDivisor = MathUtils.gcd(this.x, this.y);
    return new _Vector(this.x / greatestCommonDivisor, this.y / greatestCommonDivisor);
  }
  /**
    * @param otherVector the other vector to add to this
    * @param times the number of time you want to add it
    * @returns the vector that is the sum of this vector and otherVector * times
   */
  combine(otherVector, times = 1) {
    const newX = this.x + times * otherVector.x;
    const newY = this.y + times * otherVector.y;
    return new _Vector(newX, newY);
  }
  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
  toHTMLClassName() {
    return this.toString().replace("_", "-");
  }
};

// games/dist/jscaip/Direction.js
var Direction = class extends Vector {
  isDown() {
    return this.y === 1;
  }
  isUp() {
    return this.y === -1;
  }
  isLeft() {
    return this.x === -1;
  }
  isRight() {
    return this.x === 1;
  }
  toInt() {
    if (this.x === 0 && this.y === -1)
      return 0;
    if (this.x === 1 && this.y === 0)
      return 1;
    if (this.x === 0 && this.y === 1)
      return 2;
    if (this.x === -1 && this.y === 0)
      return 3;
    if (this.x === -1 && this.y === -1)
      return 4;
    if (this.x === 1 && this.y === -1)
      return 5;
    if (this.x === -1 && this.y === 1)
      return 6;
    else
      return 7;
  }
  toString() {
    if (this.x === 0 && this.y === -1)
      return "UP";
    if (this.x === 1 && this.y === 0)
      return "RIGHT";
    if (this.x === 0 && this.y === 1)
      return "DOWN";
    if (this.x === -1 && this.y === 0)
      return "LEFT";
    if (this.x === -1 && this.y === -1)
      return "UP_LEFT";
    if (this.x === 1 && this.y === -1)
      return "UP_RIGHT";
    if (this.x === -1 && this.y === 1)
      return "DOWN_LEFT";
    else
      return "DOWN_RIGHT";
  }
};
var DirectionFactory = class {
  from(x, y) {
    for (const dir of this.all) {
      if (dir.x === x && dir.y === y)
        return MGPFallible.success(dir);
    }
    return MGPFallible.failure("Invalid x or y in direction construction");
  }
  fromDelta(dx, dy) {
    if (dx === 0 && dy === 0) {
      return MGPFallible.failure("Empty delta for direction");
    } else if (Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0) {
      return this.from(Math.sign(dx), Math.sign(dy));
    }
    return MGPFallible.failure(DirectionFailure.DIRECTION_MUST_BE_LINEAR());
  }
  fromMove(start, end) {
    return this.fromDelta(end.x - start.x, end.y - start.y);
  }
  fromString(str) {
    switch (str) {
      case "UP":
        return this.from(0, -1);
      case "RIGHT":
        return this.from(1, 0);
      case "DOWN":
        return this.from(0, 1);
      case "LEFT":
        return this.from(-1, 0);
      case "UP_LEFT":
        return this.from(-1, -1);
      case "UP_RIGHT":
        return this.from(1, -1);
      case "DOWN_LEFT":
        return this.from(-1, 1);
      case "DOWN_RIGHT":
        return this.from(1, 1);
      default:
        return MGPFallible.failure(`Invalid direction string ${str}`);
    }
  }
  fromInt(int) {
    switch (int) {
      case 0:
        return this.from(0, -1);
      case 1:
        return this.from(1, 0);
      case 2:
        return this.from(0, 1);
      case 3:
        return this.from(-1, 0);
      case 4:
        return this.from(-1, -1);
      case 5:
        return this.from(1, -1);
      case 6:
        return this.from(-1, 1);
      case 7:
        return this.from(1, 1);
      default:
        return MGPFallible.failure(`Invalid int direction: ${int}`);
    }
  }
};
var DirectionFailure = class {
  static DIRECTION_MUST_BE_LINEAR = () => $localize`You must move in a straight line! You can only move orthogonally or diagonally!`;
};

// games/dist/jscaip/Ordinal.js
var Ordinal = class _Ordinal extends Direction {
  static UP = new _Ordinal(0, -1);
  static UP_RIGHT = new _Ordinal(1, -1);
  static RIGHT = new _Ordinal(1, 0);
  static DOWN_RIGHT = new _Ordinal(1, 1);
  static DOWN = new _Ordinal(0, 1);
  static DOWN_LEFT = new _Ordinal(-1, 1);
  static LEFT = new _Ordinal(-1, 0);
  static UP_LEFT = new _Ordinal(-1, -1);
  static factory = new class extends DirectionFactory {
    all = [
      _Ordinal.RIGHT,
      _Ordinal.DOWN_RIGHT,
      _Ordinal.DOWN,
      _Ordinal.DOWN_LEFT,
      _Ordinal.LEFT,
      _Ordinal.UP_LEFT,
      _Ordinal.UP,
      _Ordinal.UP_RIGHT
    ];
  }();
  static ORDINALS = _Ordinal.factory.all;
  static DIAGONALS = [
    _Ordinal.UP_RIGHT,
    _Ordinal.DOWN_RIGHT,
    _Ordinal.DOWN_LEFT,
    _Ordinal.UP_LEFT
  ];
  static ORTHOGONALS = [
    _Ordinal.UP,
    _Ordinal.RIGHT,
    _Ordinal.DOWN,
    _Ordinal.LEFT
  ];
  static encoder = Encoder.fromFunctions((dir) => {
    return dir.toString();
  }, (encoded) => {
    Utils.assert(typeof encoded === "string", "Invalid encoded direction");
    const fromString = _Ordinal.factory.fromString(encoded);
    return fromString.get();
  });
  getAngle() {
    switch (this) {
      case _Ordinal.RIGHT:
        return 0;
      case _Ordinal.DOWN_RIGHT:
        return 45;
      case _Ordinal.DOWN:
        return 90;
      case _Ordinal.DOWN_LEFT:
        return 135;
      case _Ordinal.LEFT:
        return 180;
      case _Ordinal.UP_LEFT:
        return 225;
      case _Ordinal.UP:
        return 270;
      default:
        Utils.expectToBe(this, _Ordinal.UP_RIGHT);
        return 315;
    }
  }
  getOpposite() {
    const opposite = _Ordinal.factory.from(-this.x, -this.y);
    return opposite.get();
  }
};

// games/dist/jscaip/Coord.js
var CoordFailure = class {
  static OUT_OF_RANGE(coord) {
    return `The coordinate ${coord.toString()} is not on the board`;
  }
};
var Coord = class _Coord extends Vector {
  static getEncoder(generator) {
    return Encoder.tuple([Encoder.identity(), Encoder.identity()], (coord) => [coord.x, coord.y], (fields) => generator(fields[0], fields[1]));
  }
  static encoder = _Coord.getEncoder((x, y) => new _Coord(x, y));
  constructor(x, y) {
    super(x, y);
  }
  getNext(dir, distance) {
    const combinedVector = this.combine(dir, distance);
    return new _Coord(combinedVector.x, combinedVector.y);
  }
  getNextToric(dir, boardWidth, boardHeight, distance) {
    const combinedVector = this.combine(dir, distance);
    const toricX = (combinedVector.x + boardWidth) % boardWidth;
    const toricY = (combinedVector.y + boardHeight) % boardHeight;
    return new _Coord(toricX, toricY);
  }
  getPrevious(dir, distance = 1) {
    return this.getNext(dir, -distance);
  }
  getLeft(dir) {
    const newX = this.x + dir.y;
    const newY = this.y + -dir.x;
    return new _Coord(newX, newY);
  }
  getRight(dir) {
    const newX = this.x + -dir.y;
    const newY = this.y + dir.x;
    return new _Coord(newX, newY);
  }
  isInRange(sizeX, sizeY) {
    if (this.x < 0) {
      return false;
    }
    if (this.y < 0) {
      return false;
    }
    if (sizeX <= this.x) {
      return false;
    }
    if (sizeY <= this.y) {
      return false;
    }
    return true;
  }
  isNotInRange(sizeX, sizeY) {
    if (this.x < 0) {
      return true;
    }
    if (this.y < 0) {
      return true;
    }
    if (sizeX <= this.x) {
      return true;
    }
    if (sizeY <= this.y) {
      return true;
    }
    return false;
  }
  getDirectionToward(c) {
    return Ordinal.factory.fromMove(this, c);
  }
  getOrthogonalDistance(c) {
    return Math.abs(this.x - c.x) + Math.abs(this.y - c.y);
  }
  getLinearDistanceToward(c, checkAlignment = true) {
    return this.getDistanceToward(c, checkAlignment);
  }
  // If asked not to check alignment, a knight move would count as 2
  getDistanceToward(c, checkAlignment = false) {
    Utils.assert(checkAlignment === false || c.isAlignedWith(this), "Cannot calculate distance with non aligned coords.");
    const dx = Math.abs(c.x - this.x);
    const dy = Math.abs(c.y - this.y);
    return Math.max(dx, dy);
  }
  isHexagonallyAlignedWith(coord) {
    const sdx = this.x - coord.x;
    const sdy = this.y - coord.y;
    if (sdx === sdy)
      return false;
    if (sdx === -sdy)
      return true;
    if (sdx * sdy === 0)
      return true;
    return false;
  }
  isAlignedWith(coord) {
    const dx = Math.abs(this.x - coord.x);
    const dy = Math.abs(this.y - coord.y);
    if (dx === dy)
      return true;
    if (dx * dy === 0)
      return true;
    return false;
  }
  isNeighborWith(coord) {
    if (this.isAlignedWith(coord)) {
      return this.getLinearDistanceToward(coord) === 1;
    } else {
      return false;
    }
  }
  getVectorToward(c) {
    const dx = c.x - this.x;
    const dy = c.y - this.y;
    return new Vector(dx, dy);
  }
  toVector() {
    return new Vector(this.x, this.y);
  }
  getCoordsToward(c, includeStart = false, includeEnd = false) {
    Utils.assert(c.isAlignedWith(this), "Should only call getCoordsToward on aligned coords");
    const coords = [];
    if (includeStart) {
      coords.push(this);
    }
    if (this.equals(c)) {
      return coords;
    }
    const dir = this.getDirectionToward(c).get();
    let coord = this.getNext(dir, 1);
    while (coord.equals(c) === false) {
      coords.push(coord);
      coord = coord.getNext(dir, 1);
    }
    if (includeEnd) {
      coords.push(coord);
    }
    return coords;
  }
  // [this, end]
  getAllCoordsToward(end) {
    return this.getCoordsToward(end, true, true);
  }
  equals(obj) {
    if (this === obj)
      return true;
    if (obj.x !== this.x)
      return false;
    return obj.y === this.y;
  }
  compareTo(c) {
    if (c.y === this.y) {
      if (c.x === this.x) {
        return 0;
      }
      return this.x < c.x ? -1 : 1;
    }
    return this.y < c.y ? -1 : 1;
  }
  toSVGPoint() {
    return this.x + "," + this.y;
  }
  scale(x, y) {
    return new _Coord(this.x * x, this.y * y);
  }
  /**
   * Ordinal as in both orthogonal and diagonal
   * @returns the list of coord that are considered as neighbor coords, here, the 8 ones
   */
  getOrdinalNeighbors() {
    return Ordinal.ORDINALS.map((direction) => this.getNext(direction));
  }
};

// games/dist/jscaip/TableUtils.js
var TableUtils = class _TableUtils {
  static create(width, height, initValue) {
    const table = [];
    for (let y = 0; y < height; y++) {
      table.push(ArrayUtils.create(width, initValue));
    }
    return table;
  }
  static map(table, fun) {
    return table.map((row) => row.map(fun));
  }
  static copy(table) {
    return _TableUtils.map(table, (t) => t);
  }
  static equals(t1, t2) {
    if (t1.length !== t2.length)
      return false;
    for (let i = 0; i < t1.length; i++) {
      if (ArrayUtils.equals(t1[i], t2[i]) === false)
        return false;
    }
    return true;
  }
  static sum(board) {
    let sum = 0;
    for (const line of board) {
      for (const element of line) {
        sum += element;
      }
    }
    return sum;
  }
  static add(left, right) {
    const width = left[0].length;
    const height = left.length;
    Utils.assert(height === right.length, "Table should have same height");
    Utils.assert(width === right[0].length, "Table should have same width (left.length: " + width + ", right.length: " + right[0].length + ")");
    const sum = _TableUtils.create(width, height, 0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        sum[y][x] = left[y][x] + right[y][x];
      }
    }
    return sum;
  }
  static contains(table, element) {
    for (const array of table) {
      if (ArrayUtils.contains(array, element)) {
        return true;
      }
    }
    return false;
  }
  static count(table, element) {
    let total = 0;
    for (const array of table) {
      total += ArrayUtils.count(array, element);
    }
    return total;
  }
  /**
   * Return the column of the leftmost match in each line of this table
   */
  static getLeftmostMatchColumn(table, predicate) {
    const width = table[0].length;
    const height = table.length;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (predicate(table[y][x])) {
          return MGPOptional.of(x);
        }
      }
    }
    return MGPOptional.empty();
  }
  static find(table, predicate) {
    for (const line of table) {
      for (const element of line) {
        if (predicate(element)) {
          return MGPOptional.of(element);
        }
      }
    }
    return MGPOptional.empty();
  }
};
var TableWithPossibleNegativeIndices = class {
  // This cannot be represented by an array as it may have negative indices
  // which cannot be iterated over
  content = new MGPMap();
  get(coord) {
    const line = this.content.get(coord.y);
    if (line.isAbsent())
      return MGPOptional.empty();
    return line.get().get(coord.x);
  }
  set(coord, value) {
    const lineOpt = this.content.get(coord.y);
    let line;
    if (lineOpt.isPresent()) {
      line = lineOpt.get();
    } else {
      line = new MGPMap();
      this.content.set(coord.y, line);
    }
    line.set(coord.x, value);
  }
  [Symbol.iterator]() {
    const elements = [];
    const ys = this.content.getKeySet().toList();
    ys.sort(ArrayUtils.smallerFirst);
    for (const y of ys) {
      const line = this.content.get(y).get();
      const xs = line.getKeySet().toList();
      xs.sort(ArrayUtils.smallerFirst);
      for (const x of xs) {
        const content = line.get(x).get();
        elements.push({ x, y, content });
      }
    }
    return elements.values();
  }
};
var Table3DUtils = class {
  static create(depth, width, height, initValue) {
    const triTable = [];
    for (let z = 0; z < depth; z++) {
      triTable.push(TableUtils.create(width, height, initValue));
    }
    return triTable;
  }
};

// games/dist/jscaip/BoardData.js
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GroupDataFactory = class GroupDataFactory2 {
  getGroupData(coord, board) {
    const color = board[coord.y][coord.x];
    const groupDatas = this.getNewInstance(color);
    return this._getGroupDatas(coord, board, groupDatas);
  }
  _getGroupDatas(coord, board, groupDatas) {
    const color = board[coord.y][coord.x];
    groupDatas.addPawn(coord, color);
    if (color === groupDatas.color) {
      for (const direction of this.getDirections(coord)) {
        const nextCoord = coord.getNext(direction);
        if (nextCoord.isInRange(board[0].length, board.length)) {
          if (groupDatas.contains(nextCoord) === false) {
            groupDatas = this._getGroupDatas(nextCoord, board, groupDatas);
          }
        }
      }
    }
    return groupDatas;
  }
  getGroupsDataWhere(board, condition) {
    const groups = [];
    let coord;
    let group;
    let currentSpace;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        coord = new Coord(x, y);
        currentSpace = board[y][x];
        if (condition(currentSpace)) {
          if (groups.some((currentGroup) => currentGroup.selfContains(coord)) === false) {
            group = this.getGroupData(coord, board);
            groups.push(group);
          }
        }
      }
    }
    return groups;
  }
};
GroupDataFactory = __decorate2([
  Debug.log
], GroupDataFactory);
var GroupData = class {
  color;
  constructor(color) {
    this.color = color;
  }
  selfContains(coord) {
    const ownCoords = this.getCoords();
    return ownCoords.some((c) => c.equals(coord));
  }
  static insert(list, coord) {
    if (list.length === 0) {
      return [coord];
    } else {
      const first = list[0];
      if (coord.compareTo(first) < 0) {
        return [coord].concat(list);
      } else {
        return list.concat([coord]);
      }
    }
  }
};

// games/dist/jscaip/Coord3D.js
var Coord3D = class _Coord3D extends Coord {
  z;
  static getCoord3DEncoder(generate) {
    return Encoder.tuple([Encoder.identity(), Encoder.identity(), Encoder.identity()], (coord) => [coord.x, coord.y, coord.z], (fields) => generate(fields[0], fields[1], fields[2]));
  }
  static of(x, y, z) {
    return new _Coord3D(x, y, z);
  }
  constructor(x, y, z) {
    super(x, y);
    this.z = z;
  }
  toString() {
    return "Coord3D" + this.toShortString();
  }
  toShortString() {
    return "(" + this.x + ", " + this.y + ", " + this.z + ")";
  }
  equals(other) {
    if (this === other)
      return true;
    if (other.x !== this.x)
      return false;
    if (other.y !== this.y)
      return false;
    return other.z === this.z;
  }
  isHigherThan(other) {
    return this.z > other.z;
  }
};

// games/dist/jscaip/CoordSet.js
var CoordSet = class extends OptimizedSet {
  toFields(coord) {
    return [[coord.y], coord.x];
  }
};

// games/dist/jscaip/FourStatePiece.js
var FourStatePiece = class _FourStatePiece {
  player;
  reachable;
  static ZERO = new _FourStatePiece(Player.ZERO, true);
  static ONE = new _FourStatePiece(Player.ONE, true);
  static EMPTY = new _FourStatePiece(PlayerOrNone.NONE, true);
  static UNREACHABLE = new _FourStatePiece(PlayerOrNone.NONE, false);
  static ofPlayer(player) {
    switch (player) {
      case Player.ZERO:
        return _FourStatePiece.ZERO;
      default:
        Utils.expectToBe(player, Player.ONE);
        return _FourStatePiece.ONE;
    }
  }
  constructor(player, reachable) {
    this.player = player;
    this.reachable = reachable;
  }
  equals(other) {
    return this.player.equals(other.player) && this.reachable === other.reachable;
  }
  is(player) {
    return this.player === player;
  }
  isPlayer() {
    return this === _FourStatePiece.ZERO || this === _FourStatePiece.ONE;
  }
  isReachable() {
    return this.reachable;
  }
  getPlayer() {
    return this.player;
  }
};

// games/dist/jscaip/HexaDirection.js
var HexaDirection = class _HexaDirection extends Direction {
  static UP = new _HexaDirection(0, -1);
  static UP_RIGHT = new _HexaDirection(1, -1);
  static RIGHT = new _HexaDirection(1, 0);
  static DOWN = new _HexaDirection(0, 1);
  static DOWN_LEFT = new _HexaDirection(-1, 1);
  static LEFT = new _HexaDirection(-1, 0);
  static factory = new class extends DirectionFactory {
    all = [
      _HexaDirection.UP,
      _HexaDirection.UP_RIGHT,
      _HexaDirection.RIGHT,
      _HexaDirection.DOWN,
      _HexaDirection.DOWN_LEFT,
      _HexaDirection.LEFT
    ];
  }();
  static encoder = Encoder.fromFunctions((direction) => {
    switch (direction) {
      case _HexaDirection.UP:
        return 0;
      case _HexaDirection.UP_RIGHT:
        return 1;
      case _HexaDirection.RIGHT:
        return 2;
      case _HexaDirection.DOWN:
        return 3;
      case _HexaDirection.DOWN_LEFT:
        return 4;
      default:
        Utils.expectToBe(direction, _HexaDirection.LEFT);
        return 5;
    }
  }, (encoded) => {
    Utils.assert(0 <= encoded && encoded <= 5, "Invalid encoded number for HexaDirection " + encoded);
    return _HexaDirection.factory.all[encoded];
  });
  getAngle() {
    switch (this) {
      case _HexaDirection.UP:
        return 0;
      case _HexaDirection.UP_RIGHT:
        return 60;
      case _HexaDirection.RIGHT:
        return 120;
      case _HexaDirection.DOWN:
        return 180;
      case _HexaDirection.DOWN_LEFT:
        return 240;
      default:
        Utils.expectToBe(this, _HexaDirection.LEFT);
        return 300;
    }
  }
  getOpposite() {
    const opposite = _HexaDirection.factory.from(-this.x, -this.y);
    return opposite.get();
  }
};

// games/dist/jscaip/HexaLine.js
var HexaLine = class _HexaLine {
  offset;
  constant;
  static fromTwoCoords(coord1, coord2) {
    const x1 = coord1.x;
    const x2 = coord2.x;
    const y1 = coord1.y;
    const y2 = coord2.y;
    const s1 = x1 + y1;
    const s2 = x2 + y2;
    if (x1 === x2 && y1 !== y2 && s1 !== s2)
      return MGPOptional.of(_HexaLine.constantQ(x1));
    if (x1 !== x2 && y1 === y2 && s1 !== s2)
      return MGPOptional.of(_HexaLine.constantR(y1));
    if (x1 !== x2 && y1 !== y2 && s1 === s2)
      return MGPOptional.of(_HexaLine.constantS(s1));
    return MGPOptional.empty();
  }
  static constantQ(offset) {
    return new _HexaLine(offset, "q");
  }
  static constantR(offset) {
    return new _HexaLine(offset, "r");
  }
  static constantS(offset) {
    return new _HexaLine(offset, "s");
  }
  static areOnSameLine(coords) {
    if (coords.length < 2)
      return true;
    const lineOpt = _HexaLine.fromTwoCoords(coords[0], coords[1]);
    if (lineOpt.isAbsent())
      return false;
    const line = lineOpt.get();
    for (const coord of coords.slice(2)) {
      if (line.contains(coord) === false)
        return false;
    }
    return true;
  }
  constructor(offset, constant) {
    this.offset = offset;
    this.constant = constant;
  }
  toString() {
    return `Line(${this.constant}, ${this.offset})`;
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.offset !== other.offset)
      return false;
    if (this.constant !== other.constant)
      return false;
    return true;
  }
  contains(coord) {
    switch (this.constant) {
      case "q":
        return coord.x === this.offset;
      case "r":
        return coord.y === this.offset;
      case "s":
        return coord.x + coord.y === this.offset;
    }
  }
  getDirection() {
    switch (this.constant) {
      case "q":
        return HexaDirection.DOWN;
      case "r":
        return HexaDirection.RIGHT;
      case "s":
        return HexaDirection.DOWN_LEFT;
    }
  }
};

// games/dist/jscaip/GipfProjectHelper.js
var GipfCapture = class _GipfCapture {
  static encoder = Encoder.tuple([Encoder.list(Coord.encoder)], (move) => [move.capturedSpaces], (fields) => new _GipfCapture(fields[0]));
  static listEncoder = Encoder.list(_GipfCapture.encoder);
  capturedSpaces;
  constructor(captured) {
    Utils.assert(4 <= captured.length, "Cannot create a GipfCapture with less than 4 captured pieces");
    Utils.assert(HexaLine.areOnSameLine(captured), "Cannot create a GipfCapture with pieces that are not on the same line");
    this.capturedSpaces = ArrayUtils.copy(captured).sort((coord1, coord2) => {
      if (coord1.x === coord2.x) {
        Utils.assert(coord1.y !== coord2.y, "Cannot create a GipfCapture with duplicate coords");
        return coord1.y > coord2.y ? 1 : -1;
      } else {
        return coord1.x > coord2.x ? 1 : -1;
      }
    });
    let previous = MGPOptional.empty();
    for (const coord of this.capturedSpaces) {
      Utils.assert(previous.isAbsent() || previous.get().getLinearDistanceToward(coord) === 1, "Cannot create a GipfCapture with non-consecutive coords");
      previous = MGPOptional.of(coord);
    }
  }
  toString() {
    let str = "";
    for (const coord of this.capturedSpaces) {
      if (str !== "") {
        str += ",";
      }
      str += coord.toString();
    }
    return str;
  }
  size() {
    return this.capturedSpaces.length;
  }
  forEach(callback) {
    this.capturedSpaces.forEach(callback);
  }
  contains(coord) {
    for (const capturedSpace of this.capturedSpaces) {
      if (capturedSpace.equals(coord)) {
        return true;
      }
    }
    return false;
  }
  intersectsWith(capture) {
    return this.capturedSpaces.some((coord) => {
      return capture.contains(coord);
    });
  }
  getLine() {
    const line = HexaLine.fromTwoCoords(this.capturedSpaces[0], this.capturedSpaces[1]);
    return line.get();
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.capturedSpaces.length !== other.capturedSpaces.length) {
      return false;
    }
    for (let i = 0; i < this.capturedSpaces.length; i++) {
      if (this.capturedSpaces[i].equals(other.capturedSpaces[i]) === false) {
        return false;
      }
    }
    return true;
  }
};
var GipfProjectHelper = class _GipfProjectHelper {
  static getPossibleCaptureCombinationsFromPossibleCaptures(possibleCaptures) {
    const intersections = _GipfProjectHelper.computeIntersections(possibleCaptures);
    let captureCombinations = [[]];
    possibleCaptures.forEach((_capture, index) => {
      if (intersections[index].length === 0) {
        captureCombinations.forEach((combination) => {
          combination.push(index);
        });
      } else {
        const newCombinations = [];
        const intersectsWithFutureIndex = intersections[index].some((c) => c > index);
        for (const combination of captureCombinations) {
          const combinationIntersectsWithIndex = combination.some((c) => {
            return intersections[index].some((c2) => c === c2);
          });
          if (combinationIntersectsWithIndex) {
            newCombinations.push(ArrayUtils.copy(combination));
          } else if (intersectsWithFutureIndex) {
            newCombinations.push(ArrayUtils.copy(combination));
            combination.push(index);
            newCombinations.push(ArrayUtils.copy(combination));
          } else {
            combination.push(index);
            newCombinations.push(ArrayUtils.copy(combination));
          }
        }
        captureCombinations = newCombinations;
      }
    });
    return captureCombinations.map((combination) => {
      return combination.map((index) => {
        return possibleCaptures[index];
      });
    });
  }
  static computeIntersections(captures) {
    const intersections = [];
    captures.forEach((capture1, index1) => {
      intersections.push([]);
      captures.forEach((capture2, index2) => {
        if (index1 !== index2) {
          if (capture1.intersectsWith(capture2)) {
            intersections[index1].push(index2);
          }
        }
      });
    });
    return intersections;
  }
};

// games/dist/jscaip/GobanUtils.js
var GobanUtils = class _GobanUtils {
  static getHoshis(width, height) {
    let hoshis = new Set();
    if (width < 5 || height < 5) {
      return [];
    }
    const horizontalMiddle = _GobanUtils.getHorizontalCenter(width);
    const verticalMiddle = _GobanUtils.getVerticalCenter(height);
    const left = _GobanUtils.getHorizontalLeft(width);
    const up = _GobanUtils.getVerticalUp(height);
    const right = _GobanUtils.getHorizontalRight(width);
    const down = _GobanUtils.getVerticalDown(height);
    if (12 < height && height % 2 === 1) {
      hoshis = hoshis.addElement(new Coord(left, verticalMiddle)).addElement(new Coord(right, verticalMiddle));
    }
    if (12 < width && width % 2 === 1) {
      hoshis = hoshis.addElement(new Coord(horizontalMiddle, up)).addElement(new Coord(horizontalMiddle, down));
    }
    if (width % 2 === 1 && height % 2 === 1) {
      hoshis = hoshis.addElement(new Coord(horizontalMiddle, verticalMiddle));
    }
    hoshis = hoshis.addElement(new Coord(left, up)).addElement(new Coord(left, down)).addElement(new Coord(right, up)).addElement(new Coord(right, down));
    return hoshis.toList();
  }
  static getHorizontalLeft(width) {
    return width < 12 ? 2 : 3;
  }
  static getHorizontalCenter(width) {
    return Math.floor(width / 2);
  }
  static getHorizontalRight(width) {
    const left = _GobanUtils.getHorizontalLeft(width);
    return width - (left + 1);
  }
  static getVerticalUp(height) {
    return height < 12 ? 2 : 3;
  }
  static getVerticalCenter(height) {
    return Math.floor(height / 2);
  }
  static getVerticalDown(height) {
    const up = _GobanUtils.getVerticalUp(height);
    return height - (up + 1);
  }
};

// games/dist/jscaip/HexaOrientation.js
var HexaOrientation = class {
  startAngle;
  conversionMatrix;
  inverseConversionMatrix;
};
var PointyHexaOrientation = class _PointyHexaOrientation extends HexaOrientation {
  static INSTANCE = new _PointyHexaOrientation();
  startAngle = 0.5;
  conversionMatrix = [Math.sqrt(3), Math.sqrt(3) / 2, 0, 3 / 2];
  inverseConversionMatrix = [Math.sqrt(3) / 3, -1 / 3, 0, 2 / 3];
  constructor() {
    super();
  }
};
var FlatHexaOrientation = class _FlatHexaOrientation extends HexaOrientation {
  static INSTANCE = new _FlatHexaOrientation();
  startAngle = 0;
  conversionMatrix = [3 / 2, 0, Math.sqrt(3) / 2, Math.sqrt(3)];
  inverseConversionMatrix = [2 / 3, 0, -1 / 3, Math.sqrt(3) / 3];
  constructor() {
    super();
  }
  isOnBorder(state, coord) {
    return this.isOnTopRightBorder(state, coord) || this.isOnRightBorder(state, coord) || this.isOnBottomRightBorder(state, coord) || this.isOnBottomLeftBorder(state, coord) || this.isOnLeftBorder(state, coord) || this.isOnTopLeftBorder(state, coord);
  }
  isOnTopRightBorder(board, coord) {
    return coord.y === 0;
  }
  isOnRightBorder(board, coord) {
    return coord.x === board.width - 1;
  }
  isOnLeftBorder(board, coord) {
    return coord.x === 0;
  }
  isOnBottomLeftBorder(board, coord) {
    return coord.y === board.height - 1;
  }
  isOnTopLeftBorder(board, coord) {
    if (board.excludedSpaces[coord.y] != null) {
      return coord.x === board.excludedSpaces[coord.y];
    } else if (coord.y === board.excludedSpaces.length) {
      return coord.x === 0;
    } else {
      return false;
    }
  }
  isOnBottomRightBorder(board, coord) {
    if (board.excludedSpaces[board.height - 1 - coord.y] != null) {
      return board.width - 1 - coord.x === board.excludedSpaces[board.height - 1 - coord.y];
    } else if (board.height - 1 - coord.y === board.excludedSpaces.length) {
      return coord.x === board.width - 1;
    } else {
      return false;
    }
  }
  getAllBorders(state) {
    const coords = [];
    state.forEachCoord((coord, _content) => {
      if (this.isOnBorder(state, coord)) {
        coords.push(coord);
      }
    });
    return coords;
  }
  isTopCorner(board, coord) {
    return this.isOnTopLeftBorder(board, coord) && this.isOnTopRightBorder(board, coord);
  }
  isTopLeftCorner(board, coord) {
    return this.isOnTopLeftBorder(board, coord) && this.isOnLeftBorder(board, coord);
  }
  isTopRightCorner(board, coord) {
    return this.isOnTopRightBorder(board, coord) && this.isOnRightBorder(board, coord);
  }
  isBottomCorner(board, coord) {
    return this.isOnBottomLeftBorder(board, coord) && this.isOnBottomRightBorder(board, coord);
  }
  isBottomLeftCorner(board, coord) {
    return this.isOnBottomLeftBorder(board, coord) && this.isOnLeftBorder(board, coord);
  }
  isBottomRightCorner(board, coord) {
    return this.isOnBottomRightBorder(board, coord) && this.isOnRightBorder(board, coord);
  }
};

// games/dist/jscaip/Line.js
var Line = class {
  x1;
  y1;
  x2;
  y2;
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
};

// games/dist/jscaip/Orthogonal.js
var Orthogonal = class _Orthogonal extends Direction {
  static UP = new _Orthogonal(0, -1);
  static RIGHT = new _Orthogonal(1, 0);
  static DOWN = new _Orthogonal(0, 1);
  static LEFT = new _Orthogonal(-1, 0);
  static factory = new class extends DirectionFactory {
    all = [
      _Orthogonal.RIGHT,
      _Orthogonal.DOWN,
      _Orthogonal.LEFT,
      _Orthogonal.UP
    ];
  }();
  static ORTHOGONALS = _Orthogonal.factory.all;
  static encoder = Encoder.fromFunctions((dir) => {
    return dir.toString();
  }, (encoded) => {
    Utils.assert(typeof encoded === "string", "Invalid encoded orthogonal");
    const fromString = _Orthogonal.factory.fromString(encoded);
    return fromString.get();
  });
  getOpposite() {
    const opposite = _Orthogonal.factory.from(-this.x, -this.y);
    return opposite.get();
  }
  rotateClockwise() {
    const rotated = _Orthogonal.factory.from(-this.y, this.x);
    return rotated.get();
  }
  toOrdinal() {
    switch (this) {
      case _Orthogonal.UP:
        return Ordinal.UP;
      case _Orthogonal.RIGHT:
        return Ordinal.RIGHT;
      case _Orthogonal.DOWN:
        return Ordinal.DOWN;
      default:
        Utils.expectToBe(this, _Orthogonal.LEFT);
        return Ordinal.LEFT;
    }
  }
  getAngle() {
    return this.toOrdinal().getAngle();
  }
};

// games/dist/jscaip/RelativePlayer.js
var RelativePlayer = class _RelativePlayer {
  value;
  static NONE = new _RelativePlayer("NONE");
  static OPPONENT = new _RelativePlayer("OPPONENT");
  static PLAYER = new _RelativePlayer("PLAYER");
  constructor(value) {
    this.value = value;
  }
};

// games/dist/jscaip/Rules.js
var SuperRules = class {
  constructor() {
  }
  /* The data that represent the status of the game at the current moment, including:
   * the board
   * the turn
   * the extra data that might be score of each player
   * the remaining piece that you can put on the board...
   */
  choose(node, move, config) {
    Debug.display("Rules", "choose", move.toString() + " was proposed");
    const legality = this.isLegal(move, node.gameState, config);
    if (legality.isFailure()) {
      Debug.display("Rules", "choose", "Move is illegal: " + legality.getReason());
      return MGPFallible.failure(legality.getReason());
    }
    const choice = node.getChild(move);
    if (choice.isPresent()) {
      Utils.assert(legality.isSuccess(), "Rules.choose: Move is illegal: " + legality.getReasonOr(""));
      Debug.display("Rules", "choose", "and this proposed move is found in the list, so it is legal");
      return MGPFallible.success(choice.get());
    }
    const resultingState = this.applyLegalMove(move, node.gameState, config, legality.get());
    const child = new GameNode(resultingState, MGPOptional.of(node), MGPOptional.of(move));
    return MGPFallible.success(child);
  }
  getInitialNode(config) {
    const initialState = this.getInitialState(config);
    return new GameNode(initialState);
  }
  getDefaultRulesConfig() {
    const rulesConfigDescription = this.getRulesConfigDescription();
    return rulesConfigDescription.getDefaultConfig().config;
  }
};
var ConfigurableRules = class extends SuperRules {
};
var Rules = class extends SuperRules {
  getRulesConfigDescription() {
    return RulesConfigDescription.EMPTY;
  }
};

// games/dist/jscaip/RulesFailure.js
var RulesFailure = class {
  static MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT = () => $localize`You have selected a piece of the opponent. You must pick one of your pieces.`;
  static MUST_CHOOSE_OWN_PIECE_NOT_EMPTY = () => $localize`You have selected an empty space, you must select one of your own pieces.`;
  static MUST_CLICK_ON_EMPTY_SPACE = () => $localize`You must click on an empty space.`;
  static MUST_CLICK_ON_EMPTY_SQUARE = () => $localize`You must click on an empty square.`;
  static SHOULD_LAND_ON_EMPTY_OR_OPPONENT_SPACE = () => $localize`Your landing space should be empty or contain a piece of the opponent.`;
  static CANNOT_SELF_CAPTURE = () => $localize`You cannot capture your own pieces.`;
  static CANNOT_PASS = () => $localize`You cannot pass your turn.`;
  static MUST_LAND_ON_EMPTY_SPACE = () => $localize`You must drop your piece on an empty space.`;
  static MUST_PASS = () => $localize`You must pass your turn.`;
  static MOVE_CANNOT_BE_STATIC = () => $localize`You must choose different starting and ending coordinates.`;
  static SOMETHING_IN_THE_WAY = () => $localize`There is a piece between the piece you chose and its landing space.`;
  static MUST_MOVE_ON_NEIGHBOR = () => $localize`You must move on a direct neighboring space.`;
};

// games/dist/jscaip/ScoreName.js
var ScoreName = class _ScoreName {
  zero;
  singular;
  plural;
  static POINTS = new _ScoreName(() => $localize`0 points`, () => $localize`1 point`, (n) => $localize`${n} points`);
  static CAPTURES = new _ScoreName(() => $localize`0 captures`, () => $localize`1 capture`, (n) => $localize`${n} captures`);
  static REMAINING_PIECES = new _ScoreName(() => $localize`0 remaining pieces`, () => $localize`1 remaining piece`, (n) => $localize`${n} remaining pieces`);
  static PIECES_TO_DROP = new _ScoreName(() => $localize`0 pieces to drop`, () => $localize`1 piece to drop`, (n) => $localize`${n} pieces to drop`);
  static PROTECTED_PIECES = new _ScoreName(() => $localize`0 protected pieces`, () => $localize`1 protected piece`, (n) => $localize`${n} protected pieces`);
  static PIECES_UNDER_CONTROL = new _ScoreName(() => $localize`0 pieces under control`, () => $localize`1 piece under control`, (n) => $localize`${n} pieces under control`);
  static STACKS_UNDER_CONTROL = new _ScoreName(() => $localize`0 stacks under control`, () => $localize`1 stack under control`, (n) => $localize`${n} stacks under control`);
  /**
   * A score name might be differently written for zero, one, or more than one "points".
   * Zero might be plural like in english, but different in another language, like french where it is singular.
   */
  constructor(zero, singular, plural) {
    this.zero = zero;
    this.singular = singular;
    this.plural = plural;
  }
  getString(count) {
    switch (count) {
      case 0:
        return this.zero();
      case 1:
        return this.singular();
      default:
        return this.plural(count);
    }
  }
};

// games/dist/jscaip/state/GameState.js
var GameState = class {
  turn;
  constructor(turn) {
    this.turn = turn;
  }
  getCurrentPlayer() {
    return Player.ofTurn(this.turn);
  }
  getPreviousOpponent() {
    return this.getCurrentPlayer();
  }
  getCurrentOpponent() {
    return this.turn % 2 === 1 ? Player.ZERO : Player.ONE;
  }
  getPreviousPlayer() {
    return this.getCurrentOpponent();
  }
};

// games/dist/jscaip/state/GameStateWithTable.js
var GameStateWithTable = class extends GameState {
  board;
  static setPieceAt(oldState, coord, value, stateAdapter) {
    const newBoard = oldState.getCopiedBoard();
    newBoard[coord.y][coord.x] = value;
    return stateAdapter(oldState, newBoard);
  }
  constructor(board, turn) {
    super(turn);
    this.board = board;
  }
  getPieceAt(coord) {
    Utils.assert(this.isOnBoard(coord), "Accessing coord not on board " + coord + ".");
    return this.getUnsafe(coord);
  }
  getUnsafe(coord) {
    return this.board[coord.y][coord.x];
  }
  hasPieceAt(coord, value) {
    return this.isOnBoard(coord) && comparableEquals(this.getUnsafe(coord), value);
  }
  hasInequalPieceAt(coord, value) {
    return this.isOnBoard(coord) && comparableEquals(this.getUnsafe(coord), value) === false;
  }
  getOptionalPieceAt(coord) {
    if (this.isOnBoard(coord)) {
      const value = this.getUnsafe(coord);
      return MGPOptional.of(value);
    } else {
      return MGPOptional.empty();
    }
  }
  getOptionalPieceAtXY(x, y) {
    const coord = new Coord(x, y);
    return this.getOptionalPieceAt(coord);
  }
  isOnBoard(coord) {
    const width = this.getWidth();
    const height = this.getHeight();
    return coord.isInRange(width, height);
  }
  isNotOnBoard(coord) {
    return this.isOnBoard(coord) === false;
  }
  getPieceAtXY(x, y) {
    return this.getPieceAt(new Coord(x, y));
  }
  forEachCoord(callback) {
    for (const { coord, content } of this.getCoordsAndContents()) {
      callback(coord, content);
    }
  }
  findMatchingCoord(predicate) {
    for (const { coord, content } of this.getCoordsAndContents()) {
      const result = predicate(coord, content);
      if (result) {
        return MGPOptional.of(coord);
      }
    }
    return MGPOptional.empty();
  }
  getCoordsAndContents() {
    const coordsAndContents = [];
    for (let y = 0; y < this.getHeight(); y++) {
      for (let x = 0; x < this.getWidth(); x++) {
        const coord = new Coord(x, y);
        if (this.isOnBoard(coord)) {
          coordsAndContents.push({
            coord,
            content: this.getPieceAt(coord)
          });
        }
      }
    }
    return coordsAndContents;
  }
  allCoords() {
    const coords = [];
    this.forEachCoord((coord) => {
      coords.push(coord);
    });
    return coords;
  }
  getCopiedBoard() {
    return TableUtils.copy(this.board);
  }
  toPieceMap() {
    const map = new MGPMap();
    for (const coordAndContent of this.getCoordsAndContents()) {
      const key = coordAndContent.content;
      const value = coordAndContent.coord;
      if (map.containsKey(key)) {
        const oldValue = map.get(key).get();
        map.put(key, oldValue.addElement(value));
      } else {
        map.set(key, new CoordSet([value]));
      }
    }
    return map;
  }
  getWidth() {
    return this.board[0].length;
  }
  getHeight() {
    return this.board.length;
  }
  isHorizontalEdge(coord) {
    const maxY = this.getHeight() - 1;
    return coord.y === 0 || coord.y === maxY;
  }
  isVerticalEdge(coord) {
    const maxX = this.getWidth() - 1;
    return coord.x === 0 || coord.x === maxX;
  }
  isEdge(coord) {
    return this.isHorizontalEdge(coord) || this.isVerticalEdge(coord);
  }
  isCorner(coord) {
    return this.isHorizontalEdge(coord) && this.isVerticalEdge(coord);
  }
  countPieceInRow(piece, row) {
    let result = 0;
    for (let x = 0; x < this.getWidth(); x++) {
      if (comparableEquals(this.board[row][x], piece)) {
        result++;
      }
    }
    return result;
  }
  countPieceOnBoard(piece) {
    let result = 0;
    for (const coordAndContent of this.getCoordsAndContents()) {
      if (comparableEquals(coordAndContent.content, piece)) {
        result++;
      }
    }
    return result;
  }
  [Symbol.iterator]() {
    const linedUpElements = [];
    for (const lines of this.board) {
      linedUpElements.push(...lines);
    }
    return linedUpElements.values();
  }
};

// games/dist/jscaip/state/FourStatePieceGameStateWithTable.js
var FourStatePieceGameStateWithTable = class _FourStatePieceGameStateWithTable extends GameStateWithTable {
  getPlayerCoordsAndContent() {
    return this.getCoordsAndContents().filter((value) => {
      return value.content.isPlayer();
    }).map((value) => {
      return {
        coord: value.coord,
        content: value.content.getPlayer()
      };
    });
  }
  isPlayerAt(coord) {
    const piece = this.getPieceAt(coord);
    return piece.isPlayer();
  }
  hasPieceBelongingTo(coord, player) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().is(player);
    } else {
      return false;
    }
  }
  coordIsOccupiedSquare(coord) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().isPlayer();
    } else {
      return false;
    }
  }
  isOnBoard(coord) {
    if (super.isOnBoard(coord)) {
      return this.getUnsafe(coord) !== FourStatePiece.UNREACHABLE;
    } else {
      return false;
    }
  }
  static of(oldState, newBoard) {
    return new _FourStatePieceGameStateWithTable(newBoard, oldState.turn);
  }
  incrementTurn() {
    return new _FourStatePieceGameStateWithTable(this.getCopiedBoard(), this.turn + 1);
  }
  setPieceAt(coord, value) {
    return GameStateWithTable.setPieceAt(this, coord, value, _FourStatePieceGameStateWithTable.of);
  }
};

// games/dist/jscaip/state/TriangularCheckerBoard.js
var TriangularCheckerBoard = class _TriangularCheckerBoard {
  static getDirections(c) {
    const left = Orthogonal.LEFT;
    const right = Orthogonal.RIGHT;
    if ((c.x + c.y) % 2 === 1) {
      const up = Orthogonal.UP;
      return [left, right, up];
    } else {
      const down = Orthogonal.DOWN;
      return [left, right, down];
    }
  }
  static getNeighbors(c) {
    return _TriangularCheckerBoard.getDirections(c).map((direction) => c.getNext(direction));
  }
  static getFakeNeighbors(c) {
    if ((c.x + c.y) % 2 === 1)
      return new Coord(c.x, c.y + 1);
    return new Coord(c.x, c.y - 1);
  }
  static getCommonNeighbor(a, b) {
    const aNeighbors = _TriangularCheckerBoard.getNeighbors(a);
    const bNeighbors = _TriangularCheckerBoard.getNeighbors(b);
    let i = 0;
    while (i < aNeighbors.length) {
      const aNeighbor = aNeighbors[i];
      let j = 0;
      while (j < bNeighbors.length) {
        const bNeighbor = bNeighbors[j];
        if (aNeighbor.equals(bNeighbor)) {
          return MGPOptional.of(aNeighbor);
        }
        j++;
      }
      i++;
    }
    return MGPOptional.empty();
  }
  static isSpaceDark(coord) {
    return (coord.x + coord.y) % 2 === 0;
  }
  static createBoard(size, empty, full) {
    const width = size * 2 - size % 2;
    const board = TableUtils.create(width, size, empty);
    const lineStartIndex = size - size % 2;
    for (let y = 0; y < size; y++) {
      const lineEndIndex = lineStartIndex + y * 2;
      for (let x = 0; x < width; x++) {
        const diagonalIndex = x + y;
        if (lineStartIndex <= diagonalIndex && diagonalIndex <= lineEndIndex) {
          board[y][x] = full;
        }
      }
    }
    return board;
  }
};

// games/dist/utils/MGPValidator.js
var MGPValidators = class {
  static range(min, max) {
    return (value) => {
      if (value < min) {
        return MGPValidation.failure(MGPValidatorsFailure.VALUE_IS_TOO_SMALL(value, min));
      } else if (max < value) {
        return MGPValidation.failure(MGPValidatorsFailure.VALUE_IS_TOO_HIGH(value, max));
      } else {
        return MGPValidation.SUCCESS;
      }
    };
  }
};
var MGPValidatorsFailure = class {
  static VALUE_IS_TOO_SMALL = (v, m) => $localize`${v} is too small, the minimum is ${m}`;
  static VALUE_IS_TOO_HIGH = (v, m) => $localize`${v} is too big, the maximum is ${m}`;
};

export {
  MGPFallible,
  MGPValidation,
  Utils,
  Encoder,
  MGPOptional,
  isJSONPrimitive,
  JSONParser,
  comparableEquals,
  ArrayUtils,
  Combinatorics,
  Set,
  MGPMap,
  ReversibleMap,
  MGPUniqueList,
  NumberMap,
  TimeUtils,
  BooleanConfig,
  EnumConfig,
  NumberConfig,
  RulesConfigDescription,
  MoveGenerator,
  AIStats,
  Player,
  PlayerOrNone,
  BoardValue,
  Debug,
  GameStatus,
  GameNodeStats,
  GameNode,
  MCTS,
  Heuristic,
  HeuristicWithBounds,
  PlayerMetricHeuristicWithBounds,
  AIInstanceRegistry,
  createMinimaxFromConfig,
  createIterativeDeepeningMinimaxFromConfig,
  createMCTSFromConfig,
  PlayerNumberTable,
  PlayerMetricHeuristic,
  DummyHeuristic,
  Vector,
  Direction,
  DirectionFactory,
  DirectionFailure,
  Ordinal,
  CoordFailure,
  Coord,
  TableUtils,
  TableWithPossibleNegativeIndices,
  Table3DUtils,
  GroupDataFactory,
  GroupData,
  Coord3D,
  CoordSet,
  FourStatePiece,
  HexaDirection,
  HexaLine,
  GipfCapture,
  GipfProjectHelper,
  GobanUtils,
  PointyHexaOrientation,
  FlatHexaOrientation,
  Line,
  Move,
  Orthogonal,
  PlayerMap,
  PlayerNumberMap,
  RelativePlayer,
  ConfigurableRules,
  Rules,
  RulesFailure,
  ScoreName,
  GameState,
  GameStateWithTable,
  FourStatePieceGameStateWithTable,
  TriangularCheckerBoard,
  LocaleUtils,
  MGPValidators
};
//# sourceMappingURL=chunk-KGBQ5KM3.js.map
