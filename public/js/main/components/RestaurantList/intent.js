import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';

function intent (DOMSource, History, itemAction$) {
  return xs.merge(
    // THE ROUTE STREAM
    // A stream that provides the path whenever the route changes.
    // History
    //   .startWith({pathname: '/'})
    //   .map(location => location.pathname)
    //   .compose(dropRepeats())
    //   .map(payload => ({type: 'changeRoute', payload})),

    // THE URL STREAM
    // A stream of URL clicks in the app
    // DOMSource.select('a').events('click')
    //   .map(event =>  event.target.hash.replace('#', ''))
    //   .map(payload => ({type: 'url', payload})),

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