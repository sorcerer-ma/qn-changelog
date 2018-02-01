'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function toString(changelogs) {
    let s = changelogs
        .map((c) => { return c.toString(); })
        .join('\n');
    return s ? s : 'no changelog';
}
function toMarkdown(changelogs) {
    let s = changelogs
        .map((c) => { return c.toMarkdown(); })
        .join('\n');
    return s ? s : 'no changelog';
}
exports.toMarkdown = toMarkdown;
function toHtml(changelogs) {
    let s = changelogs
        .map((c) => { return c.toHtml(); })
        .join('\n');
    return s ? `<ul>${s}</ul>` : 'no changelog';
}
exports.toHtml = toHtml;
