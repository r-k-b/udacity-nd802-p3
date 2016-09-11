import R from 'ramda';
import xs from 'xstream';

function model(props$, action$) {

  let sanitizedProps$ = props$.startWith({
    name: '...',
    rating: 0,
  });

  let showDetails$ = xs.merge(
    action$.filter(a => a.type === 'showDetails').mapTo(true),
    action$.filter(a => a.type === 'hideDetails').mapTo(false),
  )
    .startWith(false);

  return xs.combine(sanitizedProps$, showDetails$)
    .map(([props, showDetails]) => R.merge(
      props,
      {
        isDetailView: showDetails,
      }
    ));
}

export default model;
