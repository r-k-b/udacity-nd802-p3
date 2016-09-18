import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, span, h2, hr, pre, makeDOMDriver } from '@cycle/dom';

import R from 'ramda';
import stringify from 'json-stable-stringify';
import switchPath from 'switch-path';
import { createHistory } from 'history';
import { makeHTTPDriver } from '@cycle/http';
import { makeHistoryDriver } from '@cycle/history';

import RestaurantList from './components/RestaurantList';

const deserialize = x => JSON.parse(x);
const serialize = (x, opts = {}) => stringify(x, R.merge(opts, { space: 2 }));

function main(sources) {
  const request$ = xs.of(
    {
      url: '/data/reviews.json',
      category: 'all-reviews-list'
    }
  );

  let allReviewsData$ = sources.HTTP
      .select('all-reviews-list')
      .flatten()
      .map(res => res.text)
      .map(deserialize)
    /*.startWith(null)*/;

  const restaurantList = RestaurantList({
    DOM: sources.DOM,
    // props: restaurantsData$.map(R.objOf('items')),
    HTTP: sources.HTTP,
  });

  //noinspection UnnecessaryLocalVariableJS
  const sinks = {
    DOM: xs.combine(
      sources.History,
      restaurantList.DOM,
      allReviewsData$
    )
      .map(([history, restaurantsDom, reviews]) =>
        div([
          // view.headerVdom(),
          // hr(),
          // view.locationProps(history),

          restaurantsDom,
          hr(),
          h2('Reviews'),
          pre('.code-preview', serialize(reviews)),
        ])
      ),
    HTTP: xs.merge(
      request$,
      restaurantList.HTTP
    ),
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app-container', { transposition: true }),
  History: makeHistoryDriver(createHistory()),
  HTTP: makeHTTPDriver(),
});