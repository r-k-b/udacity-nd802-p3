import xs from 'xstream';
import { has, map, is, merge } from 'ramda';
import { link, div, a, span, h1, pre } from '@cycle/dom';
import stringify from 'json-stable-stringify';


const excludeStreams = function(key, val) {
  if (has('_ils', val)) {
    return '<Stream>'
  }
  return val
};


const serialize = (x, opts = {}) => {
  try {
    return stringify(x, merge(opts, { space: 2, replacer: excludeStreams }))
  } catch (err) {
    debugger;
    return err.message
  }
};


function view(state$) {
  return state$.map(restaurantList => {
    let { items, position } = restaurantList;

    return div('.restaurant-list__outer', [
      link({
        props: {
          rel: 'stylesheet',
          href: './css/restaurant-list.css'
        }
      }),
      a(
        '.restaurant-list__items__move-button',
        {
          props: {
            'href': '#',
          },
          attrs: {
            'data-action': 'move-to-previous',
          }
        },
        'Previous'
      ),
      a(
        '.restaurant-list__items__move-button',
        {
          props: {
            'href': '#',
          },
          attrs: {
            'data-action': 'move-to-next',
          },
        },
        'Next'
      ),
      div('.restaurant-list__items__outer', `wahey! pos=${position} items=${items.length}`),
      pre('.restaurant-list__json.code-preview', serialize(restaurantList))
    ])
  });
}

export default view