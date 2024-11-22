export const validateExpression = (string) => {
  let expression = string.trim().replace(/\s+/g, ' ');

  const pattern = /\(\d\)|\d (?:AND|OR) \d|\d/g;

  while (true) {
    const replaced = expression.replace(pattern, "1");

    // if the expression has been reduced to "1", it's valid
    if (replaced === "1") return true;

    // if the pattern didn't match, it's invalid
    if (replaced === expression) return false;

    // otherwise, continue replacing
    expression = replaced;
  }
}

export const evaluateBooleanExpression = (expression, scope) => {
  // Replace logical operators for JavaScript compatibility
  const sanitizedExpression = expression
    .replace(/\b\d+\b/g, match => {
      const tokenValue = scope[parseInt(match, 10)] ?? true;
      return typeof tokenValue !== 'undefined' ? tokenValue : match;
    })
    .replace(/AND/g, '&&')
    .replace(/OR/g, '||');

  try {
    return eval(sanitizedExpression);
  } catch (error) {
    console.error('Error evaluating boolean expression:', error.message);
    return false;
  }
}
