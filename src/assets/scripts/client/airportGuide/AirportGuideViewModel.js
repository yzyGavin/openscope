import $ from 'jquery';
import showdown from 'showdown';
import { SELECTORS } from '../constants/selectors';

/**
 * @property GUIDE_VIEW_CONTAINER
 * @final
 */
const GUIDE_VIEW_CONTAINER = '<div class="airport-guide-data nice-scrollbar"></div>'

/**
 * @property GUIDE_DATA_CONTAINER
 * @final
 */
// todo: is this needed?
const GUIDE_DATA_CONTAINER = '<p class="airport-guide"></p>';

export default class AirportGuideViewModel {
    /**
     *
     * @constructor
     * @param {string} icao
     * @param {string} data
     */
    constructor(icao, data) {
        /**
         * Local instance of the airport guide data
         *
         * @property data
         * @type {string}
         */
        this.data = data;

        /**
         * The icao airport code of the airport whose data we have
         *
         * @property icao
         * @type {string}
         */
        this.icao = icao;

        /**
         * The HTML view container of the data (formatted)
         *
         * @property $element
         * @type {JQuery|HTMLElement}
         */
        this.$element = null;

        /**
         * The HTML containing the data itself
         *
         * @property $data
         * @type {JQuery|HTMLElement}
         */
        this.$data = null;

        this.init();
    }

    /**
     * Initializes the HTML elements on startup, should be run once
     * per lifecycle.
     *
     * @for AirportGuideViewModel
     * @method init
     */
    init() {
        this.$element = $(GUIDE_VIEW_CONTAINER);
        this.$data = $(GUIDE_DATA_CONTAINER);

        this.$element.append(this.$data);

        this.update(this.icao, this.data);
    }

    /**
     * Destroys the elements.
     *
     * @for AirportGuideViewModel
     * @method disable
     */
    disable() {
        this.icao = null;
        this.data = null;
        this.$element = null;
        this.$data = null;
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
        this.data = data;

        const parsedData = this._parseMarkdown(this.data)

        this.$data.html(parsedData);
    }

    /**
     * Toggles the view when the selector is clicked.
     *
     * @for AirportGuideViewModel
     * @method toggleView
     */
    toggleView() {
        this.$element.toggleClass(SELECTORS.CLASSNAMES.AIRPORT_GUIDE_IS_OPEN); /*AIRPORT_GUIDE_IS_*/
    }

    /**
     * Encapsulates the `makeHtml` method from `showdownjs`.
     *
     * @for AirportGuideViewModel
     * @method _parseMarkdown
     * @param {String} markdown
     * @returns {String} parsed HTML
     * @private
     */
    _parseMarkdown(markdown) {
        const converter = new showdown.Converter({ tables: true, simpleLineBreaks: true });

        return converter.makeHtml(markdown);
    }
}
