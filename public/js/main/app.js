import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, p, hr, pre, makeDOMDriver } from '@cycle/dom';

import R from 'ramda';
import stringify from 'json-stable-stringify';
import switchPath from 'switch-path';
import { createHistory } from 'history';
import { makeHTTPDriver } from '@cycle/http';
import { makeHistoryDriver } from '@cycle/history';

import Restaurant from './components/Restaurant';

const deserialize = x => JSON.parse(x);
const serialize = (x, opts = {}) => stringify(x, R.merge(opts, { space: 2 }));

function main(sources) {
  const request$ = xs.of(
    {
      url: '/data/restaurants.json',
      category: 'restaurant-list'
    },
    {
      url: '/data/reviews.json',
      category: 'all-reviews-list'
    }
  );

  let restaurantsData$ = sources.HTTP
      .select('restaurant-list')
      .flatten()
      .map(res => res.text)
      .map(deserialize)
      .map(R.head)
    /*.startWith(null)*/;

  let allReviewsData$ = sources.HTTP
      .select('all-reviews-list')
      .flatten()
      .map(res => res.text)
      .map(deserialize)
    /*.startWith(null)*/;

  const restaurant = Restaurant({
    DOM: sources.DOM,
    props: restaurantsData$,
  });

  //noinspection UnnecessaryLocalVariableJS
  const sinks = {
    DOM: xs.combine(
      sources.History,
      restaurant.DOM,
      allReviewsData$
    )
    // .startWith('???')
      .map(([history, restaurantsDom, reviews]) =>
        div([
          // view.headerVdom(),
          // hr(),
          // view.locationProps(history),
          restaurantsDom,
          pre(serialize(reviews)),
        ])
      ),
    HTTP: request$
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app-container'),
  History: makeHistoryDriver(createHistory()),
  HTTP: makeHTTPDriver(),
});