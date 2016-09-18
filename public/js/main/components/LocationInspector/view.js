import { div, p, h1, header, table, thead, tbody, th, tr, td, caption, code, link } from '@cycle/dom';

const interestingLocationProperties = [
  'pathname',
  'action',
  'hash',
  'search',
  'state',
  'key'
];

const classPrefix = base => (sub, joiner = '__') => sub ? `${ base }${ joiner }${ sub }` : base;

const lp = classPrefix('.location-properties');

const viewLocationProps = (x) => table(
  lp('table'),
  [
    link({
      props: {
        rel: 'stylesheet',
        href: '/css/locationPropertyTable.css'
      }
    }),
    caption(lp('caption'), 'The current `Location` object'),
    thead([
      tr([
        th(lp('heading--left'), 'key'),
        th(lp('heading--left'), 'value'),
      ])
    ]),
    tbody(
      interestingLocationProperties.map(prop => tr([
        td(prop),
        td([
          code(
            JSON.stringify(x[prop])
          )
        ]),
      ]))
    )
  ]
);

export {
  viewLocationProps,
}