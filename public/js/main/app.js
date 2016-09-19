import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, span, h2, hr, pre, makeDOMDriver } from '@cycle/dom';

import R from 'ramda';
import { deserialize } from './utils';
import { createHistory } from 'history';
import { makeHTTPDriver } from '@cycle/http';
import { makeHistoryDriver } from '@cycle/history';

import { viewLocationProps } from './components/LocationInspector/view';
import RestaurantList from './components/RestaurantList';

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
    History: sources.History,
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
          // headerVdom(),
          // hr(),
          viewLocationProps(history),

          restaurantsDom,
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
  History: makeHistoryDriver(createHistory(), { capture: true }),
  HTTP: makeHTTPDriver(),
});