// ../../dsh-meow/packages/llm/llm/lib/index.js
import { createRequire } from "node:module";

// ../../dsh-meow/vendor/cosmokit/src/misc.ts
function isNullable(value) {
  return value === null || value === void 0;
}
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
function filterKeys(object, filter) {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
function mapValues(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
function pick(source, keys, forced) {
  if (!keys) return { ...source };
  const result = {};
  for (const key of keys) {
    if (forced || source[key] !== void 0) result[key] = source[key];
  }
  return result;
}

// ../../dsh-meow/vendor/cosmokit/src/types.ts
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
var Binary;
((Binary2) => {
  Binary2.is = isArrayBufferLike;
  Binary2.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source)) {
      return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    } else {
      return source;
    }
  }
  Binary2.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(source).toString("base64");
    }
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  Binary2.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  Binary2.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Binary2.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
    const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0; i < hex.length; i += 2) {
      buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    }
    return Uint8Array.from(buffer).buffer;
  }
  Binary2.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function clone(source, refs = /* @__PURE__ */ new Map()) {
  if (!source || typeof source !== "object") return source;
  if (is("Date", source)) return new Date(source.valueOf());
  if (is("RegExp", source)) return new RegExp(source.source, source.flags);
  if (isArrayBufferLike(source)) return source.slice(0);
  if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const cached = refs.get(source);
  if (cached) return cached;
  if (Array.isArray(source)) {
    const result2 = [];
    refs.set(source, result2);
    source.forEach((value, index) => {
      result2[index] = Reflect.apply(clone, null, [value, refs]);
    });
    return result2;
  }
  const result = Object.create(Object.getPrototypeOf(source));
  refs.set(source, result);
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
    if ("value" in descriptor) {
      descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
    }
    Reflect.defineProperty(result, key, descriptor);
  }
  return result;
}
function deepEqual(a, b, strict) {
  if (a === b) return true;
  if (!strict && isNullable(a) && isNullable(b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (!a || !b) return false;
  function check(test, then) {
    return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
  }
  return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? check(isArrayBufferLike, (a2, b2) => {
    if (a2.byteLength !== b2.byteLength) return false;
    const viewA = new Uint8Array(a2);
    const viewB = new Uint8Array(b2);
    for (let i = 0; i < viewA.length; i++) {
      if (viewA[i] !== viewB[i]) return false;
    }
    return true;
  }) ?? Object.keys({ ...a, ...b }).every((key) => deepEqual(a[key], b[key], strict));
}

// ../../dsh-meow/vendor/cosmokit/src/time.ts
var Time;
((Time2) => {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date3 = /* @__PURE__ */ new Date(), offset) {
    if (typeof date3 === "number") date3 = new Date(date3);
    if (offset === void 0) offset = timezoneOffset;
    return Math.floor((date3.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date3 = new Date(value * Time2.day);
    if (offset === void 0) offset = timezoneOffset;
    return new Date(+date3 + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture) return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  function parseDate(date3) {
    const parsed = parseTime(date3);
    if (parsed) {
      date3 = Date.now() + parsed;
    } else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date3)) {
      date3 = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date3}`;
    } else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date3)) {
      date3 = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date3}`;
    }
    return date3 ? new Date(date3) : /* @__PURE__ */ new Date();
  }
  Time2.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) {
      return Math.round(ms / Time2.day) + "d";
    } else if (abs >= Time2.hour - Time2.minute / 2) {
      return Math.round(ms / Time2.hour) + "h";
    } else if (abs >= Time2.minute - Time2.second / 2) {
      return Math.round(ms / Time2.minute) + "m";
    } else if (abs >= Time2.second) {
      return Math.round(ms / Time2.second) + "s";
    }
    return ms + "ms";
  }
  Time2.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  function template(template2, time = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time2.template = template;
})(Time || (Time = {}));

// ../../dsh-meow/vendor/schemastery/src/index.ts
var kSchema = Symbol.for("schemastery");
var kValidationError = Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError = class extends TypeError {
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || []) {
      if (typeof segment === "string") {
        prefix += "." + segment;
      } else if (typeof segment === "number") {
        prefix += "[" + segment + "]";
      } else if (typeof segment === "symbol") {
        prefix += `[Symbol(${segment.toString()})]`;
      }
    }
    if (prefix.startsWith(".")) prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  name = "ValidationError";
  static is(error) {
    return !!error?.[kValidationError];
  }
};
Object.defineProperty(ValidationError.prototype, kValidationError, {
  value: true
});
var Schema = function(options) {
  const schema = function(data, options2 = {}) {
    return Schema.resolve(data, schema, options2)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options2) => new Schema(options2));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options2 = refs[key];
      options2.sKey = getRef(options2.sKey);
      options2.inner = getRef(options2.inner);
      options2.list = options2.list && options2.list.map(getRef);
      options2.dict = options2.dict && mapValues(options2.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string") {
    try {
      schema.callback = new Function("return " + schema.callback)();
    } catch {
    }
  }
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", {
  get() {
    return {
      version: 1,
      vendor: "schemastery",
      validate: (value) => {
        try {
          return { value: Schema.resolve(value, this, {})[0] };
        } catch (error) {
          if (ValidationError.is(error)) {
            return { issues: [{ message: error.message, path: error.options.path }] };
          }
          throw error;
        }
      }
    };
  }
});
Schema.ValidationError = ValidationError;
Schema.prototype.toJSON = function toJSON() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = { uid: this.uid, refs: globalThis.__schemastery_refs__ };
  globalThis.__schemastery_refs__ = void 0;
  return result;
};
Schema.prototype.set = function set(key, value) {
  this.dict[key] = value;
  return this;
};
Schema.prototype.push = function push(value) {
  this.list.push(value);
  return this;
};
function mergeDesc(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc) {
      result[locale] = value.$description || value.$desc;
    } else if (typeof value === "string") {
      result[locale] = value;
    }
  }
  return result;
}
function getInner(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
  const schema = Schema(this);
  const desc = mergeDesc(schema.meta.description, messages);
  if (Object.keys(desc).length) schema.meta.description = desc;
  if (schema.dict) {
    schema.dict = mapValues(schema.dict, (inner, key) => {
      return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
    });
  }
  if (schema.list) {
    schema.list = schema.list.map((inner, index) => {
      return inner.i18n(mapValues(messages, (data = {}) => {
        if (Array.isArray(getInner(data))) return getInner(data)[index];
        if (Array.isArray(data)) return data[index];
        return extractKeys(data);
      }));
    });
  }
  if (schema.inner) {
    schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
      if (getInner(data)) return getInner(data);
      return extractKeys(data);
    }));
  }
  if (schema.sKey) {
    schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  }
  return schema;
};
Schema.prototype.extra = function extra(key, value) {
  const schema = Schema(this);
  schema.meta = { ...schema.meta, [key]: value };
  return schema;
};
for (const key of ["required", "disabled", "collapse", "hidden", "loose"]) {
  Object.assign(Schema.prototype, {
    [key](value = true) {
      const schema = Schema(this);
      schema.meta = { ...schema.meta, [key]: value };
      return schema;
    }
  });
}
Schema.prototype.deprecated = function deprecated() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({ text: "deprecated", type: "danger" });
  return schema;
};
Schema.prototype.experimental = function experimental() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({ text: "experimental", type: "warning" });
  return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
  const schema = Schema(this);
  const pattern3 = pick(regexp, ["source", "flags"]);
  schema.meta = { ...schema.meta, pattern: pattern3 };
  return schema;
};
Schema.prototype.simplify = function simplify(value) {
  if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
  if (isNullable(value)) return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const schema = this.type === "object" ? this.dict[key] : this.inner;
      const item = schema?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item)) result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value2, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value2) : value2;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list) {
      Object.assign(result, item.simplify(value));
    }
    return result;
  } else if (this.type === "union") {
    for (const schema of this.list) {
      try {
        Schema.resolve(value, schema, {});
        return schema.simplify(value);
      } catch {
      }
    }
  }
  return value;
};
Schema.prototype.toString = function toString(inline) {
  return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra3) {
  const schema = Schema(this);
  schema.meta = { ...schema.meta, role, extra: extra3 };
  return schema;
};
for (const key of ["default", "link", "comment", "description", "max", "min", "step"]) {
  Object.assign(Schema.prototype, {
    [key](value) {
      const schema = Schema(this);
      schema.meta = { ...schema.meta, [key]: value };
      return schema;
    }
  });
}
var resolvers = {};
Schema.extend = function extend(type, resolve3) {
  resolvers[type] = resolve3;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
  if (!schema) return [data];
  if (options.ignore?.(data, schema)) return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required) throw new ValidationError(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback)) return [data];
    data = clone(fallback);
  }
  const callback = resolvers[schema.type];
  if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error) {
    if (!schema.meta.loose) throw error;
    return [schema.meta.default];
  }
};
Schema.from = function from(source) {
  if (isNullable(source)) {
    return Schema.any();
  } else if (["string", "number", "boolean"].includes(typeof source)) {
    return Schema.const(source).required();
  } else if (source[kSchema]) {
    return source;
  } else if (typeof source === "function") {
    switch (source) {
      case String:
        return Schema.string().required();
      case Number:
        return Schema.number().required();
      case Boolean:
        return Schema.boolean().required();
      case Function:
        return Schema.function().required();
      default:
        return Schema.is(source).required();
    }
  } else {
    throw new TypeError(`cannot infer schema from ${source}`);
  }
};
Schema.lazy = function lazy(builder) {
  const toJSON3 = () => {
    if (!schema.inner[kSchema]) {
      schema.inner = schema.builder();
      schema.inner.meta = { ...schema.meta, ...schema.inner.meta };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema({ type: "lazy", builder, inner: { toJSON: toJSON3 } });
  return schema;
};
Schema.natural = function natural() {
  return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
  return Schema.number().step(0.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
  return Schema.union([
    Schema.is(Date),
    Schema.transform(Schema.string().role("datetime"), (value, options) => {
      const date3 = new Date(value);
      if (isNaN(+date3)) throw new ValidationError(`invalid date "${value}"`, options);
      return date3;
    }, true)
  ]);
};
Schema.regExp = function regExp(flag = "") {
  return Schema.union([
    Schema.is(RegExp),
    Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
      try {
        return new RegExp(value, flag);
      } catch (e) {
        throw new ValidationError(e.message, options);
      }
    }, true)
  ]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
  return Schema.union([
    Schema.is(ArrayBuffer),
    Schema.is(SharedArrayBuffer),
    Schema.transform(Schema.any(), (value, options) => {
      if (Binary.isSource(value)) return Binary.fromSource(value);
      throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema.transform(Schema.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema]) {
    schema.inner = schema.builder();
    schema.inner.meta = { ...schema.meta, ...schema.inner.meta };
  }
  return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
  return [data];
});
Schema.extend("never", (data, _, options) => {
  throw new ValidationError(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value)) return [value];
  throw new ValidationError(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta;
  if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta }, options) => {
  if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
  if (meta.pattern) {
    const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
    if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange(data.length, meta, "string length", options);
  return [data];
});
function decimalShift(data, digits) {
  const str = data.toString();
  if (str.includes("e")) return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1) return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer = str.slice(0, index);
  if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
  return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString())) {
    return (data - min) % step === 0;
  }
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta }, options) => {
  if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
  checkWithinRange(data, meta, "number", options);
  const { step } = meta;
  if (step && !isMultipleOf(data, meta.min ?? 0, step)) {
    throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
  }
  return [data];
});
Schema.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean") return [data];
  throw new ValidationError(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits) {
      if (data & bits[key]) {
        keys.push(key);
      }
    }
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
      if (key in bits) value |= bits[key];
    }
  } else {
    throw new ValidationError(`expected number or array but got ${data}`, options);
  }
  if (value === meta.default) return [value];
  return [value, keys];
});
Schema.extend("function", (data, _, options) => {
  if (typeof data === "function") return [data];
  throw new ValidationError(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor) return [data];
    throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data)) {
      throw new ValidationError(`expected ${constructor} but got ${data}`, options);
    }
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor) return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError(`expected ${constructor} but got ${data}`, options);
  }
});
function property(data, key, schema, options) {
  try {
    const [value, adapted] = Schema.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== void 0) data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix) throw e;
    delete data[key];
    return schema.meta.default;
  }
}
Schema.extend("array", (data, { inner, meta }, options) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema.resolve(key, sKey, options)[0];
    } catch (error) {
      if (strict) continue;
      throw error;
    }
    result[rKey] = property(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey) delete data[key];
  }
  return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property(data, index, inner, options));
  if (strict) return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge(result, data) {
  for (const key in data) {
    if (key in result) continue;
    result[key] = data[key];
  }
}
Schema.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property(data, key, dict[key], options);
    if (!isNullable(value) || key in data) {
      result[key] = value;
    }
  }
  if (!strict) merge(result, data);
  return [result];
});
Schema.extend("union", (data, { list, toString: toString3 }, options, strict) => {
  const messages = [];
  for (const inner of list) {
    try {
      return Schema.resolve(data, inner, options, strict);
    } catch (error) {
      messages.push(error);
    }
  }
  throw new ValidationError(`expected ${toString3()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString: toString3 }, options, strict) => {
  if (!list.length) return [data];
  let result;
  for (const inner of list) {
    const value = Schema.resolve(data, inner, options, true)[0];
    if (isNullable(value)) continue;
    if (isNullable(result)) {
      result = value;
    } else if (typeof result !== typeof value) {
      throw new ValidationError(`expected ${toString3()} but got ${JSON.stringify(data)}`, options);
    } else if (typeof value === "object") {
      merge(result ??= {}, value);
    } else if (result !== value) {
      throw new ValidationError(`expected ${toString3()} but got ${JSON.stringify(data)}`, options);
    }
  }
  if (!strict && isPlainObject(data)) merge(result, data);
  return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema.resolve(data, inner, options, true);
  if (preserve) {
    return [callback(result)];
  } else {
    return [callback(result), callback(adapted)];
  }
});
var formatters = {};
function defineMethod(name2, keys, format) {
  formatters[name2] = format;
  Object.assign(Schema, {
    [name2](...args) {
      const schema = new Schema({ type: name2 });
      keys.forEach((key, index) => {
        switch (key) {
          case "sKey":
            schema.sKey = args[index] ?? Schema.string();
            break;
          case "inner":
            schema.inner = Schema.from(args[index]);
            break;
          case "list":
            schema.list = args[index].map(Schema.from);
            break;
          case "dict":
            schema.dict = mapValues(args[index], Schema.from);
            break;
          case "bits": {
            schema.bits = {};
            for (const key2 in args[index]) {
              if (typeof args[index][key2] !== "number") continue;
              schema.bits[key2] = args[index][key2];
            }
            break;
          }
          case "callback": {
            const callback = schema.callback = args[index];
            callback["toJSON"] ||= () => callback.toString();
            break;
          }
          case "constructor": {
            const constructor = schema.constructor = args[index];
            if (typeof constructor === "function") {
              ;
              constructor["toJSON"] ||= () => constructor["name"];
            }
            break;
          }
          default:
            schema[key] = args[index];
        }
      });
      if (name2 === "object" || name2 === "dict") {
        schema.meta.default = {};
      } else if (name2 === "array" || name2 === "tuple") {
        schema.meta.default = [];
      } else if (name2 === "bitset") {
        schema.meta.default = 0;
      }
      return schema;
    }
  });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function") {
    return constructor.name;
  } else {
    return constructor;
  }
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0) return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", ["inner", "callback", "preserve"], ({ inner }, isInner) => inner.toString(isInner));
var src_default = Schema;

// ../../dsh-meow/packages/util/timeout/src/index.ts
var MAX_TIMER_DELAY_MS = 2147483647;

// ../../dsh-meow/packages/llm/llm/lib/index.js
function MessageId(id) {
  return id;
}
function deepFreeze(value) {
  const seen = /* @__PURE__ */ new WeakSet();
  const pending = [{
    kind: "visit",
    node: value
  }];
  while (pending.length > 0) {
    const task = pending.pop();
    if (task === void 0) continue;
    if (task.kind === "property") {
      pending.push({
        kind: "visit",
        node: task.source[task.key]
      });
      continue;
    }
    const node = task.node;
    if (node === null || typeof node !== "object") continue;
    if (node instanceof AbortSignal) continue;
    if (seen.has(node)) continue;
    seen.add(node);
    Object.freeze(node);
    const keys = Object.keys(node);
    for (let index = keys.length - 1; index >= 0; index--) {
      const key = keys[index];
      if (key === void 0) continue;
      pending.push({
        kind: "property",
        source: node,
        key
      });
    }
  }
  return value;
}
function boundContextSummary(summary) {
  return summary.length <= 120 ? summary : `${summary.slice(0, 119)}\u2026`;
}
function freezeMessage(message) {
  return deepFreeze(structuredClone(message));
}
function createMessage(input) {
  return freezeMessage({
    ...input,
    id: MessageId(crypto.randomUUID())
  });
}
function createUserMessage(input) {
  return createMessage({
    ...input,
    role: "user"
  });
}
var EMPTY_RESPONSE_CODE = "EMPTY_RESPONSE";
var STRUCTURED_CONTEXT_OVERFLOW = new RegExp(String.raw`(?:^|[^a-z0-9])context[\s_-](?:length|window)[\s_-]` + String.raw`(?:exceed(?:ed|s)?|overflow(?:ed)?|limit[\s_-]exceeded)(?:$|[^a-z0-9])`, "i");
var TOO_LARGE_FOR_CONTEXT = new RegExp(String.raw`\b(?:request|prompt|input|messages?)\s+(?:is\s+|are\s+)?` + String.raw`too\s+(?:large|long)\s+for\s+(?:(?:this|the)\s+)?` + String.raw`(?:model(?:'s)?\s+)?context(?:\s+window)?\b`, "i");
var EXCEEDS_MODEL_CONTEXT = new RegExp(String.raw`\b(?:input|prompt|request|messages?)\b.{0,40}` + String.raw`\b(?:exceed(?:s|ed)?|overflows?|is\s+larger\s+than)\b.{0,40}` + String.raw`\b(?:the\s+)?(?:model(?:'s)?\s+)?context(?:\s+(?:length|window))?\b`, "i");
var DEFAULT_MAX_RETRIES = 2;
var DEFAULT_INITIAL_DELAY_MS = 500;
var DEFAULT_MAX_DELAY_MS = 1e4;
var DEFAULT_JITTER_RATIO = 0.1;
var DEFAULT_RETRYABLE_CODES = Object.freeze([
  EMPTY_RESPONSE_CODE,
  "RATE_LIMIT",
  "SERVER",
  "TIMEOUT",
  "TRANSPORT"
]);
var backoffSchema = src_default.object({
  initialDelayMs: src_default.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_INITIAL_DELAY_MS),
  maxDelayMs: src_default.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_MAX_DELAY_MS),
  jitterRatio: src_default.number().min(0).max(1).default(DEFAULT_JITTER_RATIO)
});
var normalPolicySchema = src_default.object({
  mode: src_default.const("normal").required(),
  maxRetries: src_default.number().step(1).min(0).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_MAX_RETRIES),
  retryableCodes: src_default.array(src_default.string()).default([...DEFAULT_RETRYABLE_CODES]),
  backoff: backoffSchema
});
var alwaysPolicySchema = src_default.object({
  mode: src_default.const("always").required(),
  backoff: backoffSchema
});
var RetryPolicySchema = src_default.union([normalPolicySchema, alwaysPolicySchema]);
var { version } = createRequire(import.meta.url)("../package.json");

// ../../dsh-meow/vendor/schemastery/lib/index.mjs
var kSchema2 = Symbol.for("schemastery");
var kValidationError2 = Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError2 = class extends TypeError {
  options;
  name = "ValidationError";
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
    else if (typeof segment === "number") prefix += "[" + segment + "]";
    else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
    if (prefix.startsWith(".")) prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  static is(error) {
    return !!error?.[kValidationError2];
  }
};
Object.defineProperty(ValidationError2.prototype, kValidationError2, { value: true });
var Schema2 = function(options) {
  const schema = function(data, options2 = {}) {
    return Schema2.resolve(data, schema, options2)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options2) => new Schema2(options2));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options2 = refs[key];
      options2.sKey = getRef(options2.sKey);
      options2.inner = getRef(options2.inner);
      options2.list = options2.list && options2.list.map(getRef);
      options2.dict = options2.dict && mapValues(options2.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string") try {
    schema.callback = new Function("return " + schema.callback)();
  } catch {
  }
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema2.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema2.prototype = Object.create(Function.prototype);
Schema2.prototype[kSchema2] = true;
Object.defineProperty(Schema2.prototype, "~standard", { get() {
  return {
    version: 1,
    vendor: "schemastery",
    validate: (value) => {
      try {
        return { value: Schema2.resolve(value, this, {})[0] };
      } catch (error) {
        if (ValidationError2.is(error)) return { issues: [{
          message: error.message,
          path: error.options.path
        }] };
        throw error;
      }
    }
  };
} });
Schema2.ValidationError = ValidationError2;
Schema2.prototype.toJSON = function toJSON2() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = {
    uid: this.uid,
    refs: globalThis.__schemastery_refs__
  };
  globalThis.__schemastery_refs__ = void 0;
  return result;
};
Schema2.prototype.set = function set2(key, value) {
  this.dict[key] = value;
  return this;
};
Schema2.prototype.push = function push2(value) {
  this.list.push(value);
  return this;
};
function mergeDesc2(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
    else if (typeof value === "string") result[locale] = value;
  }
  return result;
}
function getInner2(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys2(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema2.prototype.i18n = function i18n2(messages) {
  const schema = Schema2(this);
  const desc = mergeDesc2(schema.meta.description, messages);
  if (Object.keys(desc).length) schema.meta.description = desc;
  if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
    return inner.i18n(mapValues(messages, (data) => getInner2(data)?.[key] ?? data?.[key]));
  });
  if (schema.list) schema.list = schema.list.map((inner, index) => {
    return inner.i18n(mapValues(messages, (data = {}) => {
      if (Array.isArray(getInner2(data))) return getInner2(data)[index];
      if (Array.isArray(data)) return data[index];
      return extractKeys2(data);
    }));
  });
  if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
    if (getInner2(data)) return getInner2(data);
    return extractKeys2(data);
  }));
  if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  return schema;
};
Schema2.prototype.extra = function extra2(key, value) {
  const schema = Schema2(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
};
for (const key of [
  "required",
  "disabled",
  "collapse",
  "hidden",
  "loose"
]) Object.assign(Schema2.prototype, { [key](value = true) {
  const schema = Schema2(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
Schema2.prototype.deprecated = function deprecated2() {
  const schema = Schema2(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "deprecated",
    type: "danger"
  });
  return schema;
};
Schema2.prototype.experimental = function experimental2() {
  const schema = Schema2(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "experimental",
    type: "warning"
  });
  return schema;
};
Schema2.prototype.pattern = function pattern2(regexp) {
  const schema = Schema2(this);
  const pattern3 = pick(regexp, ["source", "flags"]);
  schema.meta = {
    ...schema.meta,
    pattern: pattern3
  };
  return schema;
};
Schema2.prototype.simplify = function simplify2(value) {
  if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
  if (isNullable(value)) return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item)) result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value2, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value2) : value2;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list) Object.assign(result, item.simplify(value));
    return result;
  } else if (this.type === "union") for (const schema of this.list) try {
    Schema2.resolve(value, schema, {});
    return schema.simplify(value);
  } catch {
  }
  return value;
};
Schema2.prototype.toString = function toString2(inline) {
  return formatters2[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema2.prototype.role = function role2(role2, extra3) {
  const schema = Schema2(this);
  schema.meta = {
    ...schema.meta,
    role: role2,
    extra: extra3
  };
  return schema;
};
for (const key of [
  "default",
  "link",
  "comment",
  "description",
  "max",
  "min",
  "step"
]) Object.assign(Schema2.prototype, { [key](value) {
  const schema = Schema2(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
var resolvers2 = {};
Schema2.extend = function extend2(type, resolve3) {
  resolvers2[type] = resolve3;
};
Schema2.resolve = function resolve2(data, schema, options = {}, strict = false) {
  if (!schema) return [data];
  if (options.ignore?.(data, schema)) return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required) throw new ValidationError2(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback)) return [data];
    data = clone(fallback);
  }
  const callback = resolvers2[schema.type];
  if (!callback) throw new ValidationError2(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error) {
    if (!schema.meta.loose) throw error;
    return [schema.meta.default];
  }
};
Schema2.from = function from2(source) {
  if (isNullable(source)) return Schema2.any();
  else if ([
    "string",
    "number",
    "boolean"
  ].includes(typeof source)) return Schema2.const(source).required();
  else if (source[kSchema2]) return source;
  else if (typeof source === "function") switch (source) {
    case String:
      return Schema2.string().required();
    case Number:
      return Schema2.number().required();
    case Boolean:
      return Schema2.boolean().required();
    case Function:
      return Schema2.function().required();
    default:
      return Schema2.is(source).required();
  }
  else throw new TypeError(`cannot infer schema from ${source}`);
};
Schema2.lazy = function lazy2(builder) {
  const toJSON3 = () => {
    if (!schema.inner[kSchema2]) {
      schema.inner = schema.builder();
      schema.inner.meta = {
        ...schema.meta,
        ...schema.inner.meta
      };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema2({
    type: "lazy",
    builder,
    inner: { toJSON: toJSON3 }
  });
  return schema;
};
Schema2.natural = function natural2() {
  return Schema2.number().step(1).min(0);
};
Schema2.percent = function percent2() {
  return Schema2.number().step(0.01).min(0).max(1).role("slider");
};
Schema2.date = function date2() {
  return Schema2.union([Schema2.is(Date), Schema2.transform(Schema2.string().role("datetime"), (value, options) => {
    const date3 = new Date(value);
    if (isNaN(+date3)) throw new ValidationError2(`invalid date "${value}"`, options);
    return date3;
  }, true)]);
};
Schema2.regExp = function regExp2(flag = "") {
  return Schema2.union([Schema2.is(RegExp), Schema2.transform(Schema2.string().role("regexp", { flag }), (value, options) => {
    try {
      return new RegExp(value, flag);
    } catch (e) {
      throw new ValidationError2(e.message, options);
    }
  }, true)]);
};
Schema2.arrayBuffer = function arrayBuffer2(encoding) {
  return Schema2.union([
    Schema2.is(ArrayBuffer),
    Schema2.is(SharedArrayBuffer),
    Schema2.transform(Schema2.any(), (value, options) => {
      if (Binary.isSource(value)) return Binary.fromSource(value);
      throw new ValidationError2(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema2.transform(Schema2.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError2(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema2.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema2]) {
    schema.inner = schema.builder();
    schema.inner.meta = {
      ...schema.meta,
      ...schema.inner.meta
    };
  }
  return Schema2.resolve(data, schema.inner, options, strict);
});
Schema2.extend("any", (data) => {
  return [data];
});
Schema2.extend("never", (data, _, options) => {
  throw new ValidationError2(`expected nullable but got ${data}`, options);
});
Schema2.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value)) return [value];
  throw new ValidationError2(`expected ${value} but got ${data}`, options);
});
function checkWithinRange2(data, meta, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta;
  if (data > max) throw new ValidationError2(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin) throw new ValidationError2(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema2.extend("string", (data, { meta }, options) => {
  if (typeof data !== "string") throw new ValidationError2(`expected string but got ${data}`, options);
  if (meta.pattern) {
    const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
    if (!regexp.test(data)) throw new ValidationError2(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange2(data.length, meta, "string length", options);
  return [data];
});
function decimalShift2(data, digits) {
  const str = data.toString();
  if (str.includes("e")) return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1) return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer = str.slice(0, index);
  if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
  return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf2(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift2(data, digits) - decimalShift2(min, digits)) % decimalShift2(step, digits) === 0;
}
Schema2.extend("number", (data, { meta }, options) => {
  if (typeof data !== "number") throw new ValidationError2(`expected number but got ${data}`, options);
  checkWithinRange2(data, meta, "number", options);
  const { step } = meta;
  if (step && !isMultipleOf2(data, meta.min ?? 0, step)) throw new ValidationError2(`expected number multiple of ${step} but got ${data}`, options);
  return [data];
});
Schema2.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean") return [data];
  throw new ValidationError2(`expected boolean but got ${data}`, options);
});
Schema2.extend("bitset", (data, { bits, meta }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits) if (data & bits[key]) keys.push(key);
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string") throw new ValidationError2(`expected string but got ${key}`, options);
      if (key in bits) value |= bits[key];
    }
  } else throw new ValidationError2(`expected number or array but got ${data}`, options);
  if (value === meta.default) return [value];
  return [value, keys];
});
Schema2.extend("function", (data, _, options) => {
  if (typeof data === "function") return [data];
  throw new ValidationError2(`expected function but got ${data}`, options);
});
Schema2.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor) return [data];
    throw new ValidationError2(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data)) throw new ValidationError2(`expected ${constructor} but got ${data}`, options);
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor) return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError2(`expected ${constructor} but got ${data}`, options);
  }
});
function property2(data, key, schema, options) {
  try {
    const [value, adapted] = Schema2.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== void 0) data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix) throw e;
    delete data[key];
    return schema.meta.default;
  }
}
Schema2.extend("array", (data, { inner, meta }, options) => {
  if (!Array.isArray(data)) throw new ValidationError2(`expected array but got ${data}`, options);
  checkWithinRange2(data.length, meta, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property2(data, index, inner, options))];
});
Schema2.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError2(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema2.resolve(key, sKey, options)[0];
    } catch (error) {
      if (strict) continue;
      throw error;
    }
    result[rKey] = property2(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey) delete data[key];
  }
  return [result];
});
Schema2.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data)) throw new ValidationError2(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property2(data, index, inner, options));
  if (strict) return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge2(result, data) {
  for (const key in data) {
    if (key in result) continue;
    result[key] = data[key];
  }
}
Schema2.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError2(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property2(data, key, dict[key], options);
    if (!isNullable(value) || key in data) result[key] = value;
  }
  if (!strict) merge2(result, data);
  return [result];
});
Schema2.extend("union", (data, { list, toString: toString3 }, options, strict) => {
  const messages = [];
  for (const inner of list) try {
    return Schema2.resolve(data, inner, options, strict);
  } catch (error) {
    messages.push(error);
  }
  throw new ValidationError2(`expected ${toString3()} but got ${JSON.stringify(data)}`, options);
});
Schema2.extend("intersect", (data, { list, toString: toString3 }, options, strict) => {
  if (!list.length) return [data];
  let result;
  for (const inner of list) {
    const value = Schema2.resolve(data, inner, options, true)[0];
    if (isNullable(value)) continue;
    if (isNullable(result)) result = value;
    else if (typeof result !== typeof value) throw new ValidationError2(`expected ${toString3()} but got ${JSON.stringify(data)}`, options);
    else if (typeof value === "object") merge2(result ??= {}, value);
    else if (result !== value) throw new ValidationError2(`expected ${toString3()} but got ${JSON.stringify(data)}`, options);
  }
  if (!strict && isPlainObject(data)) merge2(result, data);
  return [result];
});
Schema2.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema2.resolve(data, inner, options, true);
  if (preserve) return [callback(result)];
  else return [callback(result), callback(adapted)];
});
var formatters2 = {};
function defineMethod2(name2, keys, format) {
  formatters2[name2] = format;
  Object.assign(Schema2, { [name2](...args) {
    const schema = new Schema2({ type: name2 });
    keys.forEach((key, index) => {
      switch (key) {
        case "sKey":
          schema.sKey = args[index] ?? Schema2.string();
          break;
        case "inner":
          schema.inner = Schema2.from(args[index]);
          break;
        case "list":
          schema.list = args[index].map(Schema2.from);
          break;
        case "dict":
          schema.dict = mapValues(args[index], Schema2.from);
          break;
        case "bits":
          schema.bits = {};
          for (const key2 in args[index]) {
            if (typeof args[index][key2] !== "number") continue;
            schema.bits[key2] = args[index][key2];
          }
          break;
        case "callback": {
          const callback = schema.callback = args[index];
          callback["toJSON"] ||= () => callback.toString();
          break;
        }
        case "constructor": {
          const constructor = schema.constructor = args[index];
          if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
          break;
        }
        default:
          schema[key] = args[index];
      }
    });
    if (name2 === "object" || name2 === "dict") schema.meta.default = {};
    else if (name2 === "array" || name2 === "tuple") schema.meta.default = [];
    else if (name2 === "bitset") schema.meta.default = 0;
    return schema;
  } });
}
defineMethod2("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function") return constructor.name;
  else return constructor;
});
defineMethod2("any", [], () => "any");
defineMethod2("never", [], () => "never");
defineMethod2("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod2("string", [], () => "string");
defineMethod2("number", [], () => "number");
defineMethod2("boolean", [], () => "boolean");
defineMethod2("bitset", ["bits"], () => "bitset");
defineMethod2("function", [], () => "function");
defineMethod2("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod2("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod2("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod2("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0) return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod2("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod2("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod2("transform", [
  "inner",
  "callback",
  "preserve"
], ({ inner }, isInner) => inner.toString(isInner));

// src/index.ts
import { appendFileSync as appendFileSync2, existsSync as existsSync5, mkdirSync as mkdirSync4, readFileSync as readFileSync5, writeFileSync as writeFileSync3 } from "node:fs";
import { homedir as homedir3 } from "node:os";
import { dirname as dirname5, join as join7 } from "node:path";

// src/db.ts
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname as dirname2, join as join2 } from "node:path";
import { DatabaseSync } from "node:sqlite";

// src/prompt-loader.ts
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
var PROMPTS_DIR = join(dirname(fileURLToPath(import.meta.url)), "prompts");
var OVERRIDE_DIR = join(homedir(), ".dsh-meow", "prompts");
var DEFAULT_LANG = "zh";
var currentLang = DEFAULT_LANG;
function setPromptLang(lang) {
  currentLang = lang;
}
function getPromptLang() {
  return currentLang;
}
var SLOTS = [
  "system-guide",
  "reflect",
  "dream-header",
  "dream-atomic",
  "dream-topic",
  "dream-project-summary",
  "welcome-guide",
  "labels",
  "tools"
];
var SLOT_PARAMS = {
  reflect: ["projectList"],
  "dream-header": ["timestamp", "idx", "total", "roundKind"],
  "dream-topic": ["list"],
  "dream-project-summary": ["projects"],
  "welcome-guide": ["homePath"]
};
function readSlotFile(slot, lang) {
  const read = (p) => readFileSync(p, "utf8").replace(/\s+$/, "").replace(/\\_/g, "_");
  const override = join(OVERRIDE_DIR, lang, `${slot}.md`);
  if (existsSync(override)) return read(override);
  if (lang !== DEFAULT_LANG) {
    const primary = join(PROMPTS_DIR, lang, `${slot}.md`);
    if (existsSync(primary)) return read(primary);
  }
  return read(join(PROMPTS_DIR, DEFAULT_LANG, `${slot}.md`));
}
function fillTemplate(text, params = {}) {
  let out = text;
  for (const [k, v] of Object.entries(params)) out = out.replaceAll(`{${k}}`, () => v);
  return out;
}
function parseKeyValueText(text) {
  const map = /* @__PURE__ */ new Map();
  let cur = null;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (line.startsWith("- ")) {
      const sep = line.indexOf(": ");
      if (sep > 2) {
        cur = line.slice(2, sep);
        map.set(cur, line.slice(sep + 2));
        continue;
      }
    }
    if (cur !== null && line.startsWith("  ") && line.trim().length > 0) {
      map.set(cur, `${map.get(cur)}
${line.trimStart()}`);
    }
  }
  return map;
}
function resolveSlotText(slot, params = {}, lang = getPromptLang()) {
  const required = SLOT_PARAMS[slot] ?? [];
  for (const p of required) {
    if (!(p in params)) throw new Error(`[meow-memory] \u69FD\u4F4D ${slot} \u7F3A\u5C11\u5FC5\u9700\u5360\u4F4D\u7B26 {${p}}`);
  }
  return fillTemplate(readSlotFile(slot, lang), params);
}
function keyedValue(slot, key, lang = getPromptLang()) {
  const v = resolveKeyedText(slot, lang).get(key);
  if (v === void 0) throw new Error(`[meow-memory] prompt \u6587\u6848\u7F3A\u5931\uFF1A${slot}.md \u7684 "${key}"`);
  return v;
}
function resolveKeyedText(slot, lang = getPromptLang()) {
  return parseKeyValueText(readSlotFile(slot, lang));
}

// src/db.ts
var LEVELS = ["soul", "user", "project", "fact", "lesson", "topic", "rules"];
var PROJECT_SUBCATEGORIES = ["overview", "structure", "decisions", "quotes", "ops", "todo"];
var lbl = (key, params) => fillTemplate(keyedValue("labels", key), params);
function relativeTime(ms) {
  if (!ms) return lbl("time.none");
  const diff = Date.now() - ms;
  if (diff < 6e4) return lbl("time.justNow");
  if (diff < 36e5) return lbl("time.minutes", { n: String(Math.floor(diff / 6e4)) });
  if (diff < 864e5) return lbl("time.hours", { n: String(Math.floor(diff / 36e5)) });
  if (diff < 30 * 864e5) return lbl("time.days", { n: String(Math.floor(diff / 864e5)) });
  return new Date(ms).toISOString().slice(0, 10);
}
var GLOBAL_PROJECT_CANON = "\u5168\u5C40";
var markerCache = null;
function globalProjectMarker() {
  const lang = getPromptLang();
  if (markerCache !== null && markerCache.lang === lang) return markerCache.marker;
  let marker;
  try {
    marker = lbl("project.global");
  } catch {
    marker = GLOBAL_PROJECT_CANON;
  }
  markerCache = { lang, marker };
  return marker;
}
var GLOBAL_PROJECT_CANON_EN = "global";
function isGlobalProject(field) {
  if (field === null) return false;
  const trimmed = field.trim();
  if (trimmed === GLOBAL_PROJECT_CANON) return true;
  if (trimmed.toLowerCase() === GLOBAL_PROJECT_CANON_EN) return true;
  return trimmed.toLowerCase() === globalProjectMarker().toLowerCase();
}
function isGlobalScope(field) {
  if (field === null) return true;
  const trimmed = field.trim();
  return trimmed === "" || isGlobalProject(trimmed);
}
function projectList(field) {
  if (!field || isGlobalProject(field)) return [];
  return field.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
}
function projectCovers(field, name2) {
  if (field === null || isGlobalProject(field)) return true;
  return projectList(field).includes(name2);
}
function projectLabel(field) {
  if (isGlobalProject(field)) return globalProjectMarker();
  if (field === null || field === "") return lbl("project.unlabeled");
  return projectList(field).join("/");
}
function newId(now = Date.now()) {
  const t = now.toString(36).padStart(9, "0");
  return t + "-" + randomUUID().replace(/-/g, "").slice(0, 26);
}
var COMMON_COLS = `
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  importance INTEGER NOT NULL DEFAULT 1,
  keywords TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  source_session TEXT,
  hit_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_accessed_at INTEGER
`;
var SCHEMAS = {
  soul: `CREATE TABLE IF NOT EXISTS soul (${COMMON_COLS})`,
  user: `CREATE TABLE IF NOT EXISTS user (${COMMON_COLS})`,
  project: `CREATE TABLE IF NOT EXISTS project (${COMMON_COLS},
    project TEXT NOT NULL,
    subcategory TEXT)`,
  fact: `CREATE TABLE IF NOT EXISTS fact (${COMMON_COLS},
    project TEXT)`,
  lesson: `CREATE TABLE IF NOT EXISTS lesson (${COMMON_COLS},
    corrected INTEGER NOT NULL DEFAULT 0,
    project TEXT)`,
  topic: `CREATE TABLE IF NOT EXISTS topic (${COMMON_COLS},
    goal TEXT,
    project TEXT)`,
  rules: `CREATE TABLE IF NOT EXISTS rules (${COMMON_COLS},
    project TEXT)`
  // project 可空：null=全局准则（高 importance 全量注入），非空=项目特定（memory_project 注入）
};
function memoryDbPath(workspace, dir = ".dsh-meow") {
  return join2(workspace, dir, "memory.db");
}
var MemoryDb = class {
  db;
  constructor(path) {
    mkdirSync(dirname2(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec("PRAGMA busy_timeout = 5000");
    for (const level of LEVELS) this.db.exec(SCHEMAS[level]);
    this.db.exec(`CREATE TABLE IF NOT EXISTS dream_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_at INTEGER NOT NULL,
      summary TEXT,
      changes TEXT,
      note TEXT
    )`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS windows (
      session_id TEXT PRIMARY KEY,
      workspace TEXT,
      last_event_time INTEGER,
      last_dream_time INTEGER,
      dream_owner TEXT,
      dream_started_at INTEGER,
      dream_progress_at INTEGER,
      dream_group_idx INTEGER,
      dream_T INTEGER
    )`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS dream_meta (
      key TEXT PRIMARY KEY,
      value INTEGER
    )`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS dream_skip (
      session_id TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL
    )`);
    this.upgrade();
  }
  /** 幂等升级：缺列补列；旧 UUID id 按 created_at 重排为时间前缀 id；
   *  v0.7.0：dream_at 列并入 updated_at（记忆时间戳=最后更新时间）后删除。 */
  upgrade() {
    for (const level of LEVELS) {
      const cols = new Set(
        this.db.prepare(`PRAGMA table_info(${level})`).all().map((c) => c.name)
      );
      if (cols.has("dream_at")) {
        this.db.exec(`UPDATE ${level} SET updated_at = MAX(COALESCE(updated_at, 0), COALESCE(dream_at, 0)) WHERE dream_at IS NOT NULL`);
        this.db.exec(`ALTER TABLE ${level} DROP COLUMN dream_at`);
      }
      if (level === "project" && !cols.has("subcategory")) {
        this.db.exec("ALTER TABLE project ADD COLUMN subcategory TEXT");
      }
      if (level === "topic" && !cols.has("project")) {
        this.db.exec("ALTER TABLE topic ADD COLUMN project TEXT");
      }
      const legacy = this.db.prepare(`SELECT id FROM ${level}`).all();
      for (const { id } of legacy) {
        if (/^[0-9a-z]{9}-/.test(id)) continue;
        const created = this.db.prepare(`SELECT created_at FROM ${level} WHERE id = ?`).get(id).created_at;
        this.db.prepare(`UPDATE ${level} SET id = ? WHERE id = ?`).run(newId(created), id);
      }
    }
    const wCols = new Set(
      this.db.prepare("PRAGMA table_info(windows)").all().map((c) => c.name)
    );
    for (const [col, ddl] of [
      ["dream_owner", "TEXT"],
      ["dream_started_at", "INTEGER"],
      ["dream_progress_at", "INTEGER"],
      ["dream_group_idx", "INTEGER"],
      ["dream_T", "INTEGER"]
    ]) {
      if (!wCols.has(col)) this.db.exec(`ALTER TABLE windows ADD COLUMN ${col} ${ddl}`);
    }
    if (wCols.has("dream_pending")) {
      this.db.exec(`UPDATE windows SET dream_owner = 'legacy-pending', dream_started_at = 0, dream_progress_at = 0, dream_group_idx = 0, dream_T = last_event_time WHERE dream_pending = 1 AND dream_owner IS NULL`);
    }
  }
  /** 新库（memories 全空）判定：迁移只在库刚创建时执行一次。 */
  isFresh() {
    const row = this.db.prepare("SELECT COUNT(*) AS n FROM soul").get();
    return row.n === 0;
  }
  insert(row) {
    const now = Date.now();
    const full = {
      id: row.id ?? newId(now),
      level: row.level,
      title: row.title ?? null,
      content: row.content,
      importance: row.importance ?? 1,
      keywords: row.keywords ?? [],
      status: row.status ?? "active",
      corrected: row.corrected ?? 0,
      project: row.project ?? null,
      subcategory: row.subcategory ?? null,
      goal: row.goal ?? null,
      source_session: row.source_session ?? null,
      hit_count: row.hit_count ?? 0,
      created_at: row.created_at ?? now,
      updated_at: row.updated_at ?? now,
      last_accessed_at: row.last_accessed_at ?? null
    };
    this.db.prepare(
      `INSERT INTO ${full.level} (id, title, content, importance, keywords, status, source_session, hit_count, created_at, updated_at, last_accessed_at
          ${full.level === "project" ? ", project, subcategory" : ""}
          ${full.level === "fact" || full.level === "lesson" || full.level === "rules" ? ", project" : ""}
          ${full.level === "lesson" ? ", corrected" : ""}
          ${full.level === "topic" ? ", goal, project" : ""}
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          ${full.level === "project" ? ", ?, ?" : ""}
          ${full.level === "fact" || full.level === "lesson" || full.level === "rules" ? ", ?" : ""}
          ${full.level === "lesson" ? ", ?" : ""}
          ${full.level === "topic" ? ", ?, ?" : ""}
        )`
    ).run(
      full.id,
      full.title,
      full.content,
      full.importance,
      JSON.stringify(full.keywords),
      full.status,
      full.source_session,
      full.hit_count,
      full.created_at,
      full.updated_at,
      full.last_accessed_at,
      ...full.level === "project" ? [full.project ?? "", full.subcategory] : [],
      ...full.level === "fact" || full.level === "lesson" || full.level === "rules" ? [full.project] : [],
      ...full.level === "lesson" ? [full.corrected] : [],
      ...full.level === "topic" ? [full.goal, full.project] : []
    );
    return full;
  }
  /** 跨表定位（UUID 全局唯一，扫描全部表）。id 支持 8 位前缀匹配
   *  （快照/检索结果给的是截断 id；前缀碰撞时取第一个）。 */
  findById(id) {
    const prefix = id.length < 36;
    for (const level of LEVELS) {
      const sql = prefix ? `SELECT * FROM ${level} WHERE id LIKE ?` : `SELECT * FROM ${level} WHERE id = ?`;
      const r = this.db.prepare(sql).get(prefix ? `${id}%` : id);
      if (r) return { row: this.fromRow(level, r), level };
    }
    return void 0;
  }
  update(level, id, patch) {
    const sets = [];
    const args = [];
    const push3 = (col, val) => {
      sets.push(`${col} = ?`);
      args.push(val);
    };
    if (patch.content !== void 0) push3("content", patch.content);
    if (patch.title !== void 0) push3("title", patch.title);
    if (patch.importance !== void 0) push3("importance", patch.importance);
    if (patch.keywords !== void 0) push3("keywords", JSON.stringify(patch.keywords));
    if (patch.status !== void 0) push3("status", patch.status);
    if (patch.corrected !== void 0 && level === "lesson") push3("corrected", patch.corrected);
    if (patch.project !== void 0 && (level === "project" || level === "fact" || level === "lesson" || level === "rules")) {
      push3("project", patch.project);
    }
    if (patch.subcategory !== void 0 && level === "project") push3("subcategory", patch.subcategory);
    if (patch.goal !== void 0 && level === "topic") push3("goal", patch.goal);
    if (patch.project !== void 0 && level === "topic") push3("project", patch.project);
    if (sets.length === 0) return false;
    push3("updated_at", Date.now());
    const where = id.length < 36 ? "id LIKE ?" : "id = ?";
    const res = this.db.prepare(`UPDATE ${level} SET ${sets.join(", ")} WHERE ${where}`).run(...args, id.length < 36 ? `${id}%` : id);
    return res.changes > 0;
  }
  list(level, opts = {}) {
    const where = [];
    const args = [];
    if (opts.status) {
      where.push("status = ?");
      args.push(opts.status);
    }
    if (opts.project !== void 0 && (level === "project" || level === "fact" || level === "lesson" || level === "rules")) {
      where.push("project = ?");
      args.push(opts.project);
    }
    const sql = `SELECT * FROM ${level}${where.length ? " WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC`;
    const rows = this.db.prepare(sql).all(...args);
    return rows.map((r) => this.fromRow(level, r));
  }
  /** 全部 active 条目（dream / 注入用），按 level 分组。 */
  allActive() {
    const out = {};
    for (const level of LEVELS) out[level] = this.list(level, { status: "active" });
    return out;
  }
  /** 可检索条目：active 全部；project.subcategory='todo' 的 stale 视为 done 参与检索。
   *  （用户拍板：todo 过时=finish 可检索，其他类别过时不检索。） */
  listSearchable(level) {
    const active = this.list(level, { status: "active" });
    if (level !== "project") return active;
    const todoDone = this.db.prepare(`SELECT * FROM project WHERE status = 'stale' AND subcategory = 'todo'`).all().map((r) => this.fromRow("project", r));
    return [...active, ...todoDone];
  }
  bumpHit(level, id) {
    this.db.prepare(`UPDATE ${level} SET hit_count = hit_count + 1, last_accessed_at = ? WHERE id = ?`).run(
      Date.now(),
      id
    );
  }
  count(level) {
    const row = this.db.prepare(`SELECT COUNT(*) AS n FROM ${level}`).get();
    return row.n;
  }
  /** 全部出现过（含已过时）的项目名：project/fact/lesson/topic/rules 五表的 project 列并集
   *  （多值逗号分隔展开；全局标记不是项目，projectList 已排除）。供记忆导引列出"用户的所有 project"。 */
  listProjectNames() {
    const names = /* @__PURE__ */ new Set();
    for (const level of ["project", "fact", "lesson", "topic", "rules"]) {
      const rows = this.db.prepare(`SELECT project FROM ${level} WHERE project IS NOT NULL AND project != ''`).all();
      for (const r of rows) for (const n of projectList(r.project)) names.add(n);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }
  logDream(summary, changes, note = "") {
    this.db.prepare("INSERT INTO dream_log (run_at, summary, changes, note) VALUES (?, ?, ?, ?)").run(Date.now(), summary, JSON.stringify(changes), note);
  }
  recentDream(hours) {
    const row = this.db.prepare("SELECT run_at FROM dream_log ORDER BY run_at DESC LIMIT 1").get();
    if (!row) return false;
    return Date.now() - row.run_at < hours * 36e5;
  }
  close() {
    try {
      this.db.close();
    } catch {
    }
  }
  /** 子 agent / dream 用的只读快照：把一组行转成纯数据（无 db 依赖）。 */
  snapshot(level, opts = {}) {
    return this.list(level, opts);
  }
  // ── windows 窗口表（dream 判定：跨重启持久化） ───────────────────────────
  touchWindow(sessionId, workspace, eventTime) {
    this.db.prepare(`INSERT INTO windows (session_id, workspace, last_event_time, last_dream_time) VALUES (?, ?, ?, NULL)
        ON CONFLICT(session_id) DO UPDATE SET workspace = excluded.workspace, last_event_time = MAX(last_event_time, excluded.last_event_time)`).run(sessionId, workspace, eventTime);
  }
  setWindowDream(sessionId, time) {
    this.db.prepare(`UPDATE windows SET last_dream_time = ? WHERE session_id = ?`).run(time, sessionId);
  }
  /** 原子抢占 dream 租约（跨进程/实例防重复 start）：返回 true 表示抢占成功（可 start）。
   *  条件：无租约（owner IS NULL）或租约已过期（progress_at 超 leaseMs）。owner 只用于抢占判断 + 诊断；
   *  推进/收尾按「sessionId + 租约未过期」判定，不校验 owner。 */
  claimDream(sessionId, owner, T2, leaseMs) {
    this.db.prepare(`INSERT OR IGNORE INTO windows (session_id, workspace, last_event_time, last_dream_time) VALUES (?, NULL, 0, NULL)`).run(sessionId);
    const now = Date.now();
    return this.db.prepare(
      `UPDATE windows SET dream_owner = ?, dream_started_at = ?, dream_progress_at = ?, dream_group_idx = 0, dream_T = ?
           WHERE session_id = ? AND (dream_owner IS NULL OR dream_progress_at IS NULL OR dream_progress_at <= ?)`
    ).run(owner, now, now, T2, sessionId, now - leaseMs).changes === 1;
  }
  /** dream 收尾：清租约 + 记 last_dream_time（dream 完成时刻）。 */
  finishDream(sessionId, time) {
    this.db.prepare(`UPDATE windows SET dream_owner = NULL, dream_started_at = NULL, dream_progress_at = NULL, dream_group_idx = NULL, dream_T = NULL, last_dream_time = ? WHERE session_id = ?`).run(time, sessionId);
  }
  /** dream 失败释放：只清租约，**不动 last_dream_time**——窗口保持「待整理」状态，
   *  下个检查周期 windowNeedsDream 仍成立即自动重试。
   *  与 finishDream 的语义区分：finish=完成/用户中止（封存，last_dream_time=收尾时刻）；
   *  release=执行失败（网络/服务瞬态故障，非用户意愿，2026-09-05 教训：把失败窗口
   *  按 aborted 封存会让一次断网整夜吞掉所有窗口的 dream 且永不重试）。 */
  releaseDream(sessionId) {
    this.db.prepare(`UPDATE windows SET dream_owner = NULL, dream_started_at = NULL, dream_progress_at = NULL, dream_group_idx = NULL, dream_T = NULL WHERE session_id = ?`).run(sessionId);
  }
  /** 是否有进行中/未收尾的 dream（租约存在，无论是否过期）。 */
  isDreamPending(sessionId) {
    const row = this.db.prepare(`SELECT dream_owner FROM windows WHERE session_id = ?`).get(sessionId);
    return row?.dream_owner != null;
  }
  /** 读窗口当前 dream 租约；无租约返回 null。 */
  getDreamLease(sessionId) {
    const row = this.db.prepare(`SELECT dream_owner, dream_started_at, dream_progress_at, dream_group_idx, dream_T FROM windows WHERE session_id = ?`).get(sessionId);
    if (!row || row.dream_owner == null) return null;
    return {
      owner: row.dream_owner,
      started_at: row.dream_started_at ?? 0,
      progress_at: row.dream_progress_at ?? 0,
      group_idx: row.dream_group_idx ?? 0,
      T: row.dream_T ?? 0
    };
  }
  /** CAS 推进租约：group_idx +1 并刷新心跳。多实例同收 turn-stopping 时只有一个成功。 */
  advanceDreamLease(sessionId, fromIdx, leaseMs) {
    const now = Date.now();
    return this.db.prepare(
      `UPDATE windows SET dream_group_idx = dream_group_idx + 1, dream_progress_at = ?
           WHERE session_id = ? AND dream_group_idx = ? AND dream_owner IS NOT NULL AND dream_progress_at > ?`
    ).run(now, sessionId, fromIdx, now - leaseMs).changes === 1;
  }
  /** 轮内租约心跳：只刷新 progress_at，不动 group_idx（推进仍归 advanceDreamLease 的 CAS）。
   *  安全性：只 touch 梦的活跃租约——finalize/release/abort 清租约后 changes=0，
   *  调用方据此自动停表，僵尸 dream 永远不会被心跳续命。 */
  touchDreamLease(sessionId) {
    return this.db.prepare(`UPDATE windows SET dream_progress_at = ? WHERE session_id = ? AND dream_owner IS NOT NULL`).run(Date.now(), sessionId).changes === 1;
  }
  // ── dream_skip 跳过表（v0.16.0：用户按会话跳过自动 dream；侧边栏菜单 toggle） ──
  /** 设置/清除某会话的跳过标记。skip=true 写入，false 删除。 */
  setDreamSkip(sessionId, skip) {
    if (skip) {
      this.db.prepare(`INSERT INTO dream_skip (session_id, created_at) VALUES (?, ?)
          ON CONFLICT(session_id) DO UPDATE SET created_at = excluded.created_at`).run(sessionId, Date.now());
    } else {
      this.db.prepare(`DELETE FROM dream_skip WHERE session_id = ?`).run(sessionId);
    }
  }
  /** 该会话是否被跳过自动 dream（只挡定时器自动触发；手动触发不受限）。 */
  isDreamSkipped(sessionId) {
    return this.db.prepare(`SELECT 1 FROM dream_skip WHERE session_id = ?`).get(sessionId) !== void 0;
  }
  /** 全部被跳过的会话 id（client 全量对账用）。 */
  listDreamSkips() {
    return this.db.prepare(`SELECT session_id FROM dream_skip`).all().map((r) => r.session_id);
  }
  // ── 全局检查门（dream 定时器防叠加） ─────────────────────────────────────
  // 根因：插件热重载/多实例并存时，dispose 未必清理旧 setInterval → 多个定时器
  // 叠加 → 检查频率远高于 checkMinutes，同一窗口被反复 start。检查动作本身
  // 必须幂等：DB 原子抢占"检查窗口"（minIntervalMs 内只有一个实例通过），
  // 与 startWindowDream 的 claimDream（start 幂等）+ recoverInterruptedDream
  // （中断自愈）组成三层防重复闭环。
  /** 原子抢占一次检查窗口：minIntervalMs 内只有一个调用方返回 true。 */
  claimCheckGate(minIntervalMs) {
    this.db.prepare(`INSERT OR IGNORE INTO dream_meta (key, value) VALUES ('last_check', 0)`).run();
    const now = Date.now();
    return this.db.prepare(`UPDATE dream_meta SET value = ? WHERE key = 'last_check' AND value <= ?`).run(now, now - minIntervalMs).changes === 1;
  }
  getWindow(sessionId) {
    return this.db.prepare(`SELECT * FROM windows WHERE session_id = ?`).get(sessionId);
  }
  listWindows() {
    return this.db.prepare(`SELECT * FROM windows ORDER BY last_event_time DESC`).all();
  }
  /** 本窗口建立的全部条目 id（dream 收尾：updated_at 批量写入用）。 */
  idsBySession(sessionId) {
    const out = [];
    for (const level of LEVELS) {
      const rows = this.db.prepare(`SELECT id FROM ${level} WHERE source_session = ?`).all(sessionId);
      for (const r of rows) out.push({ level, id: r.id });
    }
    return out;
  }
  /** 批量写记忆时间戳（dream 收尾：本窗口条目 updated_at = 窗口最后对话时间 T；
   *   MAX 防止覆盖 T 之后的 memory_update 刷新）。 */
  stampDream(sessionId, time) {
    let n = 0;
    for (const { level, id } of this.idsBySession(sessionId)) {
      n += this.db.prepare(`UPDATE ${level} SET updated_at = MAX(updated_at, ?) WHERE id = ?`).run(time, id).changes;
    }
    return n;
  }
  fromRow(level, r) {
    let keywords = [];
    try {
      keywords = JSON.parse(String(r.keywords ?? "[]"));
    } catch {
      keywords = [];
    }
    return {
      id: String(r.id),
      level,
      title: r.title == null ? null : String(r.title),
      content: String(r.content),
      importance: Number(r.importance ?? 1),
      keywords,
      status: String(r.status),
      corrected: Number(r.corrected ?? 0),
      project: r.project == null ? null : String(r.project),
      subcategory: r.subcategory == null ? null : String(r.subcategory),
      goal: r.goal == null ? null : String(r.goal),
      source_session: r.source_session == null ? null : String(r.source_session),
      hit_count: Number(r.hit_count ?? 0),
      created_at: Number(r.created_at),
      updated_at: Number(r.updated_at),
      last_accessed_at: r.last_accessed_at == null ? null : Number(r.last_accessed_at)
    };
  }
};
var dbCache = /* @__PURE__ */ new Map();
function getDb(workspace, dir = ".dsh-meow") {
  const key = `${workspace}\0${dir}`;
  let db = dbCache.get(key);
  if (!db) {
    db = new MemoryDb(memoryDbPath(workspace, dir));
    dbCache.set(key, db);
  }
  return db;
}
function closeAllDbs() {
  for (const db of dbCache.values()) db.close();
  dbCache.clear();
}
var dreamWorkspace = null;
function getDreamWorkspace() {
  return dreamWorkspace;
}

// src/delegate.ts
function parseModelSpec(spec) {
  const trimmed = spec?.trim();
  if (!trimmed) return void 0;
  const idx = trimmed.indexOf("/");
  if (idx > 0 && idx < trimmed.length - 1) {
    return { provider: trimmed.slice(0, idx), model: trimmed.slice(idx + 1) };
  }
  return { model: trimmed };
}
var REFLECT_DELEGATE_MARKER = "\u3010\u8BB0\u5FC6\u53CD\u601D\u6807\u8BB0\u3011";
var DREAM_DELEGATE_MARKER = "\u3010\u8BB0\u5FC6\u6574\u7406\u6807\u8BB0\u3011";
var REFLECT_DONE_DELEGATE_MARKER = "\u3010\u8BB0\u5FC6\u53CD\u601D\u5B8C\u6210\u6807\u8BB0\u3011";

// src/defaults.ts
var DEFAULT_RULES_REVIEW_DAYS = 2;
var CONFIG_DEFAULTS = {
  enabled: true,
  projectDir: ".dsh-meow",
  hitTopK: 2,
  titleMax: 40,
  reflect: true,
  reflectTurns: 7,
  autoMigrate: true,
  dream: {
    enabled: true,
    idleMinutes: 180,
    suppressWindows: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }],
    suppressLeadMinutes: 15,
    checkMinutes: 15,
    timeZone: "Asia/Shanghai",
    rulesReviewDays: DEFAULT_RULES_REVIEW_DAYS
  },
  delegate: { model: "" }
};
function factoryDefaultOf(spec) {
  const scope = spec.sub === void 0 ? CONFIG_DEFAULTS : CONFIG_DEFAULTS[spec.sub];
  if (scope === void 0 || scope === null || typeof scope !== "object") return void 0;
  return scope[spec.key];
}

// src/migrate-v0.ts
import { zstdCompressSync, zstdDecompressSync, constants } from "node:zlib";
import { readdirSync, readFileSync as readFileSync2, writeFileSync, existsSync as existsSync2, mkdirSync as mkdirSync2, copyFileSync, renameSync, statSync } from "node:fs";
import { join as join3, relative, dirname as dirname3 } from "node:path";
import { homedir as homedir2 } from "node:os";
var PLUGIN = "meow-memory";
var META_SECTION_NAME = "__meta__";
var PLUGIN_MARKER = `"plugin":"${PLUGIN}"`;
var MEMORY_KEY = '"memory":';
var SECTIONS_KEY = '"sections":[';
var STATE_FILE = "migrate-v0-state.json";
var ZSTD_MAGIC = 4247762216;
var CHECKSUM_OPTIONS = { params: { [constants.ZSTD_c_checksumFlag]: 1 } };
function statePath(projectDir) {
  return join3(homedir2(), projectDir || ".dsh-meow", STATE_FILE);
}
function readMigrateState(projectDir) {
  try {
    return JSON.parse(readFileSync2(statePath(projectDir), "utf8"));
  } catch {
    return {};
  }
}
function writeMigrateState(projectDir, state) {
  const p = statePath(projectDir);
  mkdirSync2(dirname3(p), { recursive: true });
  writeFileSync(p, JSON.stringify(state, null, 1), "utf8");
}
function scanFrames(buf) {
  const frames = [];
  let offset = 0;
  while (offset < buf.length) {
    const start = offset;
    if (buf.length - offset < 4) throw new Error("torn frame header");
    if (buf.readUInt32LE(offset) !== ZSTD_MAGIC) throw new Error(`invalid frame magic at byte ${offset}`);
    offset += 4;
    if (offset === buf.length) throw new Error("torn frame after magic");
    const descriptor = buf.readUInt8(offset);
    offset += 1;
    if ((descriptor & 24) !== 0) throw new Error("reserved frame-header bit");
    const contentSizeFlag = descriptor >>> 6;
    const singleSegment = (descriptor & 32) !== 0;
    const checksum = (descriptor & 4) !== 0;
    const dictionaryFlag = descriptor & 3;
    const dictionaryBytes = dictionaryFlag === 3 ? 4 : dictionaryFlag;
    const contentSizeBytes = contentSizeFlag === 0 ? singleSegment ? 1 : 0 : 1 << contentSizeFlag;
    const remainingHeaderBytes = (singleSegment ? 0 : 1) + dictionaryBytes + contentSizeBytes;
    if (buf.length - offset < remainingHeaderBytes) throw new Error("torn frame header fields");
    offset += remainingHeaderBytes;
    for (; ; ) {
      if (buf.length - offset < 3) throw new Error("torn block header");
      const blockHeader = buf.readUIntLE(offset, 3);
      offset += 3;
      const lastBlock = (blockHeader & 1) !== 0;
      const blockType = blockHeader >>> 1 & 3;
      const blockSize = blockHeader >>> 3;
      if (blockType === 3) throw new Error("reserved block type");
      const payloadBytes = blockType === 1 ? 1 : blockSize;
      if (buf.length - offset < payloadBytes) throw new Error("torn block payload");
      offset += payloadBytes;
      if (lastBlock) break;
    }
    if (checksum) {
      if (buf.length - offset < 4) throw new Error("torn checksum");
      offset += 4;
    }
    frames.push({ start, end: offset });
  }
  return frames;
}
function decompressAllFrames(buf) {
  const frames = scanFrames(buf);
  const parts = [];
  for (const f of frames) parts.push(zstdDecompressSync(buf.subarray(f.start, f.end)));
  return Buffer.concat(parts);
}
var compressFrame = (input) => zstdCompressSync(input, CHECKSUM_OPTIONS);
function collectPluginMemories(node, hits) {
  if (Array.isArray(node)) {
    for (const v of node) collectPluginMemories(v, hits);
    return;
  }
  if (node && typeof node === "object") {
    const o = node;
    if (o.kind === "plugin" && o.plugin === PLUGIN && Object.prototype.hasOwnProperty.call(o, "memory")) {
      hits.push({ form: o.form, memory: o.memory });
    }
    for (const k of Object.keys(o)) collectPluginMemories(o[k], hits);
  }
}
function balancedObjectAt(line, fromIdx) {
  const objStart = line.lastIndexOf("{", fromIdx);
  if (objStart < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = objStart; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") {
      depth--;
      if (depth === 0) return { objStart, objText: line.slice(objStart, i + 1) };
    }
  }
  return null;
}
function balancedValueEnd(text, valueStart) {
  let depth = 0, inStr = false, esc = false;
  for (let i = valueStart; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") {
      if (depth === 0) return i;
      depth--;
      if (depth === 0) return i + 1;
    } else if (ch === "," && depth === 0) return i;
  }
  return -1;
}
function locateNextMemory(out) {
  let searchFrom = 0;
  for (let guard = 0; guard < 50; guard++) {
    const pluginIdx = out.indexOf(PLUGIN_MARKER, searchFrom);
    if (pluginIdx < 0) return null;
    searchFrom = pluginIdx + 1;
    const obj = balancedObjectAt(out, pluginIdx);
    if (!obj) continue;
    let parsedObj;
    try {
      parsedObj = JSON.parse(obj.objText);
    } catch {
      continue;
    }
    if (!parsedObj || parsedObj.plugin !== PLUGIN || !Object.prototype.hasOwnProperty.call(parsedObj, "memory")) continue;
    const memKeyRel = obj.objText.indexOf(MEMORY_KEY);
    if (memKeyRel < 0) continue;
    const valStartRel = memKeyRel + MEMORY_KEY.length;
    const valEndRel = balancedValueEnd(obj.objText, valStartRel);
    if (valEndRel < 0) continue;
    const valueText = obj.objText.slice(valStartRel, valEndRel);
    const hasSections = Array.isArray(parsedObj.sections);
    let sectionsInsertAt = -1;
    let sectionsEmpty = false;
    if (hasSections) {
      const sKeyRel = obj.objText.indexOf(SECTIONS_KEY, valEndRel);
      if (sKeyRel < 0) return { memoryStart: -1, memoryEnd: -1, valueText: "", hasSections, sectionsInsertAt: -1, sectionsEmpty, refusal: "sections-array-but-no-key-after-memory" };
      sectionsInsertAt = obj.objStart + sKeyRel + SECTIONS_KEY.length;
      sectionsEmpty = out[sectionsInsertAt] === "]";
      if (sectionsInsertAt < obj.objStart + valEndRel) return { memoryStart: -1, memoryEnd: -1, valueText: "", hasSections, sectionsInsertAt: -1, sectionsEmpty, refusal: "sections-before-memory" };
    }
    return { memoryStart: obj.objStart + memKeyRel, memoryEnd: obj.objStart + valEndRel, valueText, hasSections, sectionsInsertAt, sectionsEmpty, form: parsedObj.form };
  }
  return null;
}
function removeMemberAt(line, memStart, memEnd) {
  if (line[memEnd] === ",") return line.slice(0, memStart) + line.slice(memEnd + 1);
  if (line[memStart - 1] === ",") return line.slice(0, memStart - 1) + line.slice(memEnd);
  return line.slice(0, memStart) + line.slice(memEnd);
}
function migrateLine(line) {
  if (!line.includes(PLUGIN_MARKER) || !line.includes(MEMORY_KEY)) return { line, changed: 0 };
  let parsed;
  try {
    parsed = JSON.parse(line);
  } catch {
    return { line, changed: 0, note: "unparsable-line" };
  }
  const pre = [];
  collectPluginMemories(parsed, pre);
  if (pre.length === 0) return { line, changed: 0 };
  const preCanons = new Set(pre.map((p) => JSON.stringify(p.memory)));
  let out = line;
  let changed = 0;
  for (let guard = 0; guard < 10; guard++) {
    const loc = locateNextMemory(out);
    if (!loc) break;
    if (loc.refusal) return { line, changed, note: "refused:" + loc.refusal };
    let memVal;
    try {
      memVal = JSON.parse(loc.valueText);
    } catch {
      return { line, changed, note: "memory-value-unparsable" };
    }
    if (!preCanons.has(JSON.stringify(memVal))) return { line, changed, note: "byte-structure-mismatch" };
    if (loc.hasSections) {
      if (loc.form !== "snapshot") return { line, changed, note: "sections-with-form-" + loc.form };
      const metaSection = `{"name":"${META_SECTION_NAME}","text":${JSON.stringify(loc.valueText)}}`;
      out = out.slice(0, loc.sectionsInsertAt) + metaSection + (loc.sectionsEmpty ? "" : ",") + out.slice(loc.sectionsInsertAt);
      out = removeMemberAt(out, loc.memoryStart, loc.memoryEnd);
    } else if (loc.form === "notice") {
      out = removeMemberAt(out, loc.memoryStart, loc.memoryEnd);
    } else {
      return { line, changed, note: "unsupported-form-" + loc.form };
    }
    changed++;
  }
  if (changed === 0) return { line, changed: 0, note: "located-but-not-migrated" };
  let reparsed;
  try {
    reparsed = JSON.parse(out);
  } catch {
    return { line, changed: 0, note: "post-parse-failed" };
  }
  const leftover = [];
  collectPluginMemories(reparsed, leftover);
  if (leftover.length > 0) return { line, changed: 0, note: "post-memory-remains" };
  return { line: out, changed };
}
function listSessionFiles(home) {
  const files = [];
  for (const rootName of ["sessions", "archived-sessions"]) {
    const root = join3(home, rootName);
    if (!existsSync2(root)) continue;
    for (const proj of readdirSync(root)) {
      const projDir = join3(root, proj);
      let st;
      try {
        st = statSync(projDir);
      } catch {
        continue;
      }
      if (!st.isDirectory()) continue;
      for (const sid of readdirSync(projDir)) {
        const f = join3(projDir, sid, "session.jsonl.zstd");
        if (existsSync2(f)) files.push(f);
      }
    }
  }
  return files;
}
function backupPathFor(home, file) {
  const rel = relative(home, file);
  if (rel.startsWith("..")) return file + ".pre-migrate.bak";
  return join3(home, "pre-migrate-backup", rel);
}
function processFile(home, file, log) {
  const rawBuf = readFileSync2(file);
  const raw = decompressAllFrames(rawBuf).toString("utf8");
  if (!raw.includes(PLUGIN_MARKER) || !raw.includes(MEMORY_KEY)) return { migrated: 0 };
  const lines = raw.split("\n");
  let changed = 0;
  const notes = [];
  const outLines = lines.map((l) => {
    if (!l.includes(PLUGIN_MARKER) || !l.includes(MEMORY_KEY)) return l;
    try {
      const r = migrateLine(l);
      if (r.note) notes.push(r.note);
      if (r.changed > 0) {
        changed += r.changed;
        return r.line;
      }
      return l;
    } catch (e) {
      notes.push("line-error: " + (e instanceof Error ? e.message : String(e)));
      return l;
    }
  });
  if (changed === 0) return { migrated: 0, note: notes.join(";") };
  const backup = backupPathFor(home, file);
  mkdirSync2(dirname3(backup), { recursive: true });
  if (!existsSync2(backup)) copyFileSync(file, backup);
  const headerLine = outLines[0] ?? "";
  const bodyText = outLines.length > 1 ? outLines.slice(1).join("\n") : "";
  const headerFrame = compressFrame(Buffer.from(headerLine + "\n", "utf8"));
  const frames = [headerFrame];
  if (bodyText.length > 0) frames.push(compressFrame(Buffer.from(bodyText, "utf8")));
  const outBuf = Buffer.concat(frames);
  const tmpOut = file + ".migrated.tmp.zst";
  writeFileSync(tmpOut, outBuf);
  renameSync(tmpOut, file);
  log(`migrated ${changed} line(s) in ${file}`);
  return { migrated: changed };
}
async function ensureV0SessionsMigrated(projectDir, log) {
  const state = readMigrateState(projectDir);
  if (state.migrated === true) return { ran: false, reason: "already-migrated" };
  const home = process.env.DSH_HOME || join3(homedir2(), ".dsh");
  if (!existsSync2(home)) {
    log("meow-memory migrate-v0: DSH_HOME not found, skip");
    return { ran: false, reason: "no-home" };
  }
  const report = { ran: true, scanned: 0, filesMigrated: 0, linesMigrated: 0, errors: [] };
  let files;
  try {
    files = listSessionFiles(home);
  } catch (e) {
    return { ran: false, reason: "list-failed: " + (e instanceof Error ? e.message : String(e)) };
  }
  report.scanned = files.length;
  for (const f of files) {
    try {
      const r = processFile(home, f, log);
      if (r.migrated > 0) {
        report.filesMigrated = (report.filesMigrated ?? 0) + 1;
        report.linesMigrated = (report.linesMigrated ?? 0) + r.migrated;
      }
    } catch (e) {
      report.errors.push({ file: f, error: e instanceof Error ? e.message : String(e) });
    }
  }
  if ((report.errors?.length ?? 0) === 0) {
    writeMigrateState(projectDir, {
      migrated: true,
      migratedAt: (/* @__PURE__ */ new Date()).toISOString(),
      files: report.filesMigrated,
      lines: report.linesMigrated
    });
  } else {
    log(`meow-memory migrate-v0: ${report.errors.length} file(s) failed; NOT setting migrated flag (will retry next boot)`);
  }
  log(`meow-memory migrate-v0: done. scanned=${report.scanned} filesMigrated=${report.filesMigrated} linesMigrated=${report.linesMigrated} errors=${report.errors.length}`);
  return report;
}

// src/dream.ts
import { appendFileSync } from "node:fs";
import { join as join5 } from "node:path";

// src/inject.ts
import { mkdirSync as mkdirSync3, readFileSync as readFileSync3, writeFileSync as writeFileSync2 } from "node:fs";
import { dirname as dirname4, join as join4 } from "node:path";

// src/bm25.ts
var CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u3005\u30fc]/u;
var WORD = /[\p{L}\p{N}]/u;
function classify(cp) {
  if (CJK.test(cp)) return "cjk";
  if (WORD.test(cp)) return "word";
  return "skip";
}
function tokenize(text) {
  const lang = getPromptLang().toLowerCase().split(/[-_]/)[0];
  const cps = Array.from(text.normalize("NFKC"));
  const out = [];
  let i = 0;
  while (i < cps.length) {
    const cls = classify(cps[i]);
    if (cls === "skip") {
      i++;
      continue;
    }
    let j = i + 1;
    while (j < cps.length && classify(cps[j]) === cls) j++;
    const run = cps.slice(i, j);
    if (cls === "cjk") {
      if (run.length >= 2) {
        for (let k = 0; k + 1 < run.length; k++) out.push(run[k] + run[k + 1]);
      }
    } else {
      out.push(run.join("").toLowerCase());
    }
    i = j;
  }
  return lang === "en" ? normalizeEn(out) : out;
}
var EN_STOPWORDS = /* @__PURE__ */ new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "cannot",
  "could",
  "d",
  "did",
  "do",
  "does",
  "doing",
  "don",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "itself",
  "just",
  "ll",
  "m",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "re",
  "s",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "t",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "ve",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves"
]);
function normalizeEn(tokens) {
  const out = [];
  for (const t of tokens) {
    if (EN_STOPWORDS.has(t)) continue;
    out.push(/^[a-z]+$/.test(t) ? stemEn(t) : t);
  }
  return out;
}
var PORTER_STEP2 = {
  ational: "ate",
  tional: "tion",
  enci: "ence",
  anci: "ance",
  izer: "ize",
  bli: "ble",
  alli: "al",
  entli: "ent",
  eli: "e",
  ousli: "ous",
  ization: "ize",
  ation: "ate",
  ator: "ate",
  alism: "al",
  iveness: "ive",
  fulness: "ful",
  ousness: "ous",
  aliti: "al",
  iviti: "ive",
  biliti: "ble",
  logi: "log"
};
var PORTER_STEP3 = {
  icate: "ic",
  ative: "",
  alize: "al",
  iciti: "ic",
  ical: "ic",
  ful: "",
  ness: ""
};
var CONS = "[^aeiou]";
var VOW = "[aeiouy]";
var CONS_SEQ = `${CONS}[^aeiouy]*`;
var VOW_SEQ = `${VOW}[aeiou]*`;
var MGR0 = new RegExp(`^(${CONS_SEQ})?${VOW_SEQ}${CONS_SEQ}`);
var MEQ1 = new RegExp(`^(${CONS_SEQ})?${VOW_SEQ}${CONS_SEQ}(${VOW_SEQ})?$`);
var MGR1 = new RegExp(`^(${CONS_SEQ})?${VOW_SEQ}${CONS_SEQ}${VOW_SEQ}${CONS_SEQ}`);
var HAS_VOWEL = new RegExp(`^(${CONS_SEQ})?${VOW}`);
function stemEn(word) {
  let w = word;
  if (w.length <= 2) return w;
  if (/(ss|i)es$/.test(w)) w = w.replace(/(ss|i)es$/, "$1");
  else if (/([^s])s$/.test(w)) w = w.replace(/([^s])s$/, "$1");
  if (/eed$/.test(w)) {
    const stem = w.slice(0, -3);
    if (MGR0.test(stem)) w = w.slice(0, -1);
  } else if (/(ed|ing)$/.test(w)) {
    const stem = w.replace(/(ed|ing)$/, "");
    if (HAS_VOWEL.test(stem)) {
      w = stem;
      if (/(at|bl|iz)$/.test(w)) w += "e";
      else if (/([^aeiouylsz])\1$/.test(w)) w = w.slice(0, -1);
      else if (new RegExp(`^${CONS_SEQ}${VOW}[^aeiouwxy]$`).test(w)) w += "e";
    }
  }
  if (/y$/.test(w)) {
    const stem = w.slice(0, -1);
    if (HAS_VOWEL.test(stem)) w = `${stem}i`;
  }
  for (const [suffix, repl] of Object.entries(PORTER_STEP2)) {
    if (w.endsWith(suffix)) {
      const stem = w.slice(0, -suffix.length);
      if (MGR0.test(stem)) w = stem + repl;
      break;
    }
  }
  for (const [suffix, repl] of Object.entries(PORTER_STEP3)) {
    if (w.endsWith(suffix)) {
      const stem = w.slice(0, -suffix.length);
      if (MGR0.test(stem)) w = stem + repl;
      break;
    }
  }
  const step4 = /(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  if (step4.test(w)) {
    const stem = w.replace(step4, "");
    if (MGR1.test(stem)) w = stem;
  } else if (/(s|t)(ion)$/.test(w)) {
    const stem = w.replace(/(s|t)(ion)$/, "$1");
    if (MGR1.test(stem)) w = stem;
  }
  if (/e$/.test(w)) {
    const stem = w.slice(0, -1);
    if (MGR1.test(stem) || MEQ1.test(stem) && !new RegExp(`^${CONS_SEQ}${VOW}[^aeiouwxy]$`).test(stem)) w = stem;
  }
  if (/ll$/.test(w) && MGR1.test(w)) w = w.slice(0, -1);
  return w;
}
function docText(d) {
  return [d.title ?? "", d.content, ...d.keywords].join(" ");
}
function recencyWeight(ageMs) {
  const days = ageMs / 864e5;
  if (days < 1) return 1;
  if (days < 2) return 0.9;
  if (days < 4) return 0.8;
  if (days < 7) return 0.65;
  if (days < 15) return 0.5;
  if (days < 30) return 0.35;
  if (days < 60) return 0.25;
  if (days < 180) return 0.15;
  return 0.08;
}
function search(query, docs, opts = {}) {
  const k = opts.k ?? 5;
  const now = opts.now === void 0 ? Date.now() : opts.now;
  const q = tokenize(query);
  if (q.length === 0 || docs.length === 0) return [];
  const n = docs.length;
  const docToks = docs.map((d) => tokenize(docText(d)));
  const avgdl = docToks.reduce((s, t) => s + t.length, 0) / n || 1;
  const df = /* @__PURE__ */ new Map();
  const tf = [];
  for (const toks of docToks) {
    const m = /* @__PURE__ */ new Map();
    const seen = /* @__PURE__ */ new Set();
    for (const t of toks) {
      m.set(t, (m.get(t) ?? 0) + 1);
      if (!seen.has(t)) {
        seen.add(t);
        df.set(t, (df.get(t) ?? 0) + 1);
      }
    }
    tf.push(m);
  }
  const k1 = 1.5;
  const b = 0.75;
  const raw = docs.map((_, di) => {
    let s = 0;
    const len = docToks[di].length;
    for (const term of q) {
      const f = tf[di].get(term);
      if (!f) continue;
      const idf = Math.log(1 + (n - (df.get(term) ?? 0) + 0.5) / ((df.get(term) ?? 0) + 0.5));
      s += idf * (f * (k1 + 1) / (f + k1 * (1 - b + b * len / avgdl)));
    }
    return s;
  });
  const maxRaw = Math.max(...raw);
  const hits = [];
  for (let di = 0; di < docs.length; di++) {
    if (raw[di] <= 0) continue;
    let w = 1;
    if (now !== null && docs[di].importance < 3 && !(raw[di] >= 0.85 * maxRaw)) {
      w = recencyWeight(now - docs[di].updated_at);
    }
    hits.push({
      id: docs[di].id,
      level: docs[di].level,
      title: docs[di].title,
      content: docs[di].content,
      importance: docs[di].importance,
      updated_at: docs[di].updated_at,
      score: raw[di] * w
    });
  }
  hits.sort((a, b2) => b2.score - a.score);
  return hits.slice(0, k);
}
function keywordHitScore(query, docs, opts = {}) {
  const k = opts.k ?? 2;
  const now = opts.now === void 0 ? Date.now() : opts.now;
  const q = tokenize(query);
  if (q.length === 0 || docs.length === 0) return [];
  const qTf = /* @__PURE__ */ new Map();
  for (const t of q) qTf.set(t, (qTf.get(t) ?? 0) + 1);
  const n = docs.length;
  const docToks = docs.map((d) => tokenize([d.content, d.title ?? ""].join(" ")));
  const df = /* @__PURE__ */ new Map();
  const tf = [];
  for (const toks of docToks) {
    const m = /* @__PURE__ */ new Map();
    const seen = /* @__PURE__ */ new Set();
    for (const t of toks) {
      m.set(t, (m.get(t) ?? 0) + 1);
      if (!seen.has(t)) {
        seen.add(t);
        df.set(t, (df.get(t) ?? 0) + 1);
      }
    }
    tf.push(m);
  }
  const idf = (t) => Math.log(1 + (n - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
  const raw = docs.map((_, di) => {
    let s = 0;
    for (const [t, f] of qTf) {
      if (tf[di].has(t)) s += idf(t) * f;
    }
    return s;
  });
  const maxRaw = Math.max(...raw);
  const out = [];
  for (let di = 0; di < docs.length; di++) {
    if (raw[di] <= 0) continue;
    const len = docToks[di].length;
    let overlap = 0;
    for (const t of qTf.keys()) if (tf[di].has(t)) overlap++;
    const coverage = len > 0 ? overlap / len : 0;
    let w = 1;
    if (now !== null && docs[di].importance < 3 && !(raw[di] >= 0.85 * maxRaw)) {
      w = recencyWeight(now - docs[di].updated_at);
    }
    const impW = 1 + (docs[di].importance - 1) * 0.25;
    const titleHit = tokenize(docs[di].title ?? "").some((t) => qTf.has(t));
    out.push({
      id: docs[di].id,
      level: docs[di].level,
      title: docs[di].title,
      content: docs[di].content,
      importance: docs[di].importance,
      updated_at: docs[di].updated_at,
      score: raw[di] * coverage * w * impW * (titleHit ? 1.2 : 1)
    });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, k);
}
function tfVector(toks) {
  const m = /* @__PURE__ */ new Map();
  for (const t of toks) m.set(t, (m.get(t) ?? 0) + 1);
  return m;
}
function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const v of a.values()) na += v * v;
  for (const v of b.values()) nb += v * v;
  if (na === 0 || nb === 0) return 0;
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  for (const [k, v] of small) {
    const w = big.get(k);
    if (w) dot += v * w;
  }
  return dot / Math.sqrt(na * nb);
}
function findSimilar(target, docs, k = 5) {
  const targetVec = tfVector(tokenize(target));
  if (targetVec.size === 0) return [];
  const scored = [];
  for (const d of docs) {
    const v = tfVector(tokenize(docText(d)));
    const s = cosine(targetVec, v);
    if (s <= 0) continue;
    scored.push({
      id: d.id,
      level: d.level,
      title: d.title,
      content: d.content,
      similarity: Math.round(s * 1e3) / 1e3
    });
  }
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, k);
}
var DRIFT_THRESHOLD = 0.3;
function topicDrift(turnText, topics) {
  if (topics.length === 0) return { topTopic: null, topScore: 0, suggestsNew: false, coldStart: true };
  const coldStart = topics.length < 3;
  const q = tfVector(tokenize(turnText));
  if (q.size === 0) return { topTopic: null, topScore: 0, suggestsNew: false, coldStart };
  let best = null;
  let bestScore = 0;
  for (const t of topics) {
    const v = tfVector(tokenize(docText(t)));
    const s = cosine(q, v);
    if (s > bestScore) {
      bestScore = s;
      best = t;
    }
  }
  return {
    topTopic: best,
    topScore: bestScore,
    suggestsNew: !coldStart && bestScore < DRIFT_THRESHOLD,
    coldStart
  };
}

// src/inject.ts
var DEFAULT_OPTS = { hitTopK: 2, titleMax: 40 };
function sessionsFile(workspace, sessionId, dir = ".dsh-meow") {
  return join4(workspace, dir, "sessions", `${sessionId}.json`);
}
var MAX_REINJECT_PROJECTS = 8;
var MAX_REINJECT_WRITTEN = 20;
function readSeenFile(workspace, sessionId, dir) {
  try {
    const text = readFileSync3(sessionsFile(workspace, sessionId, dir), "utf8");
    const parsed = JSON.parse(text);
    return {
      injected: Array.isArray(parsed.injected) ? parsed.injected.filter((x) => typeof x === "string") : [],
      searched: Array.isArray(parsed.searched) ? parsed.searched.filter((x) => typeof x === "string") : [],
      accessed: Array.isArray(parsed.accessed) ? parsed.accessed.filter((x) => typeof x === "string") : [],
      written: Array.isArray(parsed.written) ? parsed.written.filter((x) => typeof x === "string") : [],
      projectsQueried: Array.isArray(parsed.projectsQueried) ? parsed.projectsQueried.filter((x) => typeof x === "string") : [],
      reinjectPending: parsed.reinjectPending === true,
      currentProject: typeof parsed.currentProject === "string" && parsed.currentProject.length > 0 ? parsed.currentProject : null
    };
  } catch {
    return { injected: [], searched: [], accessed: [], written: [], projectsQueried: [], reinjectPending: false, currentProject: null };
  }
}
function writeSeenFile(workspace, sessionId, seen, dir) {
  const file = sessionsFile(workspace, sessionId, dir);
  mkdirSync3(dirname4(file), { recursive: true });
  writeFileSync2(file, JSON.stringify({
    injected: seen.injected,
    searched: seen.searched,
    accessed: seen.accessed,
    written: seen.written,
    projectsQueried: seen.projectsQueried,
    reinjectPending: seen.reinjectPending,
    currentProject: seen.currentProject
  }), "utf8");
}
function readInjected(workspace, sessionId, dir = ".dsh-meow") {
  return readSeenFile(workspace, sessionId, dir).injected;
}
function markInjected(workspace, sessionId, ids, dir = ".dsh-meow") {
  if (ids.length === 0) return;
  const seen = readSeenFile(workspace, sessionId, dir);
  const set3 = new Set(seen.injected);
  for (const id of ids) set3.add(id);
  seen.injected = [...set3];
  writeSeenFile(workspace, sessionId, seen, dir);
}
function readSeen(workspace, sessionId, dir = ".dsh-meow") {
  const s = readSeenFile(workspace, sessionId, dir);
  return /* @__PURE__ */ new Set([...s.injected, ...s.searched, ...s.accessed]);
}
function markSearched(workspace, sessionId, ids, dir = ".dsh-meow") {
  if (ids.length === 0) return;
  const seen = readSeenFile(workspace, sessionId, dir);
  const set3 = new Set(seen.searched);
  for (const id of ids) set3.add(id);
  seen.searched = [...set3];
  writeSeenFile(workspace, sessionId, seen, dir);
}
function markAccessed(workspace, sessionId, ids, dir = ".dsh-meow") {
  if (ids.length === 0) return;
  const seen = readSeenFile(workspace, sessionId, dir);
  const set3 = new Set(seen.accessed);
  for (const id of ids) set3.add(id);
  seen.accessed = [...set3];
  writeSeenFile(workspace, sessionId, seen, dir);
}
function markWritten(workspace, sessionId, ids, dir = ".dsh-meow") {
  if (ids.length === 0) return;
  const seen = readSeenFile(workspace, sessionId, dir);
  const ordered = seen.written.filter((id) => !ids.includes(id));
  ordered.push(...ids);
  seen.written = ordered.slice(-MAX_REINJECT_WRITTEN);
  writeSeenFile(workspace, sessionId, seen, dir);
}
function readWritten(workspace, sessionId, dir = ".dsh-meow") {
  return readSeenFile(workspace, sessionId, dir).written;
}
function markProjectQueried(workspace, sessionId, project, dir = ".dsh-meow") {
  const names = project.split(",").map((p) => p.trim()).filter((p) => p.length > 0 && !isGlobalProject(p));
  if (names.length === 0) return;
  const seen = readSeenFile(workspace, sessionId, dir);
  const ordered = seen.projectsQueried.filter((p) => !names.includes(p));
  ordered.push(...names);
  seen.projectsQueried = ordered.slice(-MAX_REINJECT_PROJECTS);
  writeSeenFile(workspace, sessionId, seen, dir);
}
function readProjectQueried(workspace, sessionId, dir = ".dsh-meow") {
  return readSeenFile(workspace, sessionId, dir).projectsQueried;
}
function markReinjectPending(workspace, sessionId, dir = ".dsh-meow") {
  const seen = readSeenFile(workspace, sessionId, dir);
  if (seen.reinjectPending) return;
  seen.reinjectPending = true;
  writeSeenFile(workspace, sessionId, seen, dir);
}
function clearReinjectPending(workspace, sessionId, dir = ".dsh-meow") {
  const seen = readSeenFile(workspace, sessionId, dir);
  if (!seen.reinjectPending) return;
  seen.reinjectPending = false;
  writeSeenFile(workspace, sessionId, seen, dir);
}
function isReinjectPending(workspace, sessionId, dir = ".dsh-meow") {
  return readSeenFile(workspace, sessionId, dir).reinjectPending;
}
function releaseSeen(workspace, sessionId, dir = ".dsh-meow") {
  const seen = readSeenFile(workspace, sessionId, dir);
  seen.injected = [];
  seen.searched = [];
  writeSeenFile(workspace, sessionId, seen, dir);
}
function getCurrentProject(workspace, sessionId, dir = ".dsh-meow") {
  return readSeenFile(workspace, sessionId, dir).currentProject;
}
function setCurrentProject(workspace, sessionId, project, dir = ".dsh-meow") {
  const seen = readSeenFile(workspace, sessionId, dir);
  seen.currentProject = project;
  writeSeenFile(workspace, sessionId, seen, dir);
}
function toDocs(rows) {
  return rows.map((r) => ({
    id: r.id,
    level: r.level,
    title: r.title,
    content: r.content,
    keywords: r.keywords,
    importance: r.importance,
    created_at: r.created_at,
    updated_at: r.updated_at
  }));
}
function buildInjectionBody(db, o) {
  const lbl3 = (key, params) => fillTemplate(keyedValue("labels", key), params);
  const soul = db.list("soul", { status: "active" });
  const user = db.list("user", { status: "active" });
  const lines = [lbl3("inject.title"), ""];
  const injected = [];
  const pushEntries = (label, rows) => {
    if (rows.length === 0) return;
    lines.push(lbl3("inject.sectionFormat", { label }));
    for (const r of rows) {
      lines.push(`- ${r.content}`);
      injected.push(r.id);
    }
    lines.push("");
  };
  pushEntries(lbl3("inject.aboutYou"), soul);
  pushEntries(lbl3("inject.aboutUser"), user);
  const globalRules = db.list("rules", { status: "active" }).filter((r) => isGlobalScope(r.project) && r.importance >= 2);
  pushEntries(lbl3("inject.rules"), globalRules);
  const projectNames = db.listProjectNames();
  if (projectNames.length > 0) {
    const max = o.titleMax;
    const shown = projectNames.map((n) => n.length > max ? n.slice(0, max) + "\u2026" : n);
    lines.push(lbl3("inject.sectionFormat", { label: lbl3("inject.guide") }));
    lines.push(lbl3("inject.guideSearchLine"));
    lines.push(lbl3("inject.guideProjectLine"));
    lines.push(lbl3("inject.guideProjects", { list: shown.join(" / ") }));
    lines.push("");
  }
  if (lines.length <= 2) return null;
  return { body: lines.join("\n").trimEnd(), injectedIds: injected };
}
function buildInjection(db, workspace, sessionId, _firstUserText = "", opts = {}, dir = ".dsh-meow") {
  const o = { ...DEFAULT_OPTS, ...opts };
  const built = buildInjectionBody(db, o);
  if (built === null) return null;
  const text = built.body;
  if (built.injectedIds.length > 0) markInjected(workspace, sessionId, built.injectedIds, dir);
  return { text, injectedIds: built.injectedIds };
}
var lbl2 = (key, params) => fillTemplate(keyedValue("labels", key), params);
var sectionTitle = (sub) => lbl2(`project.section.${sub}`);
function sortByUpdatedAt(list) {
  return [...list].sort((a, b) => (a.updated_at ?? 0) - (b.updated_at ?? 0) || a.created_at - b.created_at);
}
function fmtProjectRow(r) {
  const abs = new Date(r.updated_at).toISOString().slice(0, 16).replace("T", " ");
  return `[${projectLabel(r.project)} : ${r.level}] [${r.id}] ${abs} [${relativeTime(r.updated_at)}]
${r.content}`;
}
function buildProjectSection(db, workspace, project, dir) {
  const rows = db.list("project", { project }).filter((r) => r.project === project);
  const ids = [];
  const render = (list) => {
    for (const r of list) ids.push(r.id);
    return list.map(fmtProjectRow).join("\n");
  };
  const active = rows.filter((r) => r.status === "active");
  const done = sortByUpdatedAt(
    rows.filter((r) => r.subcategory === "todo" && r.status === "stale" && r.updated_at !== null).sort((a, b) => (b.updated_at ?? 0) - (a.updated_at ?? 0)).slice(0, 5)
  );
  const bySub = /* @__PURE__ */ new Map();
  for (const r of active) {
    const sub = r.subcategory ?? "overview";
    const list = bySub.get(sub) ?? [];
    list.push(r);
    bySub.set(sub, list);
  }
  const sections = [];
  const projectRules = sortByUpdatedAt(
    db.list("rules", { project }).filter((r) => r.project === project && r.status === "active")
  );
  if (projectRules.length > 0) {
    sections.push(`${lbl2("inject.rules")}
${render(projectRules)}`);
  }
  for (const sub of PROJECT_SUBCATEGORIES) {
    if (sub === "todo") {
      const todos = sortByUpdatedAt(bySub.get("todo") ?? []);
      if (todos.length === 0 && done.length === 0) continue;
      const lines = [sectionTitle("todo")];
      if (done.length > 0) {
        lines.push(lbl2("project.todoDone"));
        for (const r of done) {
          ids.push(r.id);
          lines.push(fmtProjectRow(r));
        }
      }
      if (todos.length > 0) {
        lines.push(lbl2("project.todoOpen"));
        for (const r of todos) {
          ids.push(r.id);
          lines.push(fmtProjectRow(r));
        }
      }
      sections.push(lines.join("\n"));
    } else {
      const list = sortByUpdatedAt(bySub.get(sub) ?? []);
      if (list.length === 0) continue;
      sections.push(`${sectionTitle(sub)}
${render(list)}`);
    }
  }
  if (sections.length === 0) return null;
  const dbPath = memoryDbPath(workspace, dir);
  const text = [
    lbl2("project.header", { name: project }),
    "",
    sections.join("\n\n"),
    "",
    "\u2014\u2014",
    "\u8BF4\u660E\uFF1A\u6B64\u5904\u53EA\u63D0\u4F9B active \u7684\u8BB0\u5FC6\u3002",
    `\u5982\u679C\u4F60\u60F3\u770B\u975E active \u6761\u76EE\uFF08archived=\u5220\u9664 / stale=\u5B8C\u7ED3\uFF09\uFF0C\u6216\u67D0\u6761\u8BB0\u5FC6\u7684\u5177\u4F53\u65F6\u95F4\u6233\uFF08\u8BB0\u5FC6\u65F6\u95F4\u6233=\u8BE5\u7A97\u53E3 dream \u5C01\u5B58\u65F6\u523B\uFF09\u3001\u8BB0\u5FC6\u6765\u6E90\uFF08source_session\uFF09\u3001\u91CD\u8981\u6027\u3001\u5173\u952E\u8BCD\u7B49\u5143\u6570\u636E\uFF0C\u53EF\u4EE5\u76F4\u63A5\u53BB\u641C\u8BB0\u5FC6\u5E93 SQLite\uFF1A${dbPath}`,
    "\uFF08\u5E93\u5185\u7ED3\u6784\uFF1A\u4E03\u5C42\u8868 soul/user/project/fact/lesson/topic/rules\uFF0C\u5B57\u6BB5\u542B id/title/content/importance/keywords/status/corrected/project/subcategory/goal/source_session/created_at/updated_at\uFF08\u8BB0\u5FC6\u65F6\u95F4\u6233=\u6700\u540E\u66F4\u65B0\u65F6\u95F4\uFF09/last_accessed_at\uFF1B\u53E6\u6709 dream_log \u6574\u7406\u7559\u75D5\u8868\u3001windows \u7A97\u53E3\u65F6\u95F4\u8868\uFF1B\u4E5F\u53EF\u6309 id \u7528 memory_read \u770B\u5355\u6761\u5B8C\u6574\u5143\u6570\u636E\uFF09",
    `\u5982\u679C\u4F60\u60F3\u4E86\u89E3\u672A\u88AB\u8BB0\u5F55\u7684\u66F4\u591A\u7EC6\u8282\uFF0C\u53EF\u4EE5\u76F4\u63A5\u53BB\u641C\u4F1A\u8BDD\u5386\u53F2\u76EE\u5F55\uFF08dsh \u7684 session \u65E5\u5FD7\uFF0C\u4F4D\u7F6E\u7531 DSH_HOME \u51B3\u5B9A\uFF0C\u9ED8\u8BA4 ~/.dsh/sessions\uFF0C\u55B5\u7248\u4E3A dsh-home/sessions\uFF09\uFF0C\u6309\u4F1A\u8BDD id \u67E5\u539F\u59CB\u8BB0\u5F55\u3002`
  ].join("\n");
  return { text, ids };
}
function buildProjectSectionText(db, workspace, project, dir = ".dsh-meow") {
  return buildProjectSection(db, workspace, project, dir)?.text ?? null;
}
function buildWrittenSection(db, workspace, sessionId, dir, exclude) {
  const ordered = [...readWritten(workspace, sessionId, dir)];
  for (const { id } of db.idsBySession(sessionId)) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  const rows = [];
  for (const id of ordered) {
    if (exclude.has(id)) continue;
    const found = db.findById(id);
    if (!found || found.row.status !== "active") continue;
    rows.push(found.row);
  }
  const kept = rows.slice(-MAX_REINJECT_WRITTEN);
  if (kept.length === 0) return null;
  return {
    text: [
      lbl2("inject.sectionFormat", { label: lbl2("inject.writtenSection") }),
      lbl2("inject.writtenIntro"),
      ...kept.map(fmtProjectRow)
    ].join("\n"),
    ids: kept.map((r) => r.id)
  };
}
function buildReinjection(db, workspace, sessionId, projects, opts = {}, dir = ".dsh-meow") {
  const o = { ...DEFAULT_OPTS, ...opts };
  const snapshot = buildInjectionBody(db, o);
  const projectTexts = [];
  const projectIds = /* @__PURE__ */ new Set();
  for (const project of projects) {
    const built = buildProjectSection(db, workspace, project, dir);
    if (built !== null) {
      projectTexts.push(built.text);
      for (const id of built.ids) projectIds.add(id);
    }
  }
  const written = buildWrittenSection(db, workspace, sessionId, dir, /* @__PURE__ */ new Set([...snapshot?.injectedIds ?? [], ...projectIds]));
  if (snapshot === null && projectTexts.length === 0 && written === null) return null;
  const lines = [];
  if (snapshot !== null) {
    lines.push(snapshot.body);
    lines.push("");
  }
  if (projectTexts.length > 0 || written !== null) {
    lines.push(lbl2("inject.sectionFormat", { label: lbl2("inject.reinjectSection") }));
    lines.push(lbl2("inject.reinjectIntro"));
    lines.push("");
    if (projectTexts.length > 0) {
      lines.push(projectTexts.join("\n\n"));
      lines.push("");
    }
  }
  if (written !== null) {
    lines.push(written.text);
    lines.push("");
  }
  const text = lines.join("\n").trimEnd();
  const replayedIds = [...snapshot?.injectedIds ?? [], ...written?.ids ?? []];
  if (replayedIds.length > 0) markInjected(workspace, sessionId, replayedIds, dir);
  return { text, injectedIds: replayedIds };
}
function hitQuery(db, workspace, sessionId, userText, o, dir) {
  const currentProject = readSeenFile(workspace, sessionId, dir).currentProject;
  const hitRows = [
    ...db.list("fact", { status: "active" }),
    ...db.list("lesson", { status: "active" }),
    ...db.list("rules", { status: "active" }),
    ...db.list("topic", { status: "active" })
  ].filter(
    (r) => (isGlobalScope(r.project) || currentProject !== null && projectCovers(r.project, currentProject)) && r.source_session !== sessionId
    // 本 session 建立的记忆在上下文里，不命中
  );
  if (hitRows.length === 0) return [];
  const query = userText.slice(0, 500);
  const docs = toDocs(hitRows).map((d) => ({
    ...d,
    // 匹配面 = 条目关键词（LLM 提取或自动 bigram；无关键词的旧条目回退内容前 100 字）。
    content: d.keywords.length > 0 ? d.keywords.join(" ") : d.content.slice(0, 100)
  }));
  const hits = keywordHitScore(query, docs, { k: o.hitTopK });
  const byId = new Map(hitRows.map((r) => [r.id, r]));
  return hits.filter((h) => !readInjected(workspace, sessionId, dir).includes(h.id)).map((h) => {
    const row = byId.get(h.id);
    return { id: h.id, level: h.level, content: row?.content ?? h.content, project: row?.project ?? null, updated_at: row?.updated_at ?? null };
  });
}
function buildHitInjection(db, workspace, sessionId, userText, opts = {}, dir = ".dsh-meow") {
  const o = { ...DEFAULT_OPTS, ...opts };
  const fresh = hitQuery(db, workspace, sessionId, userText, o, dir);
  if (fresh.length === 0) return null;
  const lines = [keyedValue("labels", "inject.hitHeader")];
  for (const h of fresh) {
    const proj = projectLabel(h.project);
    const time = h.updated_at ? ` ${new Date(h.updated_at).toISOString().slice(0, 16).replace("T", " ")} [${relativeTime(h.updated_at)}]` : "";
    lines.push(`[${proj} : ${h.level}] [${h.id}]${time}`);
    lines.push(h.content);
    lines.push("");
  }
  const text = lines.join("\n").trimEnd();
  const ids = fresh.map((h) => h.id);
  markInjected(workspace, sessionId, ids, dir);
  return { text, injectedIds: ids };
}

// src/tools.ts
var T = (key) => keyedValue("tools", key);
var L = (key, params) => fillTemplate(keyedValue("labels", key), params);
function describeArg(value) {
  if (typeof value === "string") return `string("${value.slice(0, 40)}")`;
  if (Array.isArray(value)) return `array(${value.length})`;
  if (value === null) return "null";
  return typeof value;
}
function normalizeKeywords(raw) {
  const out = [];
  const push3 = (v) => {
    const t = v.trim();
    if (t.length > 0) out.push(t);
  };
  const walk = (v) => {
    if (Array.isArray(v)) {
      for (const item of v) walk(item);
      return;
    }
    if (typeof v !== "string") return;
    const text = v.trim();
    if (text.length === 0) return;
    if (text.startsWith("[")) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          walk(parsed);
          return;
        }
      } catch {
      }
      walk(text.replace(/^\[+|\]+$/g, ""));
      return;
    }
    if (/[,，、;；\n]/.test(text)) {
      for (const part of text.split(/[,，、;；\n]+/)) push3(part);
      return;
    }
    push3(text);
  };
  walk(raw);
  return out;
}
function coerceNumber(raw) {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : void 0;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t.length === 0) return void 0;
    const n = Number(t);
    return Number.isFinite(n) ? n : void 0;
  }
  return void 0;
}
function coerceBoolean(raw) {
  if (raw === true) return true;
  if (typeof raw === "number") return raw === 1;
  if (typeof raw === "string") return ["true", "1", "yes", "y"].includes(raw.trim().toLowerCase());
  return false;
}
function filterSearchable(rows, opts) {
  return rows.filter((r) => {
    if (opts.project && opts.project.length > 0 && !opts.project.some((p) => projectCovers(r.project, p))) return false;
    const statuses = opts.status?.filter((s) => s !== "all") ?? [];
    if (statuses.length > 0 && !statuses.includes(r.status)) return false;
    if (opts.days && Date.now() - r.created_at > opts.days * 864e5) return false;
    return true;
  });
}
function workspaceOf(exec) {
  const cwd = exec.agent?.session?.header?.cwd;
  if (typeof cwd === "string" && cwd.length > 0) return cwd;
  return getDreamWorkspace() ?? void 0;
}
function sessionIdOf(exec) {
  const header = exec.agent?.session?.header ?? {};
  const id = typeof header.id === "string" && header.id.length > 0 ? header.id : null;
  if (header.origin === "subagent" && header.parentSession !== void 0) {
    const p = header.parentSession;
    if (typeof p === "string" && p.length > 0) return p;
    if (p !== null && typeof p === "object" && typeof p.id === "string") {
      return p.id;
    }
  }
  return id;
}
function similarity(a, b) {
  const sa = new Set(tokenize(a));
  const sb = new Set(tokenize(b));
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  return inter / (sa.size + sb.size - inter);
}
var DEDUP_THRESHOLD = 0.8;
function rememberTool(dir) {
  return {
    name: "memory_remember",
    description: T("memory_remember.description"),
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["content", "project", "keywords", "importance"],
      properties: {
        content: { type: "string", description: T("memory_remember.param.content") },
        level: {
          type: "string",
          enum: [...LEVELS],
          default: "fact",
          description: T("memory_remember.param.level")
        },
        project: { type: "string", description: T("memory_remember.param.project") },
        subcategory: { type: "string", enum: [...PROJECT_SUBCATEGORIES], description: T("memory_remember.param.subcategory") },
        goal: { type: "string", description: T("memory_remember.param.goal") },
        importance: { type: "integer", default: 1, description: T("memory_remember.param.importance") },
        corrected: { type: "boolean", default: false, description: T("memory_remember.param.corrected") },
        keywords: { type: "array", items: { type: "string" }, description: T("memory_remember.param.keywords") }
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["ok"],
        properties: {
          ok: { type: "boolean" },
          id: { type: "string" },
          level: { type: "string" },
          merged: { type: "boolean" },
          keywords: { type: "array", items: { type: "string" }, description: T("memory_remember.out.keywords") },
          project: { type: "string", description: T("memory_remember.out.project") }
        }
      },
      render: (_args, value) => {
        const v = value;
        const kw = Array.isArray(v.keywords) && v.keywords.length > 0 ? `\u5173\u952E\u8BCD\uFF1A${v.keywords.join(" / ")}\u3002` : "";
        const proj = typeof v.project === "string" ? `\u9879\u76EE\uFF1A${v.project}\u3002` : "";
        const head = v.merged ? "\u2705 \u5DF2\u5408\u5E76\u5230\u5DF2\u6709\u6761\u76EE" : "\u2705 \u8BB0\u5FC6\u5DF2\u5199\u5165";
        return [{
          type: "text",
          text: `${head}\uFF08${String(v.level ?? "fact")}${typeof v.id === "string" ? `\uFF0Cid=${v.id.slice(0, 8)}` : ""}\uFF09\u3002${proj}${kw}\u65E0\u9700\u91CD\u590D\u8C03\u7528\u672C\u5DE5\u5177\u3002`
        }];
      }
    },
    async execute(args, exec) {
      const parsed = args;
      const content = typeof parsed.content === "string" ? parsed.content.trim() : "";
      if (content.length === 0) throw new Error(L("remember.error.content"));
      const project = typeof parsed.project === "string" && parsed.project.trim() ? parsed.project.trim() : null;
      if (project === null) throw new Error(L("remember.error.project", { global: globalProjectMarker() }));
      const keywords = normalizeKeywords(parsed.keywords);
      if (keywords.length === 0) {
        const missing = parsed.keywords === void 0 || parsed.keywords === null || typeof parsed.keywords === "string" && parsed.keywords.trim() === "" || Array.isArray(parsed.keywords) && parsed.keywords.length === 0;
        throw new Error(missing ? L("remember.error.keywords") : L("remember.error.keywordsEmpty", { received: describeArg(parsed.keywords) }));
      }
      const importanceRaw = coerceNumber(parsed.importance);
      if (importanceRaw === void 0) throw new Error(L("remember.error.importance"));
      const level = typeof parsed.level === "string" && LEVELS.includes(parsed.level) ? parsed.level : "fact";
      const importance = Math.round(importanceRaw);
      const subcategory = level === "project" && typeof parsed.subcategory === "string" && PROJECT_SUBCATEGORIES.includes(parsed.subcategory) ? parsed.subcategory : null;
      const goal = typeof parsed.goal === "string" && parsed.goal.trim() ? parsed.goal.trim() : null;
      const corrected = coerceBoolean(parsed.corrected) ? 1 : 0;
      const workspace = workspaceOf(exec);
      if (!workspace) throw new Error("memory_remember: \u65E0\u6CD5\u786E\u5B9A\u5DE5\u4F5C\u533A\uFF08\u4F1A\u8BDD\u65E0 cwd\uFF09");
      const db = getDb(workspace, dir);
      const source_session = sessionIdOf(exec);
      if (project && !isGlobalProject(project) && !project.includes(",")) setCurrentProject(workspace, source_session ?? "unknown", project, dir);
      const existing = db.list(level);
      let merged;
      for (const r of existing) {
        if (similarity(r.content, content) >= DEDUP_THRESHOLD) {
          merged = r;
          break;
        }
      }
      if (merged) {
        const patch = {
          content,
          importance: Math.max(merged.importance, importance)
        };
        if (project && (level === "project" || level === "fact" || level === "lesson" || level === "topic" || level === "rules")) patch.project = project;
        if (subcategory && level === "project") patch.subcategory = subcategory;
        if (goal && level === "topic") patch.goal = goal;
        if (level === "lesson" && corrected) patch.corrected = 1;
        patch.keywords = keywords;
        db.update(level, merged.id, patch);
        markWritten(workspace, source_session ?? "unknown", [merged.id], dir);
        const after = db.findById(merged.id)?.row;
        return {
          ok: true,
          id: merged.id,
          level,
          merged: true,
          keywords: after?.keywords ?? merged.keywords,
          ...after?.project ? { project: after.project } : {}
        };
      }
      const row = db.insert({
        level,
        content,
        project,
        subcategory,
        goal,
        importance,
        corrected,
        keywords,
        source_session
      });
      markWritten(workspace, source_session ?? "unknown", [row.id], dir);
      return {
        ok: true,
        id: row.id,
        level,
        merged: false,
        keywords: row.keywords,
        ...row.project ? { project: row.project } : {}
      };
    },
    presentCall(args) {
      const parsed = args;
      const preview = typeof parsed.content === "string" ? parsed.content.slice(0, 40) : "";
      return { card: "generic", title: `memory_remember: ${preview}`, kind: "write" };
    }
  };
}
function searchTool(dir) {
  return {
    name: "memory_search",
    description: T("memory_search.description"),
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["query"],
      properties: {
        query: { type: "string", description: T("memory_search.param.query") },
        level: { type: "string", description: T("memory_search.param.level") },
        project: { type: "string", description: T("memory_search.param.project") },
        status: { type: "string", description: T("memory_search.param.status") },
        days: { type: "integer", minimum: 1, maximum: 3650, description: T("memory_search.param.days") },
        k: { type: "integer", minimum: 1, maximum: 50, default: 10, description: T("memory_search.param.k") },
        content_max: { type: "integer", minimum: 0, maximum: 5e3, default: 300, description: T("memory_search.param.content_max") }
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["note", "hits"],
        properties: {
          note: { type: "string", description: T("memory_search.out.note") },
          hits: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "level"],
              properties: {
                id: { type: "string", description: T("memory_search.out.hits.id") },
                level: { type: "string" },
                title: { type: "string" },
                content: { type: "string" },
                keywords: { type: "array", items: { type: "string" }, description: T("memory_search.out.hits.keywords") },
                project: { type: "string", description: T("memory_search.out.hits.project") },
                score: { type: "number" },
                updated_at: { type: "number", description: T("memory_search.out.hits.updated_at") }
              }
            }
          }
        }
      },
      render: (_args, value) => {
        const v = value;
        const lines = [String(v.note ?? "")];
        for (const h of v.hits ?? []) {
          const kw = (Array.isArray(h.keywords) ? h.keywords : []).filter((x) => typeof x === "string" && x.length > 0);
          const about = kw.length > 0 ? kw.join(", ") : `${String(h.content ?? "").slice(0, 40)}\u2026`;
          const proj = `${projectLabel(h.project)} : ${String(h.level ?? "")}`;
          const rel = relativeTime(h.updated_at ?? null);
          lines.push(`[${proj}] [${String(h.id ?? "")}] [${rel}] \u5173\u4E8E\uFF1A${about}`);
        }
        return lines.map((t) => ({ type: "text", text: t }));
      }
    },
    async execute(args, exec) {
      const parsed = args;
      const query = typeof parsed.query === "string" ? parsed.query.trim() : "";
      if (!query) throw new Error('memory_search: query \u5FC5\u586B\u4E14\u4E0D\u80FD\u4E3A\u7A7A\uFF08\u4F8B\uFF1A{"query": "\u5173\u952E\u8BCD"}\uFF09\uFF1B\u6D4F\u89C8\u9879\u76EE\u5168\u8C8C\u8BF7\u7528 memory_project');
      const workspace = workspaceOf(exec);
      if (!workspace) throw new Error("memory_search: \u65E0\u6CD5\u786E\u5B9A\u5DE5\u4F5C\u533A\uFF08\u4F1A\u8BDD\u65E0 cwd\uFF09");
      const db = getDb(workspace, dir);
      const sessionId = sessionIdOf(exec);
      const seen = readSeen(workspace, sessionId ?? "unknown", dir);
      const projectList3 = typeof parsed.project === "string" && parsed.project.trim() ? parsed.project.split(",").map((s) => s.trim()).filter((s) => s.length > 0) : [];
      const project = projectList3.length > 0 ? projectList3 : null;
      if (projectList3.length === 1 && !isGlobalProject(projectList3[0])) setCurrentProject(workspace, sessionId ?? "unknown", projectList3[0], dir);
      const statusList = typeof parsed.status === "string" && parsed.status.trim() ? parsed.status.split(",").map((s) => s.trim()).filter((s) => s.length > 0) : [];
      const status = statusList.length > 0 ? statusList : null;
      const daysRaw = coerceNumber(parsed.days);
      const days = daysRaw !== void 0 && daysRaw > 0 ? daysRaw : null;
      const kRaw = coerceNumber(parsed.k);
      const k = kRaw !== void 0 ? Math.max(1, Math.min(50, Math.round(kRaw))) : 10;
      const cmRaw = coerceNumber(parsed.content_max);
      const contentMax = cmRaw !== void 0 ? Math.max(0, Math.min(5e3, Math.round(cmRaw))) : 300;
      const levels = typeof parsed.level === "string" && parsed.level.trim() ? parsed.level.split(",").map((s) => s.trim()).filter((s) => LEVELS.includes(s)) : ["fact", "lesson", "topic", "rules"];
      const rows = levels.flatMap((lv) => {
        if (statusList.length === 1 && statusList[0] !== "active" && statusList[0] !== "all") return db.list(lv, { status: statusList[0] });
        if (statusList.length > 1) return db.list(lv);
        return db.listSearchable(lv);
      });
      const filtered = filterSearchable(rows, { project, status, days });
      const byId = new Map(filtered.map((r) => [r.id, r]));
      const docs = filtered.map((r) => ({
        id: r.id,
        level: r.level,
        title: r.title,
        content: r.content,
        keywords: r.keywords,
        importance: r.importance,
        created_at: r.created_at,
        updated_at: r.updated_at
      }));
      const ranked = search(query, docs, { k: docs.length });
      const blindCount = Math.min(5, k);
      const blind = ranked.slice(0, blindCount);
      const fresh = [];
      for (const h of ranked.slice(blindCount)) {
        if (fresh.length >= k - blindCount) break;
        if (seen.has(h.id)) continue;
        fresh.push(h);
      }
      const hits = [...blind, ...fresh];
      for (const h of hits) db.bumpHit(h.level, h.id);
      markSearched(workspace, sessionId ?? "unknown", hits.map((h) => h.id), dir);
      const reordered = [...hits].sort((a, b) => (a.updated_at ?? 0) - (b.updated_at ?? 0));
      return {
        note: "\u5982\u679C\u51B2\u7A81\uFF0C\u4EE5\u6700\u65B0\u7684\u4E3A\u51C6\u3002\u65F6\u95F4\u6233\u8F83\u65E7\u7684\u6761\u76EE\u53EF\u4F5C\u4E3A\u4E8B\u60C5\u53D1\u5C55\u8FC7\u7A0B\u7684\u53C2\u8003\u3002\u5982\u679C\u4F60\u786E\u5B9E\u9700\u8981\u66F4\u591A\u7EC6\u8282\uFF0C\u53EF\u4EE5\u76F4\u63A5\u53BB\u804A\u5929\u8BB0\u5F55\u91CC\u641C\u7D22\u76F8\u5173\u5173\u952E\u8BCD\u3002",
        hits: reordered.map((h) => {
          const row = byId.get(h.id);
          return {
            id: h.id,
            level: h.level,
            title: h.title ?? "",
            content: contentMax > 0 ? h.content.slice(0, contentMax) : h.content,
            keywords: row?.keywords ?? [],
            project: row?.project ?? "",
            score: Math.round(h.score * 100) / 100,
            updated_at: h.updated_at ?? 0
          };
        })
      };
    },
    presentCall(args) {
      const parsed = args;
      return { card: "generic", title: `memory_search: ${String(parsed.query ?? "").slice(0, 40)}`, kind: "read" };
    }
  };
}
function findSimilarTool(dir) {
  return {
    name: "memory_find_similar",
    description: T("memory_find_similar.description"),
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { type: "string", description: T("memory_find_similar.param.id") },
        k: { type: "integer", minimum: 1, maximum: 20, default: 5, description: T("memory_find_similar.param.k") },
        content_max: { type: "integer", minimum: 0, maximum: 5e3, default: 200, description: T("memory_find_similar.param.content_max") }
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["hits"],
        properties: {
          hits: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "level", "similarity"],
              properties: {
                id: { type: "string" },
                level: { type: "string" },
                title: { type: "string" },
                content: { type: "string" },
                similarity: { type: "number", description: T("memory_find_similar.out.hits.similarity") }
              }
            }
          }
        }
      },
      render: (_args, value) => {
        const v = value;
        return (v.hits ?? []).map((h) => ({
          type: "text",
          text: `[${String(h.level ?? "")} ${String(h.id ?? "").slice(0, 12)}] \u76F8\u4F3C\u5EA6 ${Number(h.similarity ?? 0).toFixed(3)} ${String(h.title ?? "")} ${String(h.content ?? "").slice(0, 80)}`
        }));
      }
    },
    async execute(args, exec) {
      const parsed = args;
      const id = typeof parsed.id === "string" ? parsed.id.trim() : "";
      if (!id) throw new Error("memory_find_similar: id \u4E0D\u80FD\u4E3A\u7A7A");
      const workspace = workspaceOf(exec);
      if (!workspace) throw new Error("memory_find_similar: \u65E0\u6CD5\u786E\u5B9A\u5DE5\u4F5C\u533A\uFF08\u4F1A\u8BDD\u65E0 cwd\uFF09");
      const db = getDb(workspace, dir);
      const found = db.findById(id);
      if (!found) throw new Error(`memory_find_similar: \u672A\u627E\u5230\u8BB0\u5FC6 ${id.slice(0, 12)}`);
      const sessionId = sessionIdOf(exec);
      const seen = readSeen(workspace, sessionId ?? "unknown", dir);
      const kRaw = coerceNumber(parsed.k);
      const k = kRaw !== void 0 ? Math.max(1, Math.min(20, Math.round(kRaw))) : 5;
      const cmRaw = coerceNumber(parsed.content_max);
      const contentMax = cmRaw !== void 0 ? Math.max(0, Math.min(5e3, Math.round(cmRaw))) : 200;
      const rows = LEVELS.flatMap((lv) => lv === "soul" || lv === "user" ? [] : db.listSearchable(lv));
      const candidates = rows.filter((r) => r.id !== found.row.id && !seen.has(r.id) && r.source_session !== sessionId);
      const docs = candidates.map((r) => ({
        id: r.id,
        level: r.level,
        title: r.title,
        content: r.content,
        keywords: r.keywords,
        importance: r.importance,
        created_at: r.created_at,
        updated_at: r.updated_at
      }));
      const hits = findSimilar(found.row.content, docs, k);
      markSearched(workspace, sessionId ?? "unknown", hits.map((h) => h.id), dir);
      return {
        hits: hits.map((h) => ({
          id: h.id,
          level: h.level,
          title: h.title ?? "",
          content: contentMax > 0 ? h.content.slice(0, contentMax) : h.content,
          similarity: h.similarity
        }))
      };
    },
    presentCall(args) {
      const parsed = args;
      return { card: "generic", title: `memory_find_similar: ${String(parsed.id ?? "").slice(0, 12)}`, kind: "read" };
    }
  };
}
function readTool(dir) {
  return {
    name: "memory_read",
    description: T("memory_read.description"),
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { type: "string", description: T("memory_read.param.id") }
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["found"],
        properties: {
          found: { type: "boolean" },
          id: { type: "string" },
          level: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          importance: { type: "number" },
          status: { type: "string" },
          keywords: { type: "array", items: { type: "string" } },
          project: { type: "string" },
          goal: { type: "string" },
          corrected: { type: "boolean" },
          created_at: { type: "number" },
          updated_at: { type: "number" }
        }
      },
      render: (_args, value) => {
        const v = value;
        const hint = "\u5982\u679C\u4F60\u786E\u5B9E\u9700\u8981\u66F4\u591A\u7EC6\u8282\uFF0C\u53EF\u4EE5\u76F4\u63A5\u53BB\u804A\u5929\u8BB0\u5F55\u91CC\u641C\u7D22\u76F8\u5173\u5173\u952E\u8BCD\u3002";
        if (!v.found) return [{ type: "text", text: `\u672A\u627E\u5230\u8BE5\u8BB0\u5FC6\u3002${hint}` }];
        const parts = [`[${String(v.level ?? "")}] ${String(v.title ?? "")}\uFF08${String(v.status ?? "")}\uFF09`];
        if (v.project) parts.push(`\u9879\u76EE\uFF1A${String(v.project)}`);
        if (v.goal) parts.push(`\u76EE\u6807\uFF1A${String(v.goal)}`);
        parts.push(String(v.content ?? ""));
        parts.push(hint);
        return [{ type: "text", text: parts.join("\n") }];
      }
    },
    async execute(args, exec) {
      const parsed = args;
      const id = typeof parsed.id === "string" ? parsed.id.trim() : "";
      if (!id) throw new Error("memory_read: id \u4E0D\u80FD\u4E3A\u7A7A");
      const workspace = workspaceOf(exec);
      if (!workspace) throw new Error("memory_read: \u65E0\u6CD5\u786E\u5B9A\u5DE5\u4F5C\u533A\uFF08\u4F1A\u8BDD\u65E0 cwd\uFF09");
      const found = getDb(workspace, dir).findById(id);
      if (!found) return { found: false };
      const { row } = found;
      markAccessed(workspace, sessionIdOf(exec) ?? "unknown", [row.id], dir);
      return {
        found: true,
        id: row.id,
        level: row.level,
        title: row.title ?? "",
        content: row.content,
        importance: row.importance,
        status: row.status,
        keywords: row.keywords,
        project: row.project ?? "",
        goal: row.goal ?? "",
        corrected: row.corrected === 1,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    },
    presentCall(args) {
      const parsed = args;
      return { card: "generic", title: `memory_read: ${String(parsed.id ?? "").slice(0, 16)}`, kind: "read" };
    }
  };
}
function updateTool(dir) {
  return {
    name: "memory_update",
    description: T("memory_update.description"),
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { type: "string", description: T("memory_update.param.id") },
        content: { type: "string", description: T("memory_update.param.content") },
        status: { type: "string", enum: ["active", "archived", "stale"], description: T("memory_update.param.status") },
        importance: { type: "integer", description: T("memory_update.param.importance") },
        goal: { type: "string", description: T("memory_update.param.goal") },
        project: { type: "string", description: T("memory_update.param.project") },
        keywords: { type: "array", items: { type: "string" }, description: T("memory_update.param.keywords") }
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["ok"],
        properties: {
          ok: { type: "boolean" },
          id: { type: "string" },
          level: { type: "string" }
        }
      },
      render: (_args, value) => {
        const v = value;
        return [{ type: "text", text: v.ok ? `\u2705 \u5DF2\u66F4\u65B0\uFF08${String(v.level ?? "")} ${String(v.id ?? "").slice(0, 8)}\uFF09\u3002` : "\u66F4\u65B0\u5931\u8D25\uFF1A\u672A\u627E\u5230\u8BE5\u8BB0\u5FC6\u3002" }];
      }
    },
    async execute(args, exec) {
      const parsed = args;
      const id = typeof parsed.id === "string" ? parsed.id.trim() : "";
      if (!id) throw new Error("memory_update: id \u4E0D\u80FD\u4E3A\u7A7A");
      const workspace = workspaceOf(exec);
      if (!workspace) throw new Error("memory_update: \u65E0\u6CD5\u786E\u5B9A\u5DE5\u4F5C\u533A\uFF08\u4F1A\u8BDD\u65E0 cwd\uFF09");
      const db = getDb(workspace, dir);
      const sessionId = sessionIdOf(exec);
      const found = db.findById(id);
      if (!found) return { ok: false, id, level: "" };
      const patch = {};
      if (typeof parsed.content === "string" && parsed.content.trim()) patch.content = parsed.content.trim();
      if (typeof parsed.status === "string" && ["active", "archived", "stale"].includes(parsed.status)) patch.status = parsed.status;
      const importanceRaw = coerceNumber(parsed.importance);
      if (importanceRaw !== void 0) patch.importance = Math.round(importanceRaw);
      if (typeof parsed.goal === "string" && parsed.goal.trim() && found.level === "topic") patch.goal = parsed.goal.trim();
      if (typeof parsed.project === "string" && (found.level === "project" || found.level === "fact" || found.level === "lesson" || found.level === "rules" || found.level === "topic")) {
        const cleared = parsed.project.trim() === "";
        patch.project = cleared ? null : parsed.project.trim();
        if (!cleared && !isGlobalProject(String(patch.project)) && !String(patch.project).includes(",")) setCurrentProject(workspace, sessionId ?? "unknown", patch.project, dir);
      }
      {
        const kw = normalizeKeywords(parsed.keywords);
        if (kw.length > 0) patch.keywords = kw;
      }
      const ok = Object.keys(patch).length > 0 ? db.update(found.level, found.row.id, patch) : true;
      if (ok && Object.keys(patch).length > 0) markWritten(workspace, sessionId ?? "unknown", [found.row.id], dir);
      return { ok, id: found.row.id, level: found.level };
    },
    presentCall(args) {
      const parsed = args;
      return { card: "generic", title: `memory_update: ${String(parsed.id ?? "").slice(0, 8)}${parsed.status ? ` \u2192 ${String(parsed.status)}` : ""}`, kind: "write" };
    }
  };
}
function projectTool(dir) {
  return {
    name: "memory_project",
    description: T("memory_project.description"),
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["project"],
      properties: {
        project: { type: "string", description: T("memory_project.param.project") }
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["project", "text"],
        properties: {
          project: { type: "string" },
          text: { type: "string", description: T("memory_project.out.text") }
        }
      },
      render: (_args, value) => {
        const v = value;
        return [{ type: "text", text: String(v.text ?? "") }];
      }
    },
    async execute(args, exec) {
      const parsed = args;
      const project = typeof parsed.project === "string" ? parsed.project.trim() : "";
      if (!project) throw new Error("memory_project: project \u4E0D\u80FD\u4E3A\u7A7A");
      const workspace = workspaceOf(exec);
      if (!workspace) throw new Error("memory_project: \u65E0\u6CD5\u786E\u5B9A\u5DE5\u4F5C\u533A\uFF08\u4F1A\u8BDD\u65E0 cwd\uFF09");
      const db = getDb(workspace, dir);
      const sessionId = sessionIdOf(exec);
      if (!isGlobalProject(project) && !project.includes(",")) setCurrentProject(workspace, sessionId ?? "unknown", project, dir);
      markProjectQueried(workspace, sessionId ?? "unknown", project, dir);
      const text = buildProjectSectionText(db, workspace, project, dir);
      if (text === null) {
        return { project, text: L("project.empty", { name: project }) };
      }
      return { project, text };
    },
    presentCall(args) {
      const parsed = args;
      return { card: "generic", title: `memory_project: ${String(parsed.project ?? "").slice(0, 24)}`, kind: "read" };
    }
  };
}
function registerMemoryTools(register, dir = ".dsh-meow") {
  register(rememberTool(dir));
  register(searchTool(dir));
  register(findSimilarTool(dir));
  register(readTool(dir));
  register(updateTool(dir));
  register(projectTool(dir));
}

// src/dream.ts
var PLUGIN_SOURCE = { kind: "plugin:meow-memory" };
var DREAM_MARKER = "[meow-memory-dream]";
function shortSessionId(sid) {
  return (sid.startsWith("session-") ? sid.slice(8) : sid).slice(0, 8);
}
function dreamLog(ws, dir, msg) {
  try {
    appendFileSync(join5(ws, dir, "dream-debug.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] ${msg}
`);
  } catch {
  }
}
var LEVEL_ORDER = { project: 0, topic: 1, fact: 2, lesson: 3, rules: 4, soul: 5, user: 6 };
function formatTime(t) {
  return new Date(t).toISOString().slice(0, 16).replace("T", " ");
}
function groupByProject(rows) {
  const byProject = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const list = projectList(r.project);
    const key = list.length > 0 ? list[0] : "";
    if (!byProject.has(key)) byProject.set(key, []);
    byProject.get(key).push(r);
  }
  for (const list of byProject.values()) {
    list.sort((a, b) => {
      const l = LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];
      if (l !== 0) return l;
      return a.created_at - b.created_at;
    });
  }
  return [...byProject.entries()].sort((a, b) => a[0] === "" ? 1 : b[0] === "" ? -1 : a[0].localeCompare(b[0])).map(([name2, rows2]) => ({ name: name2, rows: rows2 }));
}
function collectDreamRounds(db, sessionId, workspace, dir = ".dsh-meow", rulesReviewDays = DEFAULT_RULES_REVIEW_DAYS) {
  const seen = /* @__PURE__ */ new Set([...readSeen(workspace, sessionId, dir), ...readWritten(workspace, sessionId, dir)]);
  const atomic = [];
  const topic = [];
  for (const level of ["project", "fact", "lesson", "rules", "soul", "user"]) {
    for (const r of db.list(level)) {
      if (!(r.source_session === sessionId || seen.has(r.id))) continue;
      if (level === "rules" && rulesReviewDays > 0 && Date.now() - r.updated_at > rulesReviewDays * 864e5) continue;
      atomic.push(r);
    }
  }
  for (const r of db.list("topic")) {
    if (r.source_session === sessionId || seen.has(r.id)) topic.push(r);
  }
  const rounds = [];
  if (atomic.length > 0) rounds.push({ kind: "atomic", groups: groupByProject(atomic) });
  rounds.push({ kind: "topic", groups: groupByProject(topic) });
  const projects = /* @__PURE__ */ new Set();
  for (const r of [...atomic, ...topic]) for (const p of projectList(r.project)) projects.add(p);
  if (projects.size > 0) rounds.push({ kind: "project-summary", groups: [], projects: [...projects].sort() });
  return rounds;
}
function formatRow(r, kwLabel, noneLabel) {
  const head = r.content.replace(/\s+/g, " ").trim();
  const meta = [r.level];
  if (r.level === "project" && r.subcategory) meta.push(r.subcategory);
  if (r.title) meta.push(`\u300A${r.title}\u300B`);
  if (r.status !== "active") meta.push(r.status);
  meta.push(`${r.id} ${formatTime(r.updated_at)}`);
  const kw = (r.keywords ?? []).filter((k) => typeof k === "string" && k.length > 0);
  const kwLine = kw.length > 0 ? kw.join(", ") : noneLabel;
  return `- [${meta.join(" ")}] ${head}
  ${kwLabel} ${kwLine}`;
}
function buildDreamMessage(db, sessionId, T2, rounds, idx) {
  const round = rounds[idx];
  const lbl3 = (key, params) => fillTemplate(keyedValue("labels", key), params);
  const lines = [
    `${DREAM_MARKER} ${lbl3("dream.title")}`,
    "",
    ...resolveSlotText("dream-header", {
      timestamp: formatTime(T2),
      idx: String(idx + 1),
      total: String(rounds.length),
      roundKind: lbl3(`dream.round.${round.kind}`)
    }).split("\n"),
    ""
  ];
  if (round.kind === "project-summary") {
    lines.push(...resolveSlotText("dream-project-summary", { projects: (round.projects ?? []).join("\u3001") }).split("\n"));
  } else {
    const kwLabel = lbl3("dream.row.keywordsLabel");
    const noneLabel = lbl3("dream.row.none");
    const groupsText = round.groups.map((g) => {
      const name2 = g.name === "" ? lbl3("dream.groupUnlabeled") : g.name;
      return `${lbl3("dream.groupHeader", { name: name2 })}
${g.rows.map((r) => formatRow(r, kwLabel, noneLabel)).join("\n")}`;
    }).join("\n\n");
    const listBlock = round.groups.length === 0 ? `
${lbl3("dream.topic.empty")}` : `

${groupsText}`;
    lines.push(...resolveSlotText(round.kind === "topic" ? "dream-topic" : "dream-atomic", { list: listBlock }).split("\n"));
  }
  return createUserMessage({ content: [{ type: "text", text: lines.join("\n") }], source: PLUGIN_SOURCE });
}
var DREAM_LEASE_MS = 30 * 6e4;
var liveAgents = /* @__PURE__ */ new Map();
function registerLiveAgent(agent) {
  const id = agent.session?.header?.id;
  if (typeof id === "string" && id.length > 0) liveAgents.set(id, agent);
}
function newDreamOwner() {
  return `${process.pid}:${Math.random().toString(36).slice(2, 10)}`;
}
var DREAM_RETRIGGER_COOLDOWN_MS = 6 * 36e5;
function windowNeedsDream(w, now = Date.now()) {
  if (now - w.last_event_time > 24 * 36e5) return false;
  const lastDream = w.last_dream_time ?? 0;
  if (lastDream >= w.last_event_time) return false;
  if (lastDream > 0 && now - lastDream < DREAM_RETRIGGER_COOLDOWN_MS) return false;
  return true;
}
function safeSteer(agent, msg, workspace, dir, tag) {
  const steer = agent?.steer;
  if (typeof steer !== "function") return false;
  try {
    steer.call(agent, msg);
    return true;
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    dreamLog(workspace, dir, `${tag} steer-failed err=${text}`);
    console.warn(`[meow-memory] ${tag}: agent.steer failed, dream skipped (${text})`);
    return false;
  }
}
function sendMemoryTurn(agent, msg, workspace, dir, tag) {
  const followup = agent?.followup;
  if (typeof followup !== "function") return safeSteer(agent, msg, workspace, dir, tag);
  try {
    followup.call(agent, msg);
    return true;
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    dreamLog(workspace, dir, `${tag} followup-failed err=${text}`);
    console.warn(`[meow-memory] ${tag}: agent.followup failed, memory task skipped (${text})`);
    return false;
  }
}
var DREAM_HEARTBEAT_MS = 6e4;
var HEARTBEAT_MAX_MS = 6 * 36e5;
var dreamHeartbeats = /* @__PURE__ */ new Map();
function armDreamHeartbeat(sessionId, workspace, dir) {
  if (dreamHeartbeats.has(sessionId)) return;
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const hb = dreamHeartbeats.get(sessionId);
    if (hb === void 0) return;
    try {
      if (Date.now() - hb.startedAt > HEARTBEAT_MAX_MS || !getDb(workspace, dir).touchDreamLease(sessionId)) {
        stopDreamHeartbeat(sessionId);
      }
    } catch {
      stopDreamHeartbeat(sessionId);
    }
  }, DREAM_HEARTBEAT_MS);
  dreamHeartbeats.set(sessionId, { timer, startedAt });
}
function stopDreamHeartbeat(sessionId) {
  const hb = dreamHeartbeats.get(sessionId);
  if (hb === void 0) return;
  dreamHeartbeats.delete(sessionId);
  clearInterval(hb.timer);
}
function disposeDreamHeartbeats() {
  for (const sid of [...dreamHeartbeats.keys()]) stopDreamHeartbeat(sid);
}
function startWindowDream(ctx, agent, workspace, dir = ".dsh-meow", onDreamState, rulesReviewDays = DEFAULT_RULES_REVIEW_DAYS) {
  const sessionId = agent.session?.header?.id;
  if (!sessionId) return false;
  const db = getDb(workspace, dir);
  const rounds = collectDreamRounds(db, sessionId, workspace, dir, rulesReviewDays);
  if (rounds.length === 0) {
    db.finishDream(sessionId, Date.now());
    dreamLog(workspace, dir, `dream skip-empty sid=${shortSessionId(sessionId)}`);
    onDreamState?.(sessionId, "dreamed");
    return false;
  }
  const win = db.getWindow(sessionId);
  const T2 = win && win.last_event_time > 0 ? win.last_event_time : Date.now();
  if (!db.claimDream(sessionId, newDreamOwner(), T2, DREAM_LEASE_MS)) return false;
  onDreamState?.(sessionId, "dreaming");
  const msg = buildDreamMessage(db, sessionId, T2, rounds, 0);
  if (!sendMemoryTurn(agent, msg, workspace, dir, `dream start sid=${shortSessionId(sessionId)}`)) {
    db.releaseDream(sessionId);
    return false;
  }
  armDreamHeartbeat(sessionId, workspace, dir);
  dreamLog(workspace, dir, `dream start pid=${process.pid} session=${shortSessionId(sessionId)} rounds=${rounds.length} T=${T2}`);
  return true;
}
function advanceDream(agent, dir = ".dsh-meow", onDreamState, rulesReviewDays = DEFAULT_RULES_REVIEW_DAYS) {
  const sessionId = agent?.session?.header?.id;
  const ws = agent?.session?.header?.cwd;
  if (typeof sessionId !== "string" || typeof ws !== "string" || ws.length === 0) return;
  const db = getDb(ws, dir);
  const lease = db.getDreamLease(sessionId);
  if (lease === null) return;
  if (Date.now() - lease.progress_at > DREAM_LEASE_MS) {
    recoverInterruptedDream(db, sessionId, ws, dir);
    dreamLog(ws, dir, `advanceDream expired-recover sid=${shortSessionId(sessionId)}`);
    onDreamState?.(sessionId, "dreamed");
    return;
  }
  const rounds = collectDreamRounds(db, sessionId, ws, dir, rulesReviewDays);
  const nextIdx = lease.group_idx + 1;
  if (nextIdx < rounds.length) {
    if (db.advanceDreamLease(sessionId, lease.group_idx, DREAM_LEASE_MS)) {
      armDreamHeartbeat(sessionId, ws, dir);
      const msg = buildDreamMessage(db, sessionId, lease.T, rounds, nextIdx);
      const tag = `dream group ${nextIdx + 1}/${rounds.length}`;
      if (safeSteer(agent, msg, ws, dir, tag)) dreamLog(ws, dir, `${tag} steered`);
    }
    return;
  }
  finalizeDream(db, sessionId, ws, dir, lease.T, "done", rounds.length, onDreamState);
}
function finalizeDream(db, sessionId, workspace, dir, T2, reason, groupsCount, onDreamState) {
  stopDreamHeartbeat(sessionId);
  try {
    const stamped = db.stampDream(sessionId, T2);
    db.finishDream(sessionId, Date.now());
    db.logDream(
      `window dream ${reason}: ${shortSessionId(sessionId)} groups=${groupsCount} stamped=${stamped} T=${new Date(T2).toISOString()}`,
      { before: void 0, after: void 0 }
    );
    dreamLog(workspace, dir, `dream ${reason} session=${shortSessionId(sessionId)} groups=${groupsCount} stamped=${stamped}`);
    onDreamState?.(sessionId, "dreamed");
  } catch (e) {
    dreamLog(workspace, dir, `dream ${reason} finish error: ${String(e)}`);
  }
}
function abortDream(agent, dir = ".dsh-meow", onDreamState) {
  const sessionId = agent?.session?.header?.id;
  const ws = agent?.session?.header?.cwd;
  if (typeof sessionId !== "string" || typeof ws !== "string" || ws.length === 0) return;
  const db = getDb(ws, dir);
  const lease = db.getDreamLease(sessionId);
  if (lease === null) return;
  finalizeDream(db, sessionId, ws, dir, lease.T, "aborted", lease.group_idx + 1, onDreamState);
}
function dreamTool(ctx, dir = ".dsh-meow", onDreamState, rulesReviewDays = DEFAULT_RULES_REVIEW_DAYS) {
  return {
    name: "memory_dream",
    description: keyedValue("tools", "memory_dream.description"),
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {}
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["ok"],
        properties: {
          ok: { type: "boolean" },
          note: { type: "string" }
        }
      },
      render: (_args, value) => {
        const v = value;
        return [{ type: "text", text: v.ok ? `\u{1F9E0} dream \u5DF2\u5B89\u6392\u3002${String(v.note ?? "")}` : `dream \u672A\u542F\u52A8\uFF1A${String(v.note ?? "")}` }];
      }
    },
    async execute(_args, exec) {
      const workspace = workspaceOf(exec);
      if (!workspace) throw new Error("memory_dream: \u65E0\u6CD5\u786E\u5B9A\u5DE5\u4F5C\u533A\uFF08\u4F1A\u8BDD\u65E0 cwd\uFF09");
      if (!exec.agent) throw new Error("memory_dream: \u65E0\u6CD5\u786E\u5B9A\u5F53\u524D agent");
      if (isSubagentAgent(exec.agent)) {
        return { ok: false, note: "\u5F53\u524D\u662F\u5B50\u4EE3\u7406\u4F1A\u8BDD\uFF0C\u6CA1\u6709\u72EC\u7ACB\u7684\u8BB0\u5FC6\u7A97\u53E3\uFF1B\u8BB0\u5FC6\u6574\u7406\u5F52\u7236\u7A97\u53E3\u8D1F\u8D23\uFF0C\u65E0\u9700\uFF08\u4E5F\u4E0D\u80FD\uFF09\u5728\u6B64\u89E6\u53D1 dream\u3002" };
      }
      const ok = startWindowDream(ctx, exec.agent, workspace, dir, onDreamState, rulesReviewDays);
      if (ok) return { ok, note: "\u6574\u7406\u4EFB\u52A1\u5DF2\u5728\u540E\u53F0\u542F\u52A8\uFF0C\u4F1A\u8BDD\u6D41\u4E2D\u7684\u4EFB\u52A1\u6C14\u6CE1\u4F1A\u663E\u793A\u8FDB\u5EA6\u4E0E\u5B8C\u6210\u72B6\u6001\u3002" };
      const sessionId = exec.agent.session?.header?.id;
      const lease = typeof sessionId === "string" ? getDb(workspace, dir).getDreamLease(sessionId) : null;
      return {
        ok,
        note: lease !== null ? "\u672C\u7A97\u53E3\u5DF2\u6709 dream \u4EFB\u52A1\u5728\u8FDB\u884C\u4E2D\uFF08\u6216\u5F85\u8865\u6536\u5C3E\uFF09\u3002" : "\u672C\u7A97\u53E3\u6CA1\u6709\u9700\u8981\u6574\u7406\u7684\u8BB0\u5FC6\u3002"
      };
    },
    presentCall() {
      return { card: "generic", title: "memory_dream: \u6574\u7406\u672C\u7A97\u53E3\u8BB0\u5FC6", kind: "write" };
    }
  };
}
function dreamCommandDefinition(ctx, dir = ".dsh-meow", onDreamState, rulesReviewDays = DEFAULT_RULES_REVIEW_DAYS) {
  return {
    name: "dream",
    description: "\u624B\u52A8\u5524\u8D77\u4E00\u6B21\u8BB0\u5FC6\u6574\u7406\uFF08dream\uFF09\uFF1A\u9010\u8F6E\u56DE\u987E\u672C\u7A97\u53E3\u5EFA\u7ACB/\u63D0\u53D6\u8FC7\u7684\u8DE8\u4F1A\u8BDD\u8BB0\u5FC6\u5E76\u5C01\u5B58\u3002\u4E0E memory_dream \u5DE5\u5177\u76F8\u540C\uFF0C\u624B\u52A8\u89E6\u53D1\u4E0D\u53D7\u5CF0\u65F6\u6291\u5236\u3002",
    handler(invocation) {
      const agent = invocation?.agent;
      if (!agent) return { kind: "error", text: "/dream \u65E0\u6CD5\u786E\u5B9A\u5F53\u524D\u7A97\u53E3\u7684\u4F1A\u8BDD\u3002" };
      const header = agent.session?.header;
      if (header?.origin === "subagent") {
        return { kind: "error", text: "/dream \u53EA\u80FD\u5728\u4E3B\u4F1A\u8BDD\u4F7F\u7528\uFF1A\u5B50\u4EE3\u7406\u6CA1\u6709\u72EC\u7ACB\u7684\u8BB0\u5FC6\u7A97\u53E3\u3002" };
      }
      const workspace = typeof header?.cwd === "string" && header.cwd.length > 0 ? header.cwd : null;
      if (workspace === null) {
        return { kind: "error", text: "/dream \u65E0\u6CD5\u786E\u5B9A\u5F53\u524D\u7A97\u53E3\u7684\u5DE5\u4F5C\u533A\uFF08\u4F1A\u8BDD\u65E0 cwd\uFF09\u3002" };
      }
      if (typeof header?.id !== "string" || header.id.length === 0) {
        return { kind: "error", text: "/dream \u65E0\u6CD5\u786E\u5B9A\u5F53\u524D\u7A97\u53E3\u7684\u4F1A\u8BDD id\u3002" };
      }
      const ok = startWindowDream(ctx, agent, workspace, dir, onDreamState, rulesReviewDays);
      if (ok) return { kind: "success", text: "\u{1F9E0} dream \u5DF2\u89E6\u53D1\uFF1A\u6574\u7406\u4EFB\u52A1\u5DF2\u5728\u540E\u53F0\u8FD0\u884C\uFF0C\u4F1A\u8BDD\u6D41\u4E2D\u7684\u4EFB\u52A1\u6C14\u6CE1\u4F1A\u663E\u793A\u8FDB\u5EA6\u4E0E\u5B8C\u6210\u72B6\u6001\u3002" };
      const lease = getDb(workspace, dir).getDreamLease(header.id);
      return lease !== null ? { kind: "error", text: "\u672C\u7A97\u53E3\u5DF2\u6709 dream \u4EFB\u52A1\u5728\u8FDB\u884C\u4E2D\uFF08\u6216\u5F85\u8865\u6536\u5C3E\uFF09\uFF0C\u672A\u91CD\u590D\u542F\u52A8\u3002" } : { kind: "error", text: "\u672C\u7A97\u53E3\u6CA1\u6709\u9700\u8981\u6574\u7406\u7684\u8BB0\u5FC6\uFF08\u672C\u7A97\u53E3\u5EFA\u7ACB/\u63D0\u53D6\u8FC7\u7684\u8BB0\u5FC6\u4E3A\u7A7A\uFF09\u3002" };
    }
  };
}
function recoverInterruptedDream(db, sessionId, workspace, dir = ".dsh-meow") {
  const lease = db.getDreamLease(sessionId);
  const w = db.getWindow(sessionId);
  const T2 = lease ? lease.T : w && w.last_event_time > 0 ? w.last_event_time : Date.now();
  const stamped = db.stampDream(sessionId, T2);
  db.finishDream(sessionId, Date.now());
  db.logDream(
    `window dream recovered (interrupted): ${shortSessionId(sessionId)} stamped=${stamped} T=${new Date(T2).toISOString()}`,
    { before: void 0, after: void 0 }
  );
  dreamLog(workspace, dir, `dream recovered session=${shortSessionId(sessionId)} stamped=${stamped}`);
  return stamped;
}
function hourInTimeZone(timeZone, date3 = /* @__PURE__ */ new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hour12: false }).formatToParts(date3);
    const h = parts.find((p) => p.type === "hour")?.value;
    if (h !== void 0) return parseInt(h, 10) % 24;
  } catch {
  }
  return date3.getHours();
}
function minutesInTimeZone(timeZone, date3 = /* @__PURE__ */ new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "numeric", hour12: false }).formatToParts(date3);
    const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "NaN", 10);
    const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "NaN", 10);
    if (!Number.isNaN(h) && !Number.isNaN(m)) return h % 24 * 60 + m;
  } catch {
  }
  const d = new Date(date3);
  return d.getHours() * 60 + d.getMinutes();
}
function parseMinute(hhmm) {
  const mm = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm).trim());
  if (!mm) return null;
  const h = parseInt(mm[1], 10);
  const m = parseInt(mm[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}
function isDreamSuppressed(cfg, date3 = /* @__PURE__ */ new Date()) {
  const m = minutesInTimeZone(cfg.timeZone, date3);
  const lead = Math.max(0, Math.floor(cfg.suppressLeadMinutes));
  for (const w of cfg.suppressWindows) {
    const start = parseMinute(w.start);
    const end = parseMinute(w.end);
    if (start === null || end === null || start === end) continue;
    const from3 = (start - lead + 1440) % 1440;
    if (from3 === end) return true;
    if (from3 < end) {
      if (m >= from3 && m < end) return true;
    } else if (m >= from3 || m < end) {
      return true;
    }
  }
  return false;
}
var resumeInFlight = /* @__PURE__ */ new Set();
var RESUME_BACKOFF_MS = 6 * 36e5;
var resumeFailedAt = /* @__PURE__ */ new Map();
function resumeBackoffActive(sessionId) {
  const at = resumeFailedAt.get(sessionId);
  return at !== void 0 && Date.now() - at < RESUME_BACKOFF_MS;
}
function markResumeFailed(sessionId) {
  resumeFailedAt.set(sessionId, Date.now());
  if (resumeFailedAt.size <= 512) return;
  const now = Date.now();
  for (const [sid, at] of resumeFailedAt) {
    if (now - at >= RESUME_BACKOFF_MS) resumeFailedAt.delete(sid);
  }
}
function isSubagentAgent(agent) {
  const header = agent?.session?.header;
  if (header === void 0 || header === null) return false;
  if (header.origin === "subagent") return true;
  return typeof header.delegationDepth === "number" && header.delegationDepth > 0;
}
var autoDreamSkipWindows = /* @__PURE__ */ new Set();
async function resumeAndDream(ctx, sessionId, workspace, dir, onDreamState, cfg) {
  const log = (msg) => dreamLog(workspace, dir, msg);
  const sid = shortSessionId(sessionId);
  if (resumeInFlight.has(sessionId)) return;
  if (resumeBackoffActive(sessionId)) return;
  resumeInFlight.add(sessionId);
  try {
    const agentsSvc = ctx.get?.("agents");
    if (agentsSvc === void 0 || typeof agentsSvc.resume !== "function") {
      log(`check agent-resume-unavailable sid=${sid} service=${agentsSvc ? "yes" : "no"}`);
      return;
    }
    const resumed = await agentsSvc.resume({ resumeSessionId: sessionId });
    const agent = resumed?.agent ?? resumed;
    const header = agent?.session?.header;
    if (header === void 0 || header === null || typeof header.id !== "string" || header.id.length === 0) {
      autoDreamSkipWindows.add(sessionId);
      log(`check resume unusable-agent sid=${sid} -> skip`);
      return;
    }
    log(`check agent-resumed sid=${sid}`);
    if (isSubagentAgent(agent)) {
      autoDreamSkipWindows.add(sessionId);
      log(`check resume skip-subagent sid=${sid}`);
      return;
    }
    const db = getDb(workspace, dir);
    const w = db.getWindow(sessionId);
    if (!w || !windowNeedsDream(w)) return;
    if (Date.now() - w.last_event_time < cfg.idleMinutes * 6e4) return;
    if (db.getDreamLease(sessionId) !== null) return;
    startWindowDream(ctx, agent, workspace, dir, onDreamState, cfg.rulesReviewDays);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("not found")) markResumeFailed(sessionId);
    log(`check agent-resume-failed sid=${sid} err=${msg}`);
  } finally {
    resumeInFlight.delete(sessionId);
  }
}
function dreamSweepOnce(ctx, cfg, dir, windowIndex2, onDreamState) {
  const archived = /* @__PURE__ */ new Set();
  try {
    const reg = ctx.get?.("workspaceRegistry");
    for (const id of reg?.archivedSessionIds ?? []) archived.add(id);
  } catch {
  }
  for (const [sessionId, workspace] of windowIndex2) {
    if (archived.has(sessionId)) continue;
    if (autoDreamSkipWindows.has(sessionId)) continue;
    const db = getDb(workspace, dir);
    if (db.isDreamSkipped(sessionId)) continue;
    const w = db.getWindow(sessionId);
    if (!w || !windowNeedsDream(w)) continue;
    const lease = db.getDreamLease(sessionId);
    dreamLog(workspace, dir, `check sid=${shortSessionId(sessionId)} active=${lease !== null} idle=${Math.round((Date.now() - w.last_event_time) / 1e3)}s`);
    if (lease !== null) {
      if (Date.now() - lease.progress_at > DREAM_LEASE_MS) {
        recoverInterruptedDream(db, sessionId, workspace, dir);
        onDreamState?.(sessionId, "dreamed");
      }
      continue;
    }
    if (Date.now() - w.last_event_time < cfg.idleMinutes * 6e4) continue;
    const agentsSvc = typeof ctx.get === "function" ? ctx.get("agents") : void 0;
    const agent = liveAgents.get(sessionId) ?? (agentsSvc !== void 0 && typeof agentsSvc.get === "function" ? agentsSvc.get(sessionId) : void 0);
    if (!agent) {
      dreamLog(workspace, dir, `check agent-missing sid=${shortSessionId(sessionId)} -> try resume`);
      void resumeAndDream(ctx, sessionId, workspace, dir, onDreamState, cfg);
      continue;
    }
    if (isSubagentAgent(agent)) {
      autoDreamSkipWindows.add(sessionId);
      dreamLog(workspace, dir, `check skip-subagent sid=${shortSessionId(sessionId)}`);
      continue;
    }
    const started = startWindowDream(ctx, agent, workspace, dir, onDreamState, cfg.rulesReviewDays);
    if (started) return;
  }
}
function scheduleDream(ctx, cfg, dir = ".dsh-meow", windowIndex2, onDreamState) {
  const timer = setInterval(() => {
    try {
      if (!cfg.enabled) return;
      if (isDreamSuppressed(cfg)) return;
      const gateWorkspaces = [...new Set(windowIndex2.values())].sort();
      if (gateWorkspaces.length === 0 || !getDb(gateWorkspaces[0], dir).claimCheckGate(6e4)) return;
      dreamSweepOnce(ctx, cfg, dir, windowIndex2, onDreamState);
    } catch (error) {
      console.warn(`[meow-memory] dream sweep failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, cfg.checkMinutes * 6e4);
  return () => clearInterval(timer);
}
var lastActivityAt = Date.now();
function noteActivity() {
  lastActivityAt = Date.now();
}

// src/migrate.ts
import { existsSync as existsSync3, readFileSync as readFileSync4, renameSync as renameSync2 } from "node:fs";
import { join as join6 } from "node:path";
var CATEGORY_TO_LEVEL = {
  fact: { level: "fact" },
  mistake: { level: "lesson", corrected: 1 },
  preference: { level: "user" },
  user_said: { level: "project" },
  lesson: { level: "lesson" },
  detail: { level: "project" }
};
var PROJECT_HINTS = [
  [/femwa|femo|femgen|fe4m/i, "femo"],
  // 匹配词保留 femwa/femGen（老 PROJECT.md 里的写法），输出名统一 femo
  [/meow-eyes|猫眼/i, "meow-eyes"],
  [/meow-memory|memory-meow/i, "meow-memory"],
  [/dsh-meow|dsh 本体|3080|3081|known-event|agentPreset|apiproxy/i, "dsh"]
];
function guessProject(content) {
  for (const [re, name2] of PROJECT_HINTS) {
    if (re.test(content)) return name2;
  }
  return "dsh";
}
function routeDetail(content) {
  return /路径|仓库|端口|目录|结构|junction|文件|package\.json|\.dsh|node_modules|http|127\.0\.0\.1|api|ctx\.|插件|引擎|路由/i.test(
    content
  ) ? "project" : "fact";
}
function routeUserSaid(content) {
  return /纠正|教训|错了|错了|改口|拍板|确认/i.test(content) ? { level: "lesson", corrected: 1 } : { level: "project" };
}
function routeCategory(cat, content) {
  switch (cat) {
    case "detail":
      return { level: routeDetail(content) };
    case "user_said":
      return routeUserSaid(content);
    default:
      return CATEGORY_TO_LEVEL[cat] ?? { level: "fact" };
  }
}
function parseLegacy(text) {
  const core = [];
  const entries = [];
  let current = null;
  const lines = text.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trimEnd();
    const sec = line.match(/^##\s+.+\(([a-z_]+)\)\s*$/);
    if (sec) {
      current = sec[1];
      continue;
    }
    if (line.startsWith("- ")) {
      const content = line.slice(2).trim();
      if (!content) continue;
      if (current) entries.push({ category: current, content });
      else core.push(content);
      continue;
    }
    if (!current) {
      const t = line.trim();
      if (t && !t.startsWith("#") && !t.startsWith(">") && !t.startsWith("=====")) core.push(t);
    }
  }
  return { core, entries };
}
function splitCoreLine(line) {
  return /ai|模型|我应该|作为|身份|自我|soul/i.test(line) ? "soul" : "user";
}
function migrateLegacy(db, workspace, dir = ".dsh-meow") {
  const projectFile = join6(workspace, dir, "PROJECT.md");
  if (!db.isFresh() || !existsSync3(projectFile)) return null;
  const text = readFileSync4(projectFile, "utf8");
  const { core, entries } = parseLegacy(text);
  let imported = 0;
  const now = Date.now();
  for (const line of core) {
    const level = splitCoreLine(line);
    db.insert({ level, content: line, importance: 3, source_session: "migration", created_at: now });
    imported++;
  }
  for (const { category, content } of entries) {
    const routed = routeCategory(category, content);
    const level = routed.level;
    const project = level === "project" || level === "fact" || level === "lesson" ? guessProject(content) : null;
    db.insert({
      level,
      content,
      importance: 1,
      corrected: routed.corrected ?? 0,
      project,
      source_session: "migration",
      created_at: now
    });
    imported++;
  }
  try {
    renameSync2(projectFile, projectFile + ".imported");
  } catch {
  }
  return imported;
}

// src/reflect.ts
var PLUGIN_SOURCE2 = { kind: "plugin:meow-memory" };
var REFLECT_MARKER = "[meow-memory-reflect]";
function scanTurn(events) {
  let startIdx = 0;
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e?.type === "turn/start") {
      startIdx = i;
      break;
    }
  }
  let sawToolCall = false;
  let lastToolName;
  let sawReflect = false;
  const texts = [];
  for (let i = startIdx; i < events.length; i++) {
    const e = events[i];
    if (e?.type === "user/message") {
      const src = e.data?.source;
      const msgText = (e.data?.content ?? []).filter((b) => b.type === "text" && typeof b.text === "string").map((b) => b.text ?? "").join(" ");
      if (src?.kind === "plugin" && src.plugin === "meow-memory" && msgText.includes(REFLECT_MARKER)) {
        sawReflect = true;
      } else {
        for (const b of e.data?.content ?? []) if (b.type === "text" && b.text) texts.push(b.text);
      }
    } else if (e?.type === "assistant/message") {
      for (const block of e.data?.message?.content ?? []) {
        if (block.type === "tool-call") {
          sawToolCall = true;
          lastToolName = block.name;
        } else if (block.type === "text" && block.text) {
          texts.push(block.text);
        }
      }
    }
  }
  return { sawToolCall, lastToolName, sawReflect, turnText: texts.join("\n").slice(-2e3) };
}
function consecutiveToolSteps(events) {
  let startIdx = 0;
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].type === "turn/start") {
      startIdx = i;
      break;
    }
  }
  let best = 0;
  let cur = 0;
  for (let i = startIdx; i < events.length; i++) {
    const e = events[i];
    if (e?.type !== "assistant/message") continue;
    for (const b of e.data?.message?.content ?? []) {
      if (b.type !== "tool-call" || typeof b.name !== "string") continue;
      if (b.name.startsWith("memory_")) cur = 0;
      else {
        cur++;
        if (cur > best) best = cur;
      }
    }
  }
  return best;
}
function buildReflectMessage(workspace, turnText, dir = ".dsh-meow") {
  const db = getDb(workspace, dir);
  const prompt = resolveSlotText("reflect", { projectList: projectNamesText(db.listProjectNames()) });
  const text = `${REFLECT_MARKER} ${prompt}`;
  return createUserMessage({ content: [{ type: "text", text }], source: PLUGIN_SOURCE2 });
}
function projectNamesText(projectNames) {
  return projectNames.length > 0 ? projectNames.join(" / ") : keyedValue("labels", "reflect.noProjects");
}

// src/dream-signal.ts
import { existsSync as existsSync4 } from "node:fs";
function headerOf(s) {
  const h = s.header;
  if (h !== null && typeof h === "object") {
    return { id: typeof h.id === "string" ? h.id : "", cwd: typeof h.cwd === "string" && h.cwd.length > 0 ? h.cwd : void 0 };
  }
  return { id: typeof s.id === "string" ? s.id : "", cwd: typeof s.cwd === "string" && s.cwd.length > 0 ? s.cwd : void 0 };
}
function collectDreamStates(sessions, dir = ".dsh-meow") {
  const dreamed = [];
  const dreaming = [];
  const opened = /* @__PURE__ */ new Set();
  for (const s of sessions) {
    const { cwd } = headerOf(s);
    if (typeof cwd !== "string" || cwd.length === 0 || opened.has(cwd)) continue;
    opened.add(cwd);
    if (!existsSync4(memoryDbPath(cwd, dir))) continue;
    try {
      const db = getDb(cwd, dir);
      for (const w of db.listWindows()) {
        const lease = db.getDreamLease(w.session_id);
        if (lease !== null && Date.now() - lease.progress_at <= DREAM_LEASE_MS) {
          dreaming.push(w.session_id);
        } else if (w.last_dream_time !== null && (w.last_event_time ?? 0) <= w.last_dream_time) {
          dreamed.push(w.session_id);
        }
      }
    } catch {
    }
  }
  return { dreamed, dreaming };
}
var DreamStateBroadcast = class {
  clients = /* @__PURE__ */ new Set();
  /**
   * SSE 连接入口（路由 handler）：应答 200 text/event-stream 并挂起连接。
   * 连接关闭（客户端断开/服务端 res.end）时自动从集合移除。
   */
  handle(_req, res) {
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "keep-alive",
      "x-accel-buffering": "no"
    });
    res.write(": connected\n\n");
    this.clients.add(res);
    const drop = () => {
      this.clients.delete(res);
    };
    res.on("close", drop);
  }
  /**
   * 广播一个状态变化事件：'dreamed'=整理完成加月亮、'dreaming'=dream 开始呼吸灯、
   * 'active'=有新活动去月亮、'skip'/'unskip'=用户切换跳过自动 dream 标记
   * （v0.16.0；dream-icon 端按未知状态幂等忽略，dream-skip 端据此同步本地集合）。
   */
  broadcast(sessionId, state) {
    const data = JSON.stringify({ sessionId, state });
    for (const res of this.clients) {
      try {
        res.write(`event: dream
id: ${Date.now()}
data: ${data}

`);
      } catch {
        this.clients.delete(res);
      }
    }
  }
  /** 关闭全部连接（插件卸载时调用）。 */
  dispose() {
    for (const res of this.clients) {
      try {
        res.end();
      } catch {
      }
    }
    this.clients.clear();
  }
};

// src/index.ts
var WELCOME_GUIDE_SEEN_ID = "__welcomeGuide__";
var name = "meow-memory";
var inject = ["tools"];
var META_SECTION_NAME2 = "__meta__";
function encodeMetaSection(meta) {
  return { name: META_SECTION_NAME2, text: JSON.stringify(meta) };
}
function createMemorySnapshotMessage(text, meta) {
  return createUserMessage({
    content: [{ type: "text", text }],
    source: {
      kind: "plugin:meow-memory",
      form: "snapshot",
      sections: [encodeMetaSection(meta), { name: "\u957F\u671F\u8BB0\u5FC6", text }]
    }
  });
}
function createMemoryNoticeMessage(text) {
  return createUserMessage({
    content: [{ type: "text", text }],
    source: {
      kind: "plugin:meow-memory",
      form: "notice",
      summary: boundContextSummary(text.replace(/\s+/g, " ").trim())
    }
  });
}
function getMemoryGuide() {
  return resolveSlotText("system-guide");
}
var PERF_LOG = join7(homedir3(), ".dsh-meow", "perf.log");
var applyCount = 0;
var evtCount = 0;
var perfBoot = Date.now();
var lastPerfLog = Date.now();
function perf(msg) {
  try {
    mkdirSync4(dirname5(PERF_LOG), { recursive: true });
    appendFileSync2(PERF_LOG, `[${(/* @__PURE__ */ new Date()).toISOString()}] ${msg}
`);
  } catch {
  }
}
function perfEvent() {
  evtCount++;
  const now = Date.now();
  if (now - lastPerfLog >= 5e3) {
    const elapsed = (now - perfBoot) / 1e3;
    perf(`evt total=${evtCount} elapsed=${elapsed.toFixed(1)}s rate=${(evtCount / Math.max(elapsed, 1e-3)).toFixed(1)}/s`);
    lastPerfLog = now;
  }
}
var Config = Schema2.object({
  /** 总开关：false 时注入、反思、工具全部停用。 */
  enabled: Schema2.boolean().default(true),
  /** 记忆目录（相对工作区）。 */
  projectDir: Schema2.string().default(".dsh-meow"),
  /** 关键词命中条数上限（fact/lesson/rules/topic 短条目，每条用户消息命中注入）。 */
  hitTopK: Schema2.number().min(0).max(10).default(2),
  /** 导引标题截断长度。 */
  titleMax: Schema2.number().min(10).max(200).default(40),
  /** 是否在 ReAct 任务结束后自动注入反思。 */
  reflect: Schema2.boolean().default(true),
  /** 单任务内连续工具 step 达到该值才在结束时触发反思（用户拍板：react ≥7 轮）。 */
  reflectTurns: Schema2.number().min(1).max(50).default(7),
  /** 首次打开库时自动迁移旧 PROJECT.md。 */
  autoMigrate: Schema2.boolean().default(true),
  /** prompt 语言（prompts/<lang>/ 语言包目录名）：决定注入/反思/dream 文案、工具
   *  描述与 BM25 分词的语言。**首次使用建议显式配置**——记忆条目语言必须与 BM25
   *  关键词语言一致，否则检索匹配率崩（详见 README）。zh=内置默认；en 等社区语言包
   *  放 lib/prompts/（随包）或 homedir/.dsh-meow/prompts/（实例覆盖，可只覆盖部分槽位）。
   *  不设置（undefined）：运行时按 zh 跑，且插件生效后的第一条真实用户消息会注入
   *  「首次设置」引导任务（AI 判断用户语言并完成配置，每会话至多提醒一次）。 */
  promptLang: Schema2.string().required(false),
  /** 空闲整理（dream）。 */
  dream: Schema2.object({
    enabled: Schema2.boolean().default(true),
    /** 窗口空闲多少分钟后允许 dream（用户拍板 2026-08-19：3 小时）。 */
    idleMinutes: Schema2.number().min(1).default(180),
    /** 抑制时段（目标时区，"HH:MM" 起止）：这些时段内不触发 dream。 */
    suppressWindows: Schema2.array(Schema2.object({ start: Schema2.string(), end: Schema2.string() })).default([{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }]),
    /** 每个抑制时段开始前追加的不触发分钟数（峰时前 15 分钟也不触发）。 */
    suppressLeadMinutes: Schema2.number().min(0).max(120).default(15),
    checkMinutes: Schema2.number().min(1).default(15),
    // 用户系统是美区时间（隐私设置），抑制时段按中国时区计算
    timeZone: Schema2.string().default("Asia/Shanghai"),
    /** rules 防 churn（测评 2026-08-25）：updated_at 距今超该天数的稳定准则不进 dream 第 1 轮清单；0=不过滤。 */
    rulesReviewDays: Schema2.number().min(0).default(DEFAULT_RULES_REVIEW_DAYS)
  }).default({}),
  /** 整理任务的模型（可选换模型）。反思/梦境永远在主窗口执行（steer）——配置了
   *  model 时仅在这两类轮的请求上经 agent/request waterfall 覆盖 provider/model，
   *  轮次结束自动换回主模型；不再提供"独立执行"开关（v0.24 移除）。 */
  delegate: Schema2.object({
    /** 反思/梦境轮换用模型：留空 = 全程主模型；'provider/model'（dsh route 格式）
     *  指定 provider+model，'model' 只换 model（provider 继承主会话）。 */
    model: Schema2.string().required(false)
  }).default({})
});
var SETTINGS_NS = "meow-memory";
var TIME_OF_DAY_RE = /^\d{1,2}:\d{2}$/;
function validateConfigUserLayer(value) {
  if (value === void 0 || value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("\u914D\u7F6E\u5FC5\u987B\u662F\u5BF9\u8C61");
  }
  const v = value;
  const reqBool = (k) => {
    if (v[k] !== void 0 && typeof v[k] !== "boolean") throw new Error(`${k} \u5FC5\u987B\u662F\u5E03\u5C14`);
  };
  const reqStr = (k) => {
    if (v[k] !== void 0 && typeof v[k] !== "string") throw new Error(`${k} \u5FC5\u987B\u662F\u5B57\u7B26\u4E32`);
  };
  const reqNum = (k) => {
    if (v[k] === void 0) return;
    if (typeof v[k] !== "number" || !Number.isFinite(v[k])) throw new Error(`${k} \u5FC5\u987B\u662F\u6570\u5B57`);
  };
  reqBool("enabled");
  reqStr("projectDir");
  reqNum("hitTopK");
  reqNum("titleMax");
  reqBool("reflect");
  reqNum("reflectTurns");
  reqBool("autoMigrate");
  reqStr("promptLang");
  const d = v.dream;
  if (d !== void 0) {
    if (d === null || typeof d !== "object" || Array.isArray(d)) throw new Error("dream \u5FC5\u987B\u662F\u5BF9\u8C61");
    const dd = d;
    if (dd.enabled !== void 0 && typeof dd.enabled !== "boolean") throw new Error("dream.enabled \u5FC5\u987B\u662F\u5E03\u5C14");
    reqNum("dream.idleMinutes");
    if (dd.idleMinutes !== void 0 && (typeof dd.idleMinutes !== "number" || !Number.isFinite(dd.idleMinutes))) throw new Error("dream.idleMinutes \u5FC5\u987B\u662F\u6570\u5B57");
    for (const k of ["suppressLeadMinutes", "checkMinutes", "rulesReviewDays"]) {
      if (dd[k] !== void 0 && (typeof dd[k] !== "number" || !Number.isFinite(dd[k]))) throw new Error(`dream.${k} \u5FC5\u987B\u662F\u6570\u5B57`);
    }
    if (dd.timeZone !== void 0 && typeof dd.timeZone !== "string") throw new Error("dream.timeZone \u5FC5\u987B\u662F\u5B57\u7B26\u4E32");
    if (dd.suppressWindows !== void 0) {
      if (!Array.isArray(dd.suppressWindows)) throw new Error("dream.suppressWindows \u5FC5\u987B\u662F\u6570\u7EC4");
      for (const w of dd.suppressWindows) {
        const win = w;
        if (typeof win !== "object" || win === null || typeof win.start !== "string" || typeof win.end !== "string" || !TIME_OF_DAY_RE.test(win.start) || !TIME_OF_DAY_RE.test(win.end)) {
          throw new Error('dream.suppressWindows \u6BCF\u9879\u5FC5\u987B\u662F { start: "HH:MM", end: "HH:MM" }');
        }
      }
    }
  }
  const dg = v.delegate;
  if (dg !== void 0) {
    if (dg === null || typeof dg !== "object" || Array.isArray(dg)) throw new Error("delegate \u5FC5\u987B\u662F\u5BF9\u8C61");
    const ddg = dg;
    if (ddg.model !== void 0 && typeof ddg.model !== "string") throw new Error("delegate.model \u5FC5\u987B\u662F\u5B57\u7B26\u4E32");
  }
}
function mergeConfigLayer(patch, user) {
  if (user === void 0 || user === null || typeof user !== "object") return patch;
  const base = typeof patch === "object" && patch !== null ? { ...patch } : {};
  for (const [key, value] of Object.entries(user)) {
    if (key === "dream" || key === "delegate") {
      const pv = base[key] ?? {};
      const uv = typeof value === "object" && value !== null ? value : {};
      base[key] = { ...pv, ...uv };
    } else {
      base[key] = value;
    }
  }
  return base;
}
function resolveConfig(config) {
  const c = config ?? {};
  const d = c.dream ?? {};
  const dg = c.delegate ?? {};
  return {
    enabled: c.enabled ?? true,
    projectDir: c.projectDir ?? ".dsh-meow",
    hitTopK: c.hitTopK ?? 2,
    titleMax: c.titleMax ?? 40,
    reflect: c.reflect ?? true,
    reflectTurns: c.reflectTurns ?? 7,
    autoMigrate: c.autoMigrate ?? true,
    promptLang: typeof c.promptLang === "string" && c.promptLang.trim() ? c.promptLang.trim() : void 0,
    dream: {
      enabled: d.enabled ?? true,
      idleMinutes: d.idleMinutes ?? 180,
      suppressWindows: d.suppressWindows ?? [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }],
      suppressLeadMinutes: d.suppressLeadMinutes ?? 15,
      checkMinutes: d.checkMinutes ?? 15,
      timeZone: d.timeZone ?? "Asia/Shanghai",
      rulesReviewDays: d.rulesReviewDays ?? DEFAULT_RULES_REVIEW_DAYS
    },
    delegate: (() => {
      return { modelSpec: parseModelSpec(dg.model) };
    })()
  };
}
function workspaceOfAgent(agent) {
  const cwd = agent?.session?.header?.cwd;
  return typeof cwd === "string" && cwd.length > 0 ? cwd : null;
}
function sessionIdOfAgent(agent) {
  const id = agent?.session?.header?.id;
  return typeof id === "string" && id.length > 0 ? id : "unknown";
}
function sessionEventsOf(session) {
  if (typeof session?.ownEvents === "function") {
    const evs2 = session.ownEvents();
    return Array.isArray(evs2) ? evs2 : [];
  }
  const evs = session?.events;
  return Array.isArray(evs) ? evs : [];
}
function wasDreamTurn(events) {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e?.type === "turn/start") break;
    if (e?.type === "user/message" && e.data?.source?.kind === "plugin" && e.data.source.plugin === "meow-memory") {
      if ((e.data.content ?? []).some((b) => b.type === "text" && b.text?.includes(DREAM_MARKER))) return true;
    }
  }
  return false;
}
function isMemoryTaskTurn(events) {
  let startIdx = -1;
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i]?.type === "turn/start") {
      startIdx = i;
      break;
    }
  }
  if (startIdx < 0) return false;
  for (let i = startIdx; i < events.length; i++) {
    const e = events[i];
    if (e?.type !== "user/message") continue;
    if (e.data?.source?.kind === "user") continue;
    const text = (e.data?.content ?? []).filter((b) => b.type === "text" && typeof b.text === "string").map((b) => b.text ?? "").join(" ");
    if (text.includes(REFLECT_MARKER) || text.includes(DREAM_MARKER)) return true;
  }
  return false;
}
function lastTurnEndReason(events) {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e?.type === "turn/start") break;
    if (e?.type === "turn/end" && typeof e.data?.reason?.kind === "string") return e.data.reason.kind;
  }
  return null;
}
async function apply(ctx, config) {
  try {
    return await applyInner(ctx, config);
  } catch (e) {
    try {
      const errFile = join7(homedir3(), ".dsh-meow", "apply-error.log");
      mkdirSync4(dirname5(errFile), { recursive: true });
      appendFileSync2(errFile, `[${(/* @__PURE__ */ new Date()).toISOString()}] ${e instanceof Error ? e.stack ?? e.message : String(e)}
`);
    } catch {
    }
    throw e;
  }
}
function installSettingsSectionCompat(settingsCtx, ownerCtx, ns, schema, entry, hooks) {
  const sctx = settingsCtx;
  const settings = sctx.settings;
  if (typeof settings.installSection === "function") {
    settings.installSection(ownerCtx, ns, schema, entry, hooks);
    return;
  }
  const register = settings.register;
  if (typeof register !== "function") {
    throw new Error("settings service exposes neither installSection nor register");
  }
  const scope = register.call(settings, ns, schema, {
    base: entry,
    ...hooks.validate === void 0 ? {} : { validate: hooks.validate }
  });
  hooks.setSource(() => scope.get());
  sctx.effect(() => () => {
    const state = ownerCtx.fiber?.state;
    if (state === 4 || state === 5) return;
    hooks.setSource(() => entry);
    hooks.onChange();
  });
  hooks.onChange();
  scope.watch(() => {
    const state = ownerCtx.fiber?.state;
    if (state === 4 || state === 5) return;
    hooks.onChange();
  });
}
var SETTINGS_SOURCE_WAIT_MS = 250;
async function applyInner(ctx, config) {
  const settingsBase = mergeConfigLayer(CONFIG_DEFAULTS, config);
  let settingsGet;
  let markSourceReady;
  const sourceReady = new Promise((resolve3) => {
    markSourceReady = resolve3;
  });
  let sourceWaitArmed = false;
  try {
    ctx.inject(["settings"], (settingsCtx) => {
      installSettingsSectionCompat(settingsCtx, ctx, SETTINGS_NS, Schema2.dict(Schema2.any()), settingsBase, {
        validate: (value) => {
          validateConfigUserLayer(value);
        },
        setSource: (get) => {
          settingsGet = get;
          markSourceReady?.();
        },
        onChange: () => {
          ctx.logger.info("meow-memory: \u914D\u7F6E\u5DF2\u901A\u8FC7\u8BBE\u7F6E\u9875\u66F4\u65B0\uFF08\u91CD\u8F7D/\u91CD\u542F\u63D2\u4EF6\u540E\u751F\u6548\uFF09");
        }
      });
    });
    sourceWaitArmed = true;
  } catch (e) {
    const msg = `meow-memory: \u8BBE\u7F6E\u547D\u540D\u7A7A\u95F4\u6CE8\u518C\u5931\u8D25\uFF08\u6807\u7B7E\u9875\u4E0D\u53EF\u7528\uFF0C\u914D\u7F6E\u8D70 patch \u5C42\uFF09\uFF1A${e instanceof Error ? e.stack ?? e.message : String(e)}`;
    ctx.logger.warn(msg);
    try {
      appendFileSync2(join7(homedir3(), ".dsh-meow", "settings-register-error.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] ${msg}
`);
    } catch {
    }
  }
  if (sourceWaitArmed) {
    await Promise.race([
      sourceReady,
      new Promise((resolve3) => {
        setTimeout(resolve3, SETTINGS_SOURCE_WAIT_MS);
      })
    ]);
  }
  const merged = mergeConfigLayer(config, settingsGet?.());
  const resolved = resolveConfig(merged);
  ctx.logger.info(`meow-memory: config resolved (sourceReady=${settingsGet !== void 0}, enabled=${resolved.enabled}, dream.enabled=${resolved.dream?.enabled ?? "default"}, promptLang=${resolved.promptLang ?? "zh"}, projectDir=${resolved.projectDir ?? ".dsh-meow"})`);
  if (!resolved.enabled) {
    ctx.logger.info("meow-memory: disabled by config");
    return;
  }
  setPromptLang(resolved.promptLang ?? "zh");
  applyCount++;
  perf(`apply #${applyCount} pid=${process.pid}`);
  loadWindowIndex(resolved.projectDir);
  void ensureV0SessionsMigrated(resolved.projectDir, (m) => ctx.logger.info(m)).catch((e) => {
    ctx.logger.warn(`meow-memory: migrate-v0 failed (non-fatal): ${e instanceof Error ? e.message : String(e)}`);
  });
  perf(`window-index restored ${windowIndex.size} windows`);
  const toolDisposers = [];
  registerMemoryTools((t) => {
    const dispose = ctx.tools.register(t);
    if (typeof dispose === "function") toolDisposers.push(dispose);
  }, resolved.projectDir);
  const broadcast = new DreamStateBroadcast(ctx.logger);
  const signalDreamState = (sessionId, state) => broadcast.broadcast(sessionId, state);
  const disposeDreamTool = ctx.tools.register(dreamTool(ctx, resolved.projectDir, signalDreamState, resolved.dream.rulesReviewDays));
  if (typeof disposeDreamTool === "function") toolDisposers.push(disposeDreamTool);
  ctx.logger.info("meow-memory: memory_remember/search/read/update + memory_dream registered");
  let guideRegistered = false;
  let guideTimer = 0;
  const tryRegisterGuideSection = (attempt) => {
    if (guideRegistered) return;
    const svc = ctx.get?.("systemPrompt");
    if (svc === void 0 || typeof svc.section !== "function") {
      if (attempt < 20) {
        guideTimer = setTimeout(() => tryRegisterGuideSection(attempt + 1), 1e3);
      } else {
        ctx.logger.warn("meow-memory: systemPrompt \u670D\u52A1 20s \u5185\u672A\u5C31\u7EEA\uFF0C\u8BB0\u5FC6\u624B\u518C\u672A\u6302\u8FDB system prompt\uFF08memory_* \u5DE5\u5177\u4E0D\u53D7\u5F71\u54CD\uFF09");
      }
      return;
    }
    try {
      const dispose = svc.section({ name: "meow-memory:guide", order: 130, text: getMemoryGuide() });
      guideRegistered = true;
      if (typeof dispose === "function") toolDisposers.push(dispose);
      ctx.logger.info("meow-memory: guide section registered into system prompt");
    } catch (e) {
      ctx.logger.warn(`meow-memory: guide section \u6CE8\u518C\u5931\u8D25\uFF08\u8BB0\u5FC6\u624B\u518C\u7F3A\u5931\uFF0C\u4E0D\u5F71\u54CD\u5176\u4F59\u529F\u80FD\uFF09: ${e instanceof Error ? e.message : String(e)}`);
      guideRegistered = true;
    }
  };
  tryRegisterGuideSection(0);
  toolDisposers.push(() => clearTimeout(guideTimer));
  const lastWindowWrite = /* @__PURE__ */ new Map();
  const isPluginTurn = /* @__PURE__ */ new Map();
  ctx.on("session/event", (session, event) => {
    perfEvent();
    noteActivity();
    const t = event?.type;
    const sid = session?.id;
    const cwd = session?.header?.cwd;
    if (t === "compaction/summary" || t === "compaction/start") {
      if (typeof sid === "string" && typeof cwd === "string") {
        releaseSeen(cwd, sid, resolved.projectDir);
        ctx.logger.info(`meow-memory: compaction signal, released seen memory for session ${shortSessionId(sid)}`);
      }
      return;
    }
    if (t === "compaction/end") {
      const err = event.data?.error;
      if ((err === void 0 || err === null || err === "") && typeof sid === "string" && typeof cwd === "string") {
        markReinjectPending(cwd, sid, resolved.projectDir);
        ctx.logger.info(`meow-memory: compaction finished, memory re-injection armed for session ${shortSessionId(sid)}`);
      }
      return;
    }
    if (typeof sid === "string") {
      if (t === "turn/start") {
        isPluginTurn.set(sid, false);
        return;
      }
      if (t === "user/message") {
        const data = event.data;
        const src = data?.source;
        if (src?.kind !== "user") {
          const msgText = (data?.content ?? []).filter((b) => b.type === "text" && typeof b.text === "string").map((b) => b.text ?? "").join(" ");
          if (msgText.includes(REFLECT_MARKER) || msgText.includes(DREAM_MARKER) || msgText.includes(REFLECT_DELEGATE_MARKER) || msgText.includes(DREAM_DELEGATE_MARKER) || msgText.includes(REFLECT_DONE_DELEGATE_MARKER)) {
            isPluginTurn.set(sid, true);
            return;
          }
        }
      }
      if (isPluginTurn.get(sid)) return;
    }
    if (t !== "user/message" && t !== "turn/end" && t !== "assistant/message" && t !== "tool/result") return;
    if (session?.header?.origin === "subagent") return;
    if (typeof sid !== "string" || typeof cwd !== "string" || typeof event?.time !== "number") return;
    const now = Date.now();
    const last = lastWindowWrite.get(sid) ?? 0;
    if (now - last < 5e3) return;
    lastWindowWrite.set(sid, now);
    const db = getDb(cwd, resolved.projectDir);
    db.touchWindow(sid, cwd, event.time);
    const win = db.getWindow(sid);
    if (win !== void 0 && win.last_dream_time !== null) broadcast.broadcast(sid, "active");
    windowIndex.set(sid, cwd);
    persistWindowIndex();
  });
  const firstUserHandled = /* @__PURE__ */ new Set();
  ctx.on("agent/pre-step", async ({ agent, messages, signal }, next) => {
    const decision = await next();
    try {
      return await preStepInject({ agent, signal }, decision);
    } catch (e) {
      try {
        ctx.logger.warn(`meow-memory: pre-step \u6CE8\u5165\u5931\u8D25\uFF08fail-open \u653E\u884C\u539F\u59CB\u6D88\u606F\uFF09: ${e instanceof Error ? e.message : String(e)}`);
      } catch {
      }
      return decision;
    }
  });
  const preStepInject = async ({ agent, signal }, decision) => {
    const t0 = Date.now();
    if (decision === void 0 || decision.kind !== "enter" || signal.aborted) return decision;
    if (decision.messages.length === 0) return decision;
    if (agent.session.header.origin === "subagent") return decision;
    registerLiveAgent(agent);
    const sid = sessionIdOfAgent(agent);
    const ws = workspaceOfAgent(agent);
    const userMsgs = decision.messages.filter((m) => m.source?.kind === "user");
    if (userMsgs.length === 0) return decision;
    if (ws && isReinjectPending(ws, sid, resolved.projectDir)) {
      const lastUser = userMsgs[userMsgs.length - 1];
      const db = getDb(ws, resolved.projectDir);
      const reinj = buildReinjection(db, ws, sid, readProjectQueried(ws, sid, resolved.projectDir), {
        hitTopK: resolved.hitTopK,
        titleMax: resolved.titleMax
      }, resolved.projectDir);
      clearReinjectPending(ws, sid, resolved.projectDir);
      if (reinj !== null) {
        const rewritten = [...decision.messages];
        rewritten.splice(rewritten.indexOf(lastUser), 0, createMemorySnapshotMessage(reinj.text, { kind: "reinjection", ids: reinj.injectedIds }));
        ctx.logger.info(`meow-memory: post-compaction memory re-injected (${reinj.text.length} chars)`);
        return { ...decision, messages: rewritten };
      }
      return decision;
    }
    if (!firstUserHandled.has(sid)) {
      firstUserHandled.add(sid);
      let priorUser = 0;
      for (const e of sessionEventsOf(agent.session)) {
        const evt = e;
        if (evt?.type === "user/message" && evt.data?.source?.kind === "user") priorUser++;
      }
      if (ws) {
        try {
          appendFileSync2(join7(ws, resolved.projectDir, "dream-debug.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] pre-step first pid=${process.pid} sid=${shortSessionId(sid)} priorUser=${priorUser} userMsgs=${userMsgs.length}
`);
        } catch {
        }
      }
      if (priorUser === 0) {
        if (ws) {
          const firstUser = userMsgs[0];
          const db = getDb(ws, resolved.projectDir);
          if (resolved.autoMigrate && existsSync5(join7(ws, resolved.projectDir, "PROJECT.md"))) {
            const n = migrateLegacy(db, ws, resolved.projectDir);
            if (n !== null) ctx.logger.info(`meow-memory: migrated legacy PROJECT.md \u2192 SQLite (${n} entries)`);
          }
          const firstText = firstUser.content.filter((b) => b.type === "text" && typeof b.text === "string").map((b) => b.text ?? "").join(" ");
          const injected = buildInjection(db, ws, sid, firstText, {
            hitTopK: resolved.hitTopK,
            titleMax: resolved.titleMax
          }, resolved.projectDir);
          if (injected) {
            const rewritten = [...decision.messages];
            rewritten.splice(rewritten.indexOf(firstUser), 0, createMemorySnapshotMessage(injected.text, { kind: "initial", ids: injected.injectedIds }));
            ctx.logger.info(`meow-memory: inserted memory snapshot (${injected.text.length} chars) before first user message`);
            return { ...decision, messages: rewritten };
          }
        }
        return decision;
      }
    }
    if (resolved.promptLang === void 0 && ws) {
      const seen = readSeen(ws, sid, resolved.projectDir);
      if (!seen.has(WELCOME_GUIDE_SEEN_ID)) {
        const lastUser = [...decision.messages].reverse().find((m) => m.source?.kind === "user");
        if (lastUser !== void 0) {
          markAccessed(ws, sid, [WELCOME_GUIDE_SEEN_ID], resolved.projectDir);
          const guide = resolveSlotText("welcome-guide", { homePath: homedir3() });
          const rewritten = [...decision.messages];
          rewritten.splice(rewritten.indexOf(lastUser), 0, createMemoryNoticeMessage(guide));
          ctx.logger.info("meow-memory: first-run lang guide injected as independent notice (promptLang unset)");
          return { ...decision, messages: rewritten };
        }
      }
    }
    if (ws) {
      const lastUser = [...decision.messages].reverse().find((m) => m.source?.kind === "user");
      if (lastUser !== void 0) {
        const text = lastUser.content.filter((b) => b.type === "text" && typeof b.text === "string").map((b) => b.text ?? "").join(" ");
        const db = getDb(ws, resolved.projectDir);
        const hit = buildHitInjection(db, ws, sid, text, {
          hitTopK: resolved.hitTopK,
          titleMax: resolved.titleMax
        }, resolved.projectDir);
        try {
          appendFileSync2(join7(ws, resolved.projectDir, "dream-debug.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] hit-chain pid=${process.pid} sid=${shortSessionId(sid)} textLen=${text.length} hit=${hit === null ? "null" : "yes"}
`);
        } catch {
        }
        if (hit !== null) {
          const rewritten = [...decision.messages];
          rewritten.splice(rewritten.indexOf(lastUser), 0, createMemorySnapshotMessage(hit.text, { kind: "hit", ids: hit.injectedIds }));
          return { ...decision, messages: rewritten };
        }
      }
      if (Date.now() - t0 > 10) perf(`pre-step hit ${Date.now() - t0}ms sid=${shortSessionId(sid)}`);
    }
    return decision;
  };
  const reflectQueuedTurn = /* @__PURE__ */ new Map();
  const MAX_REFLECT_TRACKED = 512;
  ctx.on("agent/turn-stopping", ({ agent, turn }) => {
    try {
      turnStoppingCore(agent, turn);
    } catch (e) {
      try {
        ctx.logger.warn(`meow-memory: turn-stopping \u5904\u7406\u5931\u8D25\uFF08\u5DF2\u5FFD\u7565\uFF09: ${e instanceof Error ? e.message : String(e)}`);
      } catch {
      }
    }
  });
  const turnStoppingCore = (agent, turn) => {
    const t0 = Date.now();
    if (agent.session.header.origin === "subagent") return;
    registerLiveAgent(agent);
    const endReason = lastTurnEndReason(sessionEventsOf(agent.session));
    const dreamTurn = wasDreamTurn(sessionEventsOf(agent.session));
    const wsTs = workspaceOfAgent(agent);
    const sidTs = sessionIdOfAgent(agent);
    if (wsTs) {
      try {
        appendFileSync2(join7(wsTs, resolved.projectDir, "dream-debug.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] turn-stopping pid=${process.pid} sid=${shortSessionId(sidTs)} reason=${endReason ?? "none"} wasDream=${dreamTurn}
`);
      } catch {
      }
    }
    if (endReason === "aborted" || endReason === "interrupted") {
      if (dreamTurn) abortDream(agent, resolved.projectDir, signalDreamState);
      return;
    }
    if (dreamTurn) {
      if (endReason === "error") {
        try {
          if (wsTs && sidTs) getDb(wsTs, resolved.projectDir).releaseDream(sidTs);
        } catch {
        }
        return;
      }
      advanceDream(agent, resolved.projectDir, signalDreamState, resolved.dream.rulesReviewDays);
      return;
    }
    if (!resolved.reflect) return;
    const ws = workspaceOfAgent(agent);
    if (!ws) return;
    const { sawToolCall, lastToolName, sawReflect, turnText } = scanTurn(sessionEventsOf(agent.session));
    if (sawReflect) {
      reflectQueuedTurn.delete(sidTs);
      return;
    }
    if (turn !== void 0 && reflectQueuedTurn.get(sidTs) === turn) return;
    if (!sawToolCall) return;
    if (lastToolName !== void 0 && lastToolName.startsWith("memory_")) return;
    if (consecutiveToolSteps(sessionEventsOf(agent.session)) < resolved.reflectTurns) return;
    const message = buildReflectMessage(ws, turnText, resolved.projectDir);
    if (sendMemoryTurn(agent, message, ws, resolved.projectDir, `reflect sid=${shortSessionId(sidTs)}`)) {
      if (turn !== void 0) {
        reflectQueuedTurn.set(sidTs, turn);
        while (reflectQueuedTurn.size > MAX_REFLECT_TRACKED) {
          const oldest = reflectQueuedTurn.keys().next().value;
          if (oldest === void 0) break;
          reflectQueuedTurn.delete(oldest);
        }
      }
      ctx.logger.info(`meow-memory: reflect sent as standalone turn after ${resolved.reflectTurns}+ tool turns`);
    } else {
      ctx.logger.warn("meow-memory: reflect \u53D1\u9001\u5931\u8D25\uFF08\u672C\u8F6E\u4E0D\u53CD\u601D\uFF0C\u4E0B\u8F6E\u91CD\u8BD5\uFF09");
    }
    if (Date.now() - t0 > 20) perf(`turn-stopping slow ${Date.now() - t0}ms`);
  };
  if (resolved.delegate.modelSpec !== void 0) {
    const spec = resolved.delegate.modelSpec;
    ctx.on("agent/request", async (payload, next) => {
      const config2 = await next();
      const agent = payload?.agent;
      if (agent === void 0 || agent.session?.header?.origin === "subagent") return config2;
      if (!isMemoryTaskTurn(sessionEventsOf(agent.session))) return config2;
      ctx.logger.info(`meow-memory: memory task turn \u2192 model override ${spec.provider ?? "(inherit)"}/${spec.model ?? ""}`);
      return {
        ...config2,
        ...spec.provider !== void 0 ? { provider: spec.provider } : {},
        ...spec.model !== void 0 ? { model: spec.model } : {}
      };
    });
    ctx.logger.info(`meow-memory: model override armed for reflect/dream turns (${spec.provider ?? "(inherit)"}/${spec.model ?? ""})`);
  }
  const stopDream = scheduleDream(ctx, resolved.dream, resolved.projectDir, windowIndex, signalDreamState);
  ctx.logger.info(
    `meow-memory: dream scheduled (idle ${resolved.dream.idleMinutes}m, suppress ${resolved.dream.suppressWindows.map((w) => `${w.start}-${w.end}`).join(" ")} lead ${resolved.dream.suppressLeadMinutes}m, every ${resolved.dream.checkMinutes}m, tz ${resolved.dream.timeZone}, rules review ${resolved.dream.rulesReviewDays}d)`
  );
  const routeDisposers = [];
  let routeTimer = 0;
  const tryRegisterDreamRoutes = (attempt) => {
    const ws = ctx.get?.("webServer");
    if (ws !== void 0 && typeof ws.register === "function") {
      const registerOne = (route) => {
        try {
          routeDisposers.push(ctx.effect(() => ws.register(route)));
        } catch (e) {
          ctx.logger.warn(`meow-memory: route ${route.path} \u6CE8\u518C\u5931\u8D25: ${e instanceof Error ? e.message : String(e)}`);
        }
      };
      registerOne({
        kind: "exact",
        path: "/meow-memory/dreamed-sessions",
        handler: (_req, res) => {
          void (async () => {
            try {
              const sessionPersistence = ctx.get?.("sessionPersistence");
              const sessions = typeof sessionPersistence?.list === "function" ? await sessionPersistence.list() : [];
              const states = collectDreamStates(sessions, resolved.projectDir);
              writeJson(res, 200, { sessionIds: states.dreamed, dreamingIds: states.dreaming });
            } catch (e) {
              writeJson(res, 500, { ok: false, error: e instanceof Error ? e.message : String(e) });
            }
          })();
        }
      });
      registerOne({
        kind: "exact",
        path: "/meow-memory/dream-events",
        handler: (req, res) => broadcast.handle(req, res)
      });
      registerOne({
        kind: "exact",
        path: "/meow-memory/skip-dreams",
        handler: (req, res) => {
          void (async () => {
            try {
              if (req.method === "POST") {
                const body = await readJsonBody(req);
                const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
                const skip = body.skip === true;
                if (sessionId.length === 0) return writeJson(res, 400, { ok: false, error: "sessionId required" });
                const ws2 = await resolveWorkspaceForSession(ctx, sessionId);
                if (ws2 === null) return writeJson(res, 404, { ok: false, error: "unknown session (no workspace)" });
                getDb(ws2, resolved.projectDir).setDreamSkip(sessionId, skip);
                broadcast.broadcast(sessionId, skip ? "skip" : "unskip");
                ctx.logger.info(`meow-memory: dream skip ${skip ? "on" : "off"} for ${shortSessionId(sessionId)}`);
                return writeJson(res, 200, { ok: true, skipped: skip });
              }
              const workspaces = /* @__PURE__ */ new Set();
              for (const [, w] of windowIndex) {
                if (typeof w === "string" && w.length > 0) workspaces.add(w);
              }
              const ids = /* @__PURE__ */ new Set();
              for (const w of workspaces) {
                if (!existsSync5(memoryDbPath(w, resolved.projectDir))) continue;
                try {
                  for (const id of getDb(w, resolved.projectDir).listDreamSkips()) ids.add(id);
                } catch {
                }
              }
              writeJson(res, 200, { sessionIds: [...ids] });
            } catch (e) {
              writeJson(res, 500, { ok: false, error: e instanceof Error ? e.message : String(e) });
            }
          })();
        }
      });
      ctx.logger.info("meow-memory: dreamed-sessions snapshot + dream-events SSE + skip-dreams routes registered");
      return;
    }
    if (attempt < 20) {
      routeTimer = setTimeout(() => tryRegisterDreamRoutes(attempt + 1), 1e3);
    } else {
      ctx.logger.warn("meow-memory: webServer \u670D\u52A1 20s \u5185\u672A\u5C31\u7EEA\uFF0C\u4F1A\u8BDD\u5217\u8868 dream \u56FE\u6807\u6570\u636E\u8DEF\u7531\u672A\u6CE8\u518C");
    }
  };
  tryRegisterDreamRoutes(0);
  const commandDisposers = [];
  let commandTimer = 0;
  const tryRegisterDreamCommand = (attempt) => {
    const commands = ctx.get?.("commands");
    if (commands !== void 0 && typeof commands.register === "function") {
      try {
        commandDisposers.push(ctx.effect(() => commands.register(dreamCommandDefinition(ctx, resolved.projectDir, signalDreamState, resolved.dream.rulesReviewDays))));
        ctx.logger.info("meow-memory: /dream user command registered");
      } catch (e) {
        ctx.logger.warn(`meow-memory: /dream \u547D\u4EE4\u6CE8\u518C\u5931\u8D25: ${e instanceof Error ? e.message : String(e)}`);
      }
      return;
    }
    if (attempt < 20) {
      commandTimer = setTimeout(() => tryRegisterDreamCommand(attempt + 1), 1e3);
    } else {
      ctx.logger.warn("meow-memory: commands \u670D\u52A1 20s \u5185\u672A\u5C31\u7EEA\uFF0C/dream \u7528\u6237\u547D\u4EE4\u672A\u6CE8\u518C\uFF08memory_dream \u5DE5\u5177\u4E0D\u53D7\u5F71\u54CD\uFF09");
    }
  };
  tryRegisterDreamCommand(0);
  ctx.on("dispose", () => {
    for (const dispose of toolDisposers) {
      try {
        dispose();
      } catch {
      }
    }
    for (const dispose of routeDisposers) {
      try {
        dispose();
      } catch {
      }
    }
    for (const dispose of commandDisposers) {
      try {
        dispose();
      } catch {
      }
    }
    clearTimeout(routeTimer);
    clearTimeout(commandTimer);
    stopDream();
    disposeDreamHeartbeats();
    broadcast.dispose();
    try {
      closeAllDbs();
    } catch {
    }
  });
}
function writeJson(res, status, body) {
  try {
    const r = res;
    r.writeHead?.(status, { "content-type": "application/json" });
    r.end?.(JSON.stringify(body));
  } catch {
  }
}
function readJsonBody(req, maxBytes = 65536) {
  return new Promise((resolve3, reject) => {
    const r = req;
    const chunks = [];
    let size = 0;
    r.on?.("data", (chunk) => {
      const buf = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
      size += buf.length;
      if (size > maxBytes) {
        reject(new Error("request body too large"));
        return;
      }
      chunks.push(buf);
    });
    r.on?.("end", () => {
      if (chunks.length === 0) {
        resolve3({});
        return;
      }
      try {
        resolve3(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    });
    r.on?.("error", (e) => reject(e instanceof Error ? e : new Error(String(e))));
  });
}
async function resolveWorkspaceForSession(ctx, sessionId) {
  const direct = windowIndex.get(sessionId);
  if (typeof direct === "string" && direct.length > 0) return direct;
  try {
    const sp = ctx.get?.("sessionPersistence");
    const sessions = typeof sp?.list === "function" ? await sp.list() : [];
    const hit = sessions.map(headerOf).find((h) => h.id === sessionId);
    if (hit && typeof hit.cwd === "string" && hit.cwd.length > 0) {
      windowIndex.set(sessionId, hit.cwd);
      persistWindowIndex();
      return hit.cwd;
    }
  } catch {
  }
  return null;
}
var windowIndex = /* @__PURE__ */ new Map();
var WINDOW_INDEX_FILE = join7(homedir3(), ".dsh-meow", "window-index.json");
function loadWindowIndex(dir = ".dsh-meow", indexFile = WINDOW_INDEX_FILE) {
  const workspaces = /* @__PURE__ */ new Set();
  try {
    const merged = JSON.parse(readFileSync5(indexFile, "utf8"));
    for (const [sid, ws] of Object.entries(merged)) {
      if (typeof ws === "string" && ws.length > 0) {
        windowIndex.set(sid, ws);
        workspaces.add(ws);
      }
    }
  } catch {
  }
  for (const ws of workspaces) {
    if (!existsSync5(ws) || !existsSync5(memoryDbPath(ws, dir))) continue;
    try {
      for (const w of getDb(ws, dir).listWindows()) {
        if (typeof w.workspace === "string" && w.workspace.length > 0) windowIndex.set(w.session_id, w.workspace);
      }
    } catch {
    }
  }
}
function persistWindowIndex() {
  try {
    mkdirSync4(dirname5(WINDOW_INDEX_FILE), { recursive: true });
    let merged = {};
    try {
      merged = JSON.parse(readFileSync5(WINDOW_INDEX_FILE, "utf8"));
    } catch {
    }
    for (const [sid, ws] of windowIndex) merged[sid] = ws;
    writeFileSync3(WINDOW_INDEX_FILE, JSON.stringify(merged), "utf8");
  } catch {
  }
}
export {
  CONFIG_DEFAULTS,
  Config,
  DEFAULT_LANG,
  DREAM_DELEGATE_MARKER,
  DREAM_MARKER,
  GLOBAL_PROJECT_CANON,
  GLOBAL_PROJECT_CANON_EN,
  LEVELS,
  MAX_REINJECT_PROJECTS,
  MAX_REINJECT_WRITTEN,
  MemoryDb,
  PLUGIN_SOURCE2 as PLUGIN_SOURCE,
  PROJECT_SUBCATEGORIES,
  REFLECT_DELEGATE_MARKER,
  REFLECT_DONE_DELEGATE_MARKER,
  REFLECT_MARKER,
  SETTINGS_NS,
  SLOTS,
  abortDream,
  advanceDream,
  apply,
  buildDreamMessage,
  buildHitInjection,
  buildInjection,
  buildProjectSectionText,
  buildReflectMessage,
  buildReinjection,
  clearReinjectPending,
  closeAllDbs,
  collectDreamRounds,
  collectDreamStates,
  consecutiveToolSteps,
  dreamCommandDefinition,
  dreamSweepOnce,
  factoryDefaultOf,
  fillTemplate,
  findSimilar,
  getCurrentProject,
  getDb,
  getMemoryGuide,
  getPromptLang,
  globalProjectMarker,
  headerOf,
  hourInTimeZone,
  inject,
  isDreamSuppressed,
  isGlobalProject,
  isGlobalScope,
  isMemoryTaskTurn,
  isReinjectPending,
  isSubagentAgent,
  keyedValue,
  loadWindowIndex,
  markAccessed,
  markInjected,
  markProjectQueried,
  markReinjectPending,
  markSearched,
  markWritten,
  memoryDbPath,
  mergeConfigLayer,
  migrateLegacy,
  minutesInTimeZone,
  name,
  newId,
  noteActivity,
  parseModelSpec,
  projectCovers,
  projectLabel,
  projectList,
  readInjected,
  readProjectQueried,
  readSeen,
  readWritten,
  recencyWeight,
  recoverInterruptedDream,
  relativeTime,
  releaseSeen,
  resolveSlotText,
  resumeAndDream,
  scanTurn,
  search,
  sessionEventsOf,
  sessionsFile,
  setCurrentProject,
  setPromptLang,
  startWindowDream,
  stemEn,
  tokenize,
  topicDrift,
  validateConfigUserLayer,
  windowNeedsDream
};
//# sourceMappingURL=index.js.map
