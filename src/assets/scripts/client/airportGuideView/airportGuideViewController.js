import $ from jQuery
import { SELECTORS } from '../../constants/selectors';

/**
 * 
 *
 * @class airportGuideViewController
 */
export default class airportGuideViewController {
    /**
     * @constructor
     */
    constructor() {
        /**
         * Root list view element
         *
         * @property $airportGuideView
         * @type {JQuery|HTMLElement}
         */
        this.$airportGuideView = $(SELECTORS.DOM_SELECTORS.AIRPORT_GUIDE);

        /**
         * Trigger that toggles visibility of the `$airpertGuideView`
         *
         * @property $airportGuideTrigger
         * @type {JQuery|HTMLElement}
         */
        this.$airportGuideTrigger = $(SELECTORS.DOM_SELECTORS.AIRPORT_GUIDE_TRIGGER);

        return this._init().enable();
    }

    /**
     * Initialize the instance
     * 
     * Shuld only be run once on instantiation
     * 
     * @for airportGuideViewController
     * @method _init
     */
    _init() {
        
    }

    /**
     * Enable handlers
     * 
     * @for airportGuideViewController
     * @method enable
     * @chainable
     */
    enable() {
        this.$airportGuideTrigger.on('click', this._onAirportGuideToggle)

        return this;
    }

    /**
     * Event handler for when a `airportGuideView` instance is clicked
     *
     * @for airportGuideViewController
     * @method _onAirportGuideToggle
     * @param event {JQueryEventObject}
     * @private
     */
    _onAirportGuideToggle() {
        this.$airportGuideView.toggleClass(SELECTORS.CLASSNAMES.AIRPORT_GUIDE_IS_HIDDEN);
    }
}