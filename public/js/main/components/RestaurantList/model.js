import { length, merge, mathMod } from 'ramda';
import xs from 'xstream';
import switchPath from 'switch-path';

const updatePosition = (Σ, Δ) => {
  let Bₗ = Δ.lowerBound || 0;
  let Bᵤ = Δ.upperBound || Number.MAX_SAFE_INTEGER; // todo: why is `x mod ∞` undefined?

  if (Δ.type === 'rel') {
    return mathMod(
        Σ + Δ.value - Bₗ,
        Bᵤ - Bₗ
      ) + Bₗ;
  }
  if (Δ.type === 'abs') {
    return mathMod(
        Δ.value - Bₗ,
        Bᵤ - Bₗ
      ) + Bₗ;
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

  let bounds$ = sanitizedProps$.map(props => ({
    lowerBound: 0,
    upperBound: length(props.items)
  }));

  let movementWithBoundaries$ = bounds$
    .map(bounds => positionMovement$.map(movement => merge(movement, bounds)))
    .flatten();

  // do we keep it within the length of items here, or elsewhere?
  let absolutePosition$ = movementWithBoundaries$.fold(updatePosition, 0);

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
