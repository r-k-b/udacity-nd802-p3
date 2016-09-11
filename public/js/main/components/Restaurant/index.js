import intent from './intent';
import model from './model';
import view from './view';

function Restaurant(sources) {
  let props$ = sources.props;
  let action$ = intent(sources.DOM);
  let state$ = model(props$, action$);
  let vtree$ = view(state$);

  return {
    DOM: vtree$,
    action: action$,
  }
}

export default Restaurant;