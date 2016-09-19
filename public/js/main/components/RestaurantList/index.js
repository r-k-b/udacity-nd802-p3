import xs from 'xstream';
import view from './view';
import model from './model';
import intent from './intent';
import isolate from '@cycle/isolate'
import { merge, objOf } from 'ramda';
import Restaurant from '../../components/Restaurant';

const deserialize = x => JSON.parse(x);

function amendStateWithChildren(DOMSource) {
  return function (restaurantsData) {
    return merge(
      restaurantsData,
      {
        items: restaurantsData.items.map(data => {
          // Turn the data item into an Observable
          let props$ = xs.of(data);
          // Create scoped todo item dataflow component.
          let restaurant = isolate(Restaurant)({ DOM: DOMSource, props: props$ });
          let action$ = restaurant.action;

          // Return the new data item for the items property array.
          return merge(
            data,
            {
              // This is a new property containing the DOM- and action stream of
              // the todo item.
              restaurant: {
                DOM: restaurant.DOM,
                action: action$.map(ev => merge(ev, { id: data.id }))
              }
            }
          );
        }),
      }
    );
  };
}

function RestaurantList(sources) {
  // let props$ = sources.props;
  // let action$ = intent(sources.DOM);
  // let state$ = model(props$, action$);
  // let vtree$ = view(state$);

  let request$ = xs.of({
    url: '/data/restaurants.json',
    category: 'restaurant-list'
  });

  let restaurantsData$ = sources.HTTP
    .select('restaurant-list')
    .flatten()
    .map(res => res.text)
    .map(deserialize)
    .map(objOf('items'));

  let proxyItemAction$ = xs.create();

  let action$ = intent(sources.DOM, sources.History, proxyItemAction$);

  let state$ = model(action$, restaurantsData$);

  let amendedState$ = state$
    .map(amendStateWithChildren(sources.DOM))
    .remember();

  let itemAction$ = amendedState$
    .map(
      ({ items }) => xs.merge(...items.map(i => i.todoItem.action$))
    )
    .flatten();

  proxyItemAction$.imitate(itemAction$);

  let vtree$ = view(amendedState$);

  return {
    DOM: vtree$,
    action: action$,
    HTTP: request$,
  }
}

export default RestaurantList;
