// Utility: Robust pattern matcher
const matchesPattern = (pattern, key, fullPath) => {
  if (pattern === key || pattern === fullPath) return true;

  // Normalize: replace numeric segments (array indices) with '*'
  const normalizePath = (path) =>
    path
      .split('.')
      .map((segment) => (/^\d+$/.test(segment) ? '*' : segment))
      .join('.');

  const normalizedPattern = normalizePath(pattern);
  const normalizedPath = normalizePath(fullPath);

  // Exact normalized match
  if (normalizedPattern === normalizedPath) return true;

  // Wildcard support: *, **
  if (normalizedPattern.includes('*')) {
    const regexPattern = normalizedPattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '.*') // match any depth
      .replace(/\*/g, '[^.]+'); // match any single level

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(normalizedPath);
  }

  return false;
};

// Main: Remove empty values with robust pattern options
const removeEmptyValues = (
  input,
  options = {},
  path = '',
  currentDepth = 0
) => {
  const {
    skipKeys = [],
    deleteKeys = [],
    skipTypes = [],
    preserveEmptyArrays = false,
    preserveEmptyObjects = false,
    preserveZero = true,
    preserveFalse = true,
    customEmptyCheck = null,
    maxDepth = Infinity,
  } = options;

  if (currentDepth >= maxDepth) return input;

  const isSkippedType = skipTypes.some((type) =>
    typeof type === 'function' ? input instanceof type : typeof input === type
  );
  if (isSkippedType) return input;

  // Basic/Custom emptiness check
  if (typeof customEmptyCheck === 'function') {
    if (customEmptyCheck(input, path)) return undefined;
  } else {
    if (input === null || input === undefined) return undefined;
    if (typeof input === 'string' && input.trim() === '') return undefined;
    if (input === 0 && !preserveZero) return undefined;
    if (input === false && !preserveFalse) return undefined;
  }

  // Handle primitives and special cases
  if (typeof input !== 'object') return input;
  if (input instanceof Date)
    return Number.isNaN(input.getTime()) ? undefined : input;
  if (input instanceof RegExp) return input;

  // Handle arrays
  if (Array.isArray(input)) {
    const cleaned = input
      .map((item, index) =>
        removeEmptyValues(
          item,
          options,
          `${path ? `${path}.` : ''}${index}`,
          currentDepth + 1
        )
      )
      .filter((item) => item !== undefined);

    return cleaned.length > 0 ? cleaned : preserveEmptyArrays ? [] : undefined;
  }

  // Handle objects
  const cleanedObj = {};
  let hasValidProp = false;

  for (const [key, value] of Object.entries(input)) {
    const fullPath = path ? `${path}.${key}` : key;

    const shouldDelete = deleteKeys.some((pattern) =>
      matchesPattern(pattern, key, fullPath)
    );
    const shouldSkip = skipKeys.some((pattern) =>
      matchesPattern(pattern, key, fullPath)
    );

    if (shouldDelete) continue;

    if (shouldSkip) {
      cleanedObj[key] = value;
      hasValidProp = true;
      continue;
    }

    const cleaned = removeEmptyValues(
      value,
      options,
      fullPath,
      currentDepth + 1
    );

    if (cleaned !== undefined) {
      cleanedObj[key] = cleaned;
      hasValidProp = true;
    }
  }

  return hasValidProp ? cleanedObj : preserveEmptyObjects ? {} : undefined;
};

const pickFields = (obj, keys) => {
  const result = {};
  keys.forEach((key) => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result;
};

export { pickFields, removeEmptyValues };
