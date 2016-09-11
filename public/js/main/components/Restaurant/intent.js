import xs from 'xstream';

function intent (DOMSource) {
  return xs.merge(
    DOMSource.select(`[data-action='show-details]'`)
      .events('click')
      .mapTo({type: 'showDetails'}),

    DOMSource.select(`[data-action='hide-details]'`)
      .events('click')
      .mapTo({type: 'hideDetails'})
  )
}

export default intent;