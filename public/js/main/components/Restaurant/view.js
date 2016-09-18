import { merge } from 'ramda';
import { div, span, h1, pre, a } from '@cycle/dom';

function view(state$) {
  return state$.map(restaurant => {
    let { name, ratingAggregate, isDetailView } = restaurant;

    let containerClasses = {
      detailView: isDetailView
    };

    return div('.restaurant__outer', { class: containerClasses }, [
      a(
        { props: { href: `/restaurants/${restaurant.guid}` } },
        [
          h1('.restaurant__name', name)
        ],
      ),
      div('.restaurant__rating', [
        span('.restaurant__rating__label', 'Rating:'),
        span('.restaurant__rating__number', ratingAggregate)
      ]),
      a(
        { props: { href: '#see-reviews' } },
        'See Reviews'
      ),
      a(
        { props: { href: '#write-review' } },
        'Write a Review'
      )
      // pre('.restaurant__json', serialize(restaurant))
    ])
  })
}

export default view