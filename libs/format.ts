'use strict'

import {
  Changelog
} from './changelog'

interface ChangelogsFormatter {
  (changelogs: Array<Changelog>): string
}

function toString(changelogs: Array<Changelog>): string {
  let s: string = changelogs
    .map((c) => { return c.toString() })
    .join('\n')
  return s ? s : 'no changelog'
}

function toMarkdown(changelogs: Array<Changelog>): string {
  let s: string = changelogs
    .map((c) => { return c.toMarkdown() })
    .join('\n')
  return s ? s : 'no changelog'
}

function toHtml(changelogs: Array<Changelog>): string {
  let s: string = changelogs
    .map((c) => { return c.toHtml() })
    .join('\n')
  return s ? `<ul>${s}</ul>` : 'no changelog'
}

export {
  ChangelogsFormatter,
  toMarkdown,
  toHtml
}
