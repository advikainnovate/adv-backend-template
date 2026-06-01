/**
 * Template Renderer
 * Replaces variables in template strings with actual values
 */

/**
 * Render a template string by replacing variables
 * @param {string} template - Template string with {{variable}} placeholders
 * @param {object} variables - Object with variable values
 * @returns {string} - Rendered string
 */
const renderTemplate = (template, variables = {}) => {
    if (!template) return '';

    let rendered = template;

    // Replace all {{variableName}} with actual values
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        rendered = rendered.replace(regex, variables[key] || '');
    });

    return rendered;
};

/**
 * Validate that all required variables are provided
 * @param {array} requiredVariables - Array of required variable names
 * @param {object} providedVariables - Object with provided variable values
 * @returns {object} - { valid: boolean, missing: array }
 */
const validateVariables = (requiredVariables = [], providedVariables = {}) => {
    const missing = requiredVariables.filter(varName => {
        return !providedVariables.hasOwnProperty(varName) ||
            providedVariables[varName] === null ||
            providedVariables[varName] === undefined;
    });

    return {
        valid: missing.length === 0,
        missing,
    };
};

module.exports = {
    renderTemplate,
    validateVariables,
};
