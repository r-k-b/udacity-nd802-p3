import xs from 'xstream';

function intent (DOMSource, itemAction$) {
  return xs.merge(
    DOMSource.select(`[data-action='move-to-next']`)
      .events('click')
      .mapTo({
        type: 'moveToNext',
      }),

    DOMSource.select(`[data-action='move-to-previous']`)
      .events('click')
      .mapTo({
        type: 'moveToPrevious',
      }),

    DOMSource.select(`[data-action='move-to-start']`)
      .events('click')
      .mapTo({
        type: 'moveToStart',
      })
  )
}

export default intent;