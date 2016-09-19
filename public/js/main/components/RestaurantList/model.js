import { merge } from 'ramda';
import xs from 'xstream';
import switchPath from 'switch-path';

const updatePosition = (Σ, Δ) => {
  if (Δ.type === 'rel') {
    return Σ + Δ.value;
  }
  if (Δ.type === 'abs') {
    return Δ.value
  }
  throw new TypeError('Unexpected `type` passed for position update.');
};


function model(action$, props$) {
  let sanitizedProps$ = props$.startWith({
    items: [],
  });

  let positionMovement$ = xs.merge(
    action$.filter(a => a.type === 'moveToNext').mapTo({ type: 'rel', value: 1 }),
    action$.filter(a => a.type === 'moveToPrevious').mapTo({ type: 'rel', value: -1 }),
    action$.filter(a => a.type === 'moveToStart').mapTo({ type: 'abs', value: 0 })
  );

  // do we keep it within the length of items here, or elsewhere?
  let absolutePosition$ = positionMovement$.fold(updatePosition, 0);

  let url$ = action$.map(
    a =>
      a.value
  )
    .startWith('/');

  return xs.combine(sanitizedProps$, absolutePosition$, url$)
    .map(([props, position, url]) => merge(
      props,
      {
        position,
        url,
      }
    ));
}

export default model;
