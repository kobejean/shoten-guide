// modified from @rollup/plugin-json
import { createFilter, dataToEsm } from '@rollup/pluginutils'

export default function json(options = {}) {
  const filter = createFilter(options.include, options.exclude)
  const indent = 'indent' in options ? options.indent : '\t'

  return {
    name: 'json',

    // eslint-disable-next-line no-shadow
    transform(json, id) {
      if (
        !id
          .split('.')
          .pop()
          .match(/^(geo)?json$/i) ||
        !filter(id)
      )
        return null

      try {
        const parsed = JSON.parse(json)
        return {
          code: dataToEsm(parsed, {
            preferConst: options.preferConst,
            compact: options.compact,
            namedExports: options.namedExports,
            indent,
          }),
          map: { mappings: '' },
        }
      } catch (err) {
        const message = 'Could not parse JSON file'
        const position = parseInt(/[\d]/.exec(err.message)[0], 10)
        this.warn({ message, id, position })
        return null
      }
    },
  }
}
