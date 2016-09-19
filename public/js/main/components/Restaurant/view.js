import { merge, path } from 'ramda';
import { img, div, span, h1, pre, a } from '@cycle/dom';


/**
 *
 * @param restaurant {Object}
 * @return {String}
 */
const getPic = restaurant => `${path(['mainPhoto', 'originalSize'], restaurant)}?random=${restaurant.index}`;


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
      a('.restaurant__image__outer', [
        img('.restaurant__image', {
          props: {
            src: getPic(restaurant),
            alt: `The main photo of ${name}.`, // todo: check this alt text is appropriate
          }
        }),
      ]),
      div('.restaurant__cuisine-type', `Cuisine type: ${restaurant.cuisineType}`),
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