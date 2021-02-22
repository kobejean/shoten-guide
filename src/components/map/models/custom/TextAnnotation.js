export default mapkit =>
  class TextAnnotation extends mapkit.MarkerAnnotation {
    constructor(coordinate, options) {
      options = {
        ...options,
        animates: false,
        anchorOffset: new DOMPoint(0, 10),
        glyphColor: 'transparent',
        color: 'transparent',
        enabled: false,
        calloutEnabled: false,
        collisionMode: mapkit.Annotation.CollisionMode.Circle,
        padding: new mapkit.Padding(35, 2, 2, 2), // reduce bounding box from above since marker is invisible
      }
      super(coordinate, options)
    }
  }
