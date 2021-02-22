export default mapkit =>
  class TextAnnotation extends mapkit.MarkerAnnotation {
    constructor(coordinate, options) {
      options = {
        ...options,
        anchorOffset: new DOMPoint(0, 10),
        glyphColor: 'transparent',
        color: 'transparent',
        enabled: false,
      }
      super(coordinate, options)
    }
  }
