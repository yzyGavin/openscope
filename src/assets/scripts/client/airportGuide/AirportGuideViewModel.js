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
     * @param {string} icao
     * @param {string} data
     */
    // FIXME: `icao` might not be needed in this class
    constructor($element, icao, data) {
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
         * @property _airportGuideDictionary
         * @type {string}
         */
        this._airportGuideDictionary = data;

        /**
         * The icao airport code of the airport whose data we have
         *
         * @property icao
         * @type {string}
         */
        this.icao = icao;

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
     */
    _init() {
        return this;
    }

    /**
     *
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
     *
     *
     * @for AirportGuideViewModel
     * @method enable
     * @private
     * @chainable
     */
    enable() {
        this.update(this.icao, this._airportGuideDictionary);

        return this;
    }

    /**
     * Destroys the instance
     *
     * @for AirportGuideViewModel
     * @method disable
     */
    disable() {
        this.icao = null;
        this._airportGuideDictionary = null;
        this.$element = null;
        this.$airportGuideView = null;
    }

    /**
     * Updates the text in the view.
     * Should be run by the controller on airport change.
     *
     * @for AirportGuideViewModel
     * @method update
     * @param {String} icao
     * @param {String} data
     */
    update(icao, data) {
        this.icao = icao;
        this._airportGuideDictionary = data;

        // FIXME: sanitize this
        this.$airportGuideView.html(this._airportGuideDictionary);
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
