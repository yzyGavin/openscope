import _has from 'lodash/has';
import EventBus from '../lib/EventBus';
import AirportGuideView from './AirportGuideView';
import { EVENT } from '../constants/eventNames';
import { SELECTORS } from '../constants/selectors';

/**
 *
 *
 * @class AirportGuideViewController
 */
export default class AirportGuideViewController {
    /**
     * @constructor
     * @param {JQuery|HTMLElement} $element
     * @param {object} airportGuideData  dictionary of airport icao and html string
     * @param {string} initialIcao
     */
    constructor($element, airportGuideData, initialIcao) {
        /**
         * Root DOM element
         *
         * @property $element
         * @type {JQuery|HTMLElement}
         */
        this.$element = null;

        /**
         * The ICAO of the initial airport.
         *
         * @property initialIcao
         * @type {string}
         */
        this.initialIcao = initialIcao.toLowerCase();

        /**
         * Root list view element
         *
         * @property airportGuideView
         * @type {AirportGuideView}
         */
        this.airportGuideView = null;

        // FIXME: move this click interaction to UiController
        /**
         * Trigger that toggles visibility of the `$airportGuideView`
         *
         * @property $airportGuideTrigger
         * @type {JQuery|HTMLElement}
         */
        this.$airportGuideTrigger = null;

        /**
         * Contains an object with keys of icao idents and values
         * of the airport guides from the documentation folder.
         *
         * @property _guideData
         * @type {object<string, string>}
         * @private
         */
        this._guideData = airportGuideData;

        /**
         * Local reference to the EventBus
         *
         * @property _eventBus
         * @type {EventBus}
         * @private
         */
        this._eventBus = null;

        return this._init()
            ._createChildren($element)
            ._setupHandlers()
            .enable();
    }

    /**
     * Initialize the instance
     *
     * Should only be run once on instantiation
     *
     * @for airportGuideViewController
     * @method init
     * @private
     * @chainable
     */
    _init() {
        this._eventBus = EventBus;

        return this;
    }

    /**
     * Create child elements
     *
     * Should be run only once on instantiation
     *
     * @for AirportGuideViewController
     * @method _createChildren
     * @param {Jquery Element} $element
     * @chainable
     * @private
     */
    _createChildren($element) {
        const activeAirportGuide = this.getAirportGuide(this.initialIcao);
        this.$airportGuideTrigger = $element.find(SELECTORS.DOM_SELECTORS.AIRPORT_GUIDE_TRIGGER);
        this.airportGuideView = new AirportGuideView($element, activeAirportGuide);

        return this;
    }

    /**
     * Bind method handlers
     *
     * Should only be run once on instantiation
     *
     * @for airportGuideViewController
     * @method _setupHandlers
     * @chainable
     */
    _setupHandlers() {
        this._onAirportChangeHandler = this._onAirportChange.bind(this);
        this._onElementToggleHandler = this._onToggleAirportGuide.bind(this);

        return this;
    }

    /**
     * Enable handlers
     *
     * @for airportGuideViewController
     * @method enable
     * @chainable
     */
    enable() {
        this._eventBus.on(EVENT.AIRPORT_CHANGE, this._onAirportChangeHandler);
        this.$airportGuideTrigger.on('click', this._onElementToggleHandler);

        return this;
    }

    /**
     * Disable handlers
     *
     * @for airportGuideViewController
     * @method disable
     * @chainable
     */
    disable() {
        this._eventBus.off(EVENT.AIRPORT_CHANGE, this._onAirportChangeHandler);
        this.$airportGuideTrigger.off('click', this._onElementToggleHandler);

        return this;
    }

    /**
     * Reset the instance
     *
     * @for airportGuideViewController
     * @method destroy
     * @chainable
     */
    destroy() {
        this._eventBus = null;
        this.$element = null;
        this.initialIcao = null;
        this.airportGuideView = null;
        this.$airportGuideTrigger = null;
        this._guideData = null;
        this._onAirportChangeHandler = null;
        this._onElementToggleHandler = null;

        return this;
    }

    /**
     * Event handler for when the `airportGuideView` instance is clicked
     *
     * @for airportGuideViewController
     * @method _onToggleAirportGuide
     * @param event {JQueryEventObject}
     * @private
     */
    _onToggleAirportGuide() {
        this.airportGuideView.toggleView();
    }

    /**
     * Event handler for when an airport is changed.
     *
     * @for AirportGuideViewController
     * @method _onAirportChange
     * @param {object} nextAirportJson
     * @private
     */
    _onAirportChange(nextAirportJson) {
        const nextIcao = nextAirportJson.icao.toLowerCase();
        const airportGuideMarkupString = this.getAirportGuide(nextIcao);

        this.airportGuideView.update(airportGuideMarkupString);
    }

    /**
     * Main getter method for an airport guide,
     * identified by ICAO.
     *
     * @for AirportGuideViewController
     * @method getAirportGuide
     * @param {string} nextIcao
     * @returns {string} - the requested guide
     */
    getAirportGuide(nextIcao) {
        const guideExists = this.hasAirportGuide(nextIcao);

        if (!guideExists) {
            nextIcao = 'not_found';
        }

        return this._guideData[nextIcao];
    }

    /**
     * Returns whether or not an airport guide
     * exists for the given airport
     *
     * @for AirportGuideViewController
     * @method hasAirportGuide
     * @param {string} icao
     * @returns {Boolean} whether a guide was found
     */
    hasAirportGuide(icao) {
        return _has(this._guideData, icao);
    }
}
