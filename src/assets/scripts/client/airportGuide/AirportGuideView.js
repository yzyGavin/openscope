import { SELECTORS } from '../constants/selectors';

/**
 * Display information about the active airport
 *
 * Part of the build includes copying and converting source
 * documents to html. This is retrieved via ajax request and
 * stored in memory until needed
 *
 * _Original documentation can be found in `documentation/airport-guides`_
 *
 * @class AirportGuideView
 */
export default class AirportGuideView {
    /**
     * @constructor
     * @param {JQuery|HTMLElement} $element
     * @param {string} data  html string generated from airport-guide markdown
     */
    constructor($element, data) {
        /**
         * The HTML view container of the data (formatted)
         *
         * @property $element
         * @type {JQuery|HTMLElement}
         * @default null
         */
        this.$element = null;

        /**
         * Local instance of the airport guide data
         *
         * @property _airportGuideMarkup
         * @type {string}
         */
        this._airportGuideMarkup = data;

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
     * Lifecycle method
     *
     * Should be called once on instantiation
     *
     * @for AirportGuideView
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
     * @for AirportGuideView
     * @method _createChildren
     * @param {JQuery|HTMLElement} $element
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
     * @for AirportGuideView
     * @method enable
     * @private
     * @chainable
     */
    enable() {
        this.update(this._airportGuideMarkup);

        return this;
    }

    /**
     * Destroys the instance
     *
     * @for AirportGuideView
     * @method disable
     */
    disable() {
        this._airportGuideMarkup = null;
        this.$element = null;
        this.$airportGuideView = null;
    }

    /**
     * Updates the text in the view.
     * Should be run by the controller on airport change.
     *
     * @for AirportGuideView
     * @method update
     * @param {string} nextAirportMarkup
     */
    update(nextAirportMarkup) {
        this._airportGuideMarkup = nextAirportMarkup;

        // TODO: determine if this needs to be sanitized
        this.$airportGuideView.html(this._airportGuideMarkup);
    }

    /**
     * Toggles visibility of the airport guide modal
     *
     * This method should only be called by the `AirportGuideController`
     *
     * @for AirportGuideView
     * @method toggleView
     */
    toggleView() {
        this.$element.toggleClass(SELECTORS.CLASSNAMES.AIRPORT_GUIDE_IS_OPEN);
    }
}
