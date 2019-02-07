import { SELECTORS } from '../constants/selectors';

/**
 *
 *
 * @class AirportGuideViewModel
 */
// FIXME: rename class to `AirportGuideView'
export default class AirportGuideViewModel {
    /**
     * @constructor
     * @param {JQuery Element} $element
     * @param {string} data
     */
    // FIXME: `icao` might not be needed in this class
    constructor($element, data) {
        /**
         * The HTML view container of the data (formatted)
         *
         * @property $element
         * @type {JQuery|HTMLElement}
         */
        this.$element = null;

        /**
         * Local instance of the airport guide data
         *
         * @property _airportGuide
         * @type {string}
         */
        this._airportGuide = data;

        /**
         * The HTML containing the data itself
         *
         * @property $data
         * @type {JQuery|HTMLElement}
         */
        this.$airportGuideView = null;

        return this._init()
            ._createChildren($element)
            .enable();
    }

    /**
     * Initializes the HTML elements on startup, should be run once
     * per lifecycle.
     *
     * @for AirportGuideViewModel
     * @method _init
     * @private
     * @chainable
     */
    _init() {
        return this;
    }

    /**
     * Create child elements
     *
     * Should be run only once on instantiation
     *
     * @for AirportGuideViewModel
     * @method _createChildren
     * @param {JQuery Element} $element
     * @private
     * @chainable
     */
    _createChildren($element) {
        this.$element = $element.find(SELECTORS.DOM_SELECTORS.AIRPORT_GUIDE_CONTAINER);
        this.$airportGuideView = this.$element.find(SELECTORS.DOM_SELECTORS.AIRPORT_GUIDE_VIEW);

        return this;
    }

    /**
     * Enable the instance
     *
     * @for AirportGuideViewModel
     * @method enable
     * @private
     * @chainable
     */
    enable() {
        this.update(this._airportGuide);

        return this;
    }

    /**
     * Destroys the instance
     *
     * @for AirportGuideViewModel
     * @method disable
     */
    disable() {
        this._airportGuide = null;
        this.$element = null;
        this.$airportGuideView = null;
    }

    /**
     * Updates the text in the view.
     * Should be run by the controller on airport change.
     *
     * @for AirportGuideViewModel
     * @method update
     * @param {String} data
     */
    update(data) {
        this._airportGuide = data;

        // FIXME: sanitize this
        this.$airportGuideView.html(this._airportGuide);
    }

    /**
     * Toggles the view when the selector is clicked.
     *
     * @for AirportGuideViewModel
     * @method toggleView
     */
    toggleView() {
        this.$element.toggleClass(SELECTORS.CLASSNAMES.AIRPORT_GUIDE_IS_OPEN);
    }
}
