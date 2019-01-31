import $ from 'jquery';
import _has from 'lodash/has';
import AirportController from '../airport/AirportController';
import EventBus from '../lib/EventBus';
import AirportGuideViewModel from './AirportGuideViewModel';
import { EVENT } from '../constants/eventNames';
import { SELECTORS } from '../constants/selectors';
import { AIRPORT_GUIDE_DATA } from './guides/index';

/**
 * 
 *
 * @class AirportGuideViewController
 */
export default class AirportGuideViewController {
    /**
     * @constructor
     * @param {JQuery|HTMLElement} $element
     * @param {String} initialIcao
     */
    constructor($element, initialIcao) {
        /**
         * Root DOM element
         *
         * @property $element
         * @type {JQuery|HTMLElement}
         */
        this.$element = $element;

        /**
         * The ICAO of the current airport.
         *
         * @property airportIcao
         * @type {string}
         */
        this.icao = initialIcao.toLowerCase();

        /**
         * Root list view element
         *
         * @property airportGuideView
         * @type {AirportGuideViewModel}
         */
        this.airportGuideViewModel = null;
        //this.$airportGuideView = $(SELECTORS.DOM_SELECTORS.AIRPORT_GUIDE);

        /**
         * Trigger that toggles visibility of the `$airpertGuideView`
         *
         * @property $airportGuideTrigger
         * @type {JQuery|HTMLElement}
         */
        this.$airportGuideTrigger = $(SELECTORS.DOM_SELECTORS.AIRPORT_GUIDE_TRIGGER);

        /**
         * Contains an object with keys of icao idents and values
         * of the airport guides from the documentation folder.
         *
         * @property _guideData
         * @type {object<string, string>}
         * @private
         */
        this._guideData = AIRPORT_GUIDE_DATA;

        /**
         * Local reference to the EventBus
         *
         * @property _eventBus
         * @type {EventBus}
         * @private
         */
        this._eventBus = null;

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
        this._eventBus = EventBus;
        this._onAirportChangeHandler = this._onAirportChange.bind(this);
        this._onElementToggleHandler = this._onAirportGuideToggle.bind(this);

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
        this.$airportGuideTrigger.on('click', this._onElementToggleHandler);
        this._eventBus.on(EVENT.AIRPORT_CHANGE, this._onAirportChangeHandler);
        this.airportGuideViewModel = new AirportGuideViewModel(this.icao, this.getAirportGuide(this.icao));

        this.$element.append(this.airportGuideViewModel.$element);

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
        this.airportGuideViewModel.toggleView();
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
        const nextData = this.getAirportGuide(nextIcao);
    
        this.airportGuideViewModel.update(nextIcao, nextData);
    }

    /**
     * Main getter method for an airport guide,
     * identified by ICAO.
     *
     * @for AirportGuideViewController
     * @method getAirportGuide
     * @param {String} nextIcao
     * @returns {String} - the requested guide
     */
    getAirportGuide(nextIcao) {
        const guideExists = this.hasAirportGuide(nextIcao);
        let nextData;

        if (!guideExists) {
            nextData = this._guideData['not_found'](nextIcao);
        } else {
            nextData = this._guideData[nextIcao];
        }

        return nextData;
    }

    /**
     * Returns whether or not an airport guide
     * exists for the given airport
     *
     * @for AirportGuideViewController
     * @method hasAirportGuide
     * @param {String} icao
     * @returns {Boolean} whether a guide was found
     */
    hasAirportGuide(icao) {
        return _has(this._guideData, icao);
    }
}