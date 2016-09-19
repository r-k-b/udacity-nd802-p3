import xs from 'xstream';
import { compose, path, has, map, is, merge } from 'ramda';
import { link, div, a, span, h1, pre } from '@cycle/dom';

const listMoveButton = (label, ident) => a(
  '.restaurant-list__items__move-button',
  {
    props: {
      'href': '#',
    },
    attrs: {
      'data-action': `move-to-${ident}`,
    },
  },
  label
);


function view(state$) {
  return state$.map(restaurantList => {
    let { items, position } = restaurantList;

    let itemsDom = map(path(['restaurant', 'DOM']), items);

    return div('.restaurant-list__outer', [
      link({
        props: {
          rel: 'stylesheet',
          href: './css/restaurant-list.css'
        }
      }),
      listMoveButton('Previous', 'previous'),
      listMoveButton('Next', 'next'),
      div(restaurantList.url),
      div('.restaurant-list__items__outer', itemsDom),
      // pre('.restaurant-list__json.code-preview', serialize(restaurantList)),
    ])
  });
}

export default view