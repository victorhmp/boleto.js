const window = require('svgdom');

const document = window.document;
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

// register window and document
registerWindow(window, window.document);

class svg {
  /**
   * Initializes the class
   *
   * @constructor
   * @param {Array} stripes The list of stripes to be drawn
   * @param {Integer} stripeWidth The width of a single-weighted stripe
   */
  constructor(stripes, stripeWidth) {
    this.stripes = stripes.split('').map(a => parseInt(a, 10));
    this.stripeWidth = stripeWidth || 4;
  }

  /**
   * Appends an SVG object and renders the barcode inside it
   *
   * The structure of the SVG is a series of parallel rectangular stripes whose
   * colors alternate between black or white.
   * These stripes are placed from left to right. Their width will vary
   * depending on their weight, which can be either 1 or 2.
   *
   * @param {String} selector The selector to the object where the SVG must be
   * appended
   */
  render() {
    // create canvas
    const canvas = SVG(document.documentElement);
    const imageGroup = canvas.group();
    let pos = 0;
    let width = 0;

    for (let i = 0; i < this.stripes.length; i += 1, pos += width) {
      width = this.stripeWidth * this.stripes[i];
      const shape = canvas.rect(pos, 0, width, 100).fill(svg.color(i));

      imageGroup.add(shape);
    }

    canvas.attr({
      width: '100%',
      height: '100%',
      viewBox: `0 0 ${this.viewBoxWidth()} 100`,
    });
    return canvas.svg();
  }

  /**
   * Calculates the total width of the barcode
   *
   * The calculation method is the sum of the weight of the stripes multiplied
   * by the width of a single-wighted stripe
   *
   * @return {Integer} The width of a view box that fits the barcode
   */
  viewBoxWidth() {
    return this.stripes.reduce((a, b) => a + b, 0) * this.stripeWidth;
  }

  /**
   * Returns the appropriate color for each stripe
   *
   * Odd numbers will return white, even will return black
   *
   * @param {Integer} i The index of the stripe
   * @return {String} The stripe color
   *
   * @example
   * // Returns "#ffffff"
   * svg.color(1);
   * // Returns "#000000"
   * svg.color(2);
   */
  static color(i) {
    return i % 2 ? '#ffffff' : '#000000';
  }
}

module.exports = svg;
