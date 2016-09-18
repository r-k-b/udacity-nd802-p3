import stringify from 'json-stable-stringify';


const excludeStreams = function (key, val) {
  if (has('_ils', val)) {
    return '<Stream>'
  }
  return val
};


const serializeWithError = (x, opts = {}) => {
  try {
    return stringify(x, merge(opts, { space: 2, replacer: excludeStreams }))
  } catch (err) {
    // debugger;
    return err.message
  }
};

const deserialize = x => JSON.parse(x);

export {
  deserialize,
  excludeStreams,
  serializeWithError,
};
