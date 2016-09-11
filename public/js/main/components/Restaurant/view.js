import { merge } from 'ramda';
import { div, span, h1, pre } from '@cycle/dom';
import stringify from 'json-stable-stringify';

const serialize = (x, opts = {}) => stringify(x, merge(opts, { space: 2 }));

function view(state$) {
  return state$.map(restaurant => {
    let { name, ratingAggregate, isDetailView } = restaurant;

    let containerClasses = {
      detailView: isDetailView
    };

    return div('.restaurant__outer', { class: containerClasses }, [
      h1('.restaurant__name', name),
      div('.restaurant__rating', [
        span('.restaurant__rating__label', 'Rating:'),
        span('.restaurant__rating__number', ratingAggregate)
      ]),
      pre('.restaurant__json', serialize(restaurant))
    ])
  })
}

export default view