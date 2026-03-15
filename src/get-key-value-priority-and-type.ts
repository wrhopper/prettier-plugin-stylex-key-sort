import {
  PSEUDO_CLASS_PRIORITIES,
  AT_RULE_PRIORITIES,
  PSEUDO_ELEMENT_PRIORITY,
} from '@stylexjs/shared';

type PriorityAndType = {
  priority: number;
  type: 'string' | 'pseudoClass' | 'pseudoElement' | 'atRule' | 'wellKnown';
};

/**
 * Matches the official StyleX `getPriority()` from
 * `@stylexjs/babel-plugin/src/shared/utils/property-priorities.js`.
 *
 * Priority buckets (lower = sorted first):
 *   1000 — shorthand-of-shorthands (animation, background, border, font, grid, margin, padding, …)
 *   2000 — shorthand-of-longhands  (flex, gap, overflow, border-radius, columns, transition, …)
 *   3000 — longhand logical         (display, align-items, color, font-size, …)
 *   4000 — longhand physical         (height, width, top, margin-top, padding-left, …)
 *
 * Within the same bucket the ESLint rule compares alphabetically by camelCase key,
 * so we return the bucket as the numeric priority and let the caller do the
 * alphabetical tiebreak (which `compareProperties` in index.ts already does).
 */
export default function getKeyValuePriorityAndType(
  keyValue: string,
): PriorityAndType {
  if (keyValue.startsWith('@supports')) {
    return { priority: 1000 + AT_RULE_PRIORITIES['@supports'], type: 'atRule' };
  }

  if (keyValue.startsWith('::')) {
    return { priority: 2000 + PSEUDO_ELEMENT_PRIORITY, type: 'pseudoElement' };
  }

  if (keyValue.startsWith(':')) {
    const prop =
      keyValue.startsWith(':') && keyValue.includes('(')
        ? keyValue.slice(0, keyValue.indexOf('('))
        : keyValue;

    return {
      priority:
        3000 +
        (PSEUDO_CLASS_PRIORITIES[
          prop as keyof typeof PSEUDO_CLASS_PRIORITIES
        ] ?? 40),
      type: 'pseudoClass',
    };
  }

  if (keyValue.startsWith('@media')) {
    return { priority: 4000 + AT_RULE_PRIORITIES['@media'], type: 'atRule' };
  }

  if (keyValue.startsWith('@container')) {
    return {
      priority: 5000 + AT_RULE_PRIORITIES['@container'],
      type: 'atRule',
    };
  }

  // Convert camelCase key to kebab-case for the priority lookup
  const kebab = keyValue.replace(/[A-Z]/g, '-$&').toLowerCase();

  if (shorthandsOfShorthands.has(kebab)) {
    return { priority: 1000, type: 'wellKnown' };
  }
  if (shorthandsOfLonghands.has(kebab)) {
    return { priority: 2000, type: 'wellKnown' };
  }
  if (longHandPhysical.has(kebab)) {
    return { priority: 4000, type: 'wellKnown' };
  }
  // longHandLogical or unknown → 3000
  return { priority: 3000, type: 'wellKnown' };
}

// ---------------------------------------------------------------------------
// Property sets copied from the official StyleX property-priorities.js
// https://github.com/facebook/stylex/blob/main/packages/%40stylexjs/babel-plugin/src/shared/utils/property-priorities.js
// ---------------------------------------------------------------------------

const shorthandsOfShorthands = new Set([
  'all',
  'animation',
  'background',
  'border',
  'border-block',
  'border-inline',
  'font',
  'grid',
  'grid-area',
  'grid-template',
  'inset',
  'margin',
  'padding',
  'scroll-margin',
  'scroll-padding',
]);

const shorthandsOfLonghands = new Set([
  'animation-range',
  'background-position',
  'border-block-end',
  'border-block-start',
  'border-bottom',
  'border-color',
  'border-image',
  'border-inline-color',
  'border-inline-end',
  'border-inline-start',
  'border-inline-style',
  'border-inline-width',
  'border-left',
  'border-radius',
  'border-right',
  'border-style',
  'border-top',
  'border-width',
  'caret',
  'column-rule',
  'columns',
  'contain-intrinsic-size',
  'container',
  'flex',
  'flex-flow',
  'font-variant',
  'gap',
  'grid-column',
  'grid-gap',
  'grid-row',
  'grid-template-areas',
  'inset-block',
  'inset-inline',
  'list-style',
  'margin-block',
  'margin-inline',
  'mask',
  'mask-border',
  'offset',
  'outline',
  'overflow',
  'overscroll-behavior',
  'padding-block',
  'padding-inline',
  'place-content',
  'place-items',
  'place-self',
  'scroll-margin-block',
  'scroll-margin-inline',
  'scroll-padding-block',
  'scroll-padding-inline',
  'scroll-snap-type',
  'scroll-timeline',
  'text-decoration',
  'text-emphasis',
  'transition',
  'view-timeline',
]);

const longHandPhysical = new Set([
  'border-bottom-color',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-bottom-style',
  'border-bottom-width',
  'border-left-color',
  'border-left-style',
  'border-left-width',
  'border-right-color',
  'border-right-style',
  'border-right-width',
  'border-top-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-top-style',
  'border-top-width',
  'bottom',
  'height',
  'left',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'overflow-x',
  'overflow-y',
  'overscroll-behavior-x',
  'overscroll-behavior-y',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'right',
  'scroll-margin-bottom',
  'scroll-margin-left',
  'scroll-margin-right',
  'scroll-margin-top',
  'scroll-padding-bottom',
  'scroll-padding-left',
  'scroll-padding-right',
  'scroll-padding-top',
  'top',
  'width',
]);
