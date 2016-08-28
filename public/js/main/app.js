import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, p, hr, makeDOMDriver } from '@cycle/dom';

import switchPath from 'switch-path';
import {createHistory} from 'history';
import { makeHistoryDriver } from '@cycle/history';

import view from './components/RestaurantList/view';

function main(sources) {
  //noinspection UnnecessaryLocalVariableJS
  const sinks = {
    DOM: sources.History
      .startWith('???')
      .map(x =>
        div([
          view.headerVdom(),
          hr(),
          p('Hello ' + x),
          view.locationProps(x)
        ])
      )
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app-container'),
  History: makeHistoryDriver(createHistory()),
});