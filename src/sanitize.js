/*
 * src/main-process/user/sanitize.js
 */

const latinize = require('latinize');

/**
 * Sanitizes the User ID by removing non-ascii, non-period characters
 * @param {String} name
 * @return {String}
 */
module.exports = function(name) {
    // For some reason eslint always flags regex.
    /* eslint-disable-next-line no-useless-escape */
    const badChars = /[^a-zA-Z0-9\.]/g;
    /* eslint-disable-next-line no-useless-escape */
    const suffix = /\.+$/;
    name = latinize(name);
    name = name.replace(badChars, '.');
    name = name.replace(suffix, '');
    return name;
};
