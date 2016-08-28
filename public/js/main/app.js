import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, p, hr, pre, makeDOMDriver } from '@cycle/dom';

import switchPath from 'switch-path';
import { createHistory } from 'history';
import { makeHTTPDriver } from '@cycle/http';
import { makeHistoryDriver } from '@cycle/history';

import view from './components/RestaurantList/view';

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
    /*.startWith(null)*/;

  let allReviewsData$ = sources.HTTP
    .select('all-reviews-list')
    .flatten()
    .map(res => res.text)
    /*.startWith(null)*/;

  //noinspection UnnecessaryLocalVariableJS
  const sinks = {
    DOM: xs.combine(
      sources.History,
      restaurantsData$,
      allReviewsData$
    )
      // .startWith('???')
      .map(([history, restaurants, reviews]) =>
        div([
          view.headerVdom(),
          hr(),
          view.locationProps(history),
          pre(restaurants),
          pre(reviews),
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