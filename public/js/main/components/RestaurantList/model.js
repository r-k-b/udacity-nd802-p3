import { merge } from 'ramda';
import xs from 'xstream';


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

  return xs.combine(sanitizedProps$, absolutePosition$)
    .map(([props, position]) => merge(
      props,
      {
        position,
      }
    ));
}

export default model;
