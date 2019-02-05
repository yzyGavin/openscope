const fs = require('fs');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const path = require('path');
const mkdirp = require('mkdirp');
const showdown = require('showdown');
const options = require('../options');

/**
 * Encapsulates the `makeHtml` method from `showdownjs`.
 *
 * @method _parseMarkdown
 * @param {String} markdown
 * @returns {String} parsed HTML
 */
function _parseMarkdown(markdown) {
    const converter = new showdown.Converter({ tables: true, simpleLineBreaks: true });

    return converter.makeHtml(markdown);
}

/**
 * Grabs the markdown files and returns the data and icao in an object
 *
 * @method _generateAirportGuideDict
 * @returns {Object} filenames and data
 */
function _generateAirportGuideDict() {
    const input = {};

    fs.readdirSync(options.DIR.ASSETS_GUIDES).forEach((filename) => {
        const pathToGuideFile = path.join(options.DIR.ASSETS_GUIDES, filename);
        const fileData = fs.readFileSync(pathToGuideFile, { encoding: 'utf8' });
        const icao = filename.split('.')[0];

        // If the file is empty, there is no guide, so we do not need to write it
        if (!fileData) {
            fancyLog(colors.yellow(`--- --- skipping airport: ${icao}, no guide found in file`));

            return;
        }

        input[icao] = fileData;
    });

    return input;
}

/**
 * Iterates through each airport, converting the markdown to HTML.
 * Returns a similar object, with ICAO keys and HTML values.
 *
 * @param {Object} input
 * @returns {Object} the object, with markdown parsed to HTML.
 */
function parseFiles(input) {
    // FIXME: replace with `.reduce()`
    console.log('\n', input);
    for (const key in input) {
        console.log('+++ ', key);
        // skip if key is from prototype
        if (!input.hasOwnProperty(key)) continue;

        input[key] = _parseMarkdown(input[key]);
    }

    return input;
}

/**
 * Asynchronously creates the `public/assets/guides` directory, if needed,
 * then writes the airport guides to a single file, `guides.json`.
 *
 * Will throw a `Promise.reject()`, should directory creation or file writing fail.
 *
 * @param {Object} input
 */
function _writeFileOutput(input) {
    const filePathToWrite = path.join(options.DIR.DIST_GUIDES, 'guides.json');
    const jsonOutput = JSON.stringify(input);

    mkdirp(options.DIR.DIST_GUIDES, (err) => {
        if (err) {
            fancyLog(colors.red(`--- Failed to create ${options.DIR.DIST_GUIDES}`));

            return Promise.reject(err);
        }

        fs.writeFile(filePathToWrite, jsonOutput, (writeFileError) => {
            if (writeFileError) {
                fancyLog(colors.red('--- Failed to write guidefile guides.json'));

                return Promise.reject(writeFileError);
            }

            fancyLog(colors.green('--- sucessfully created guides.json'));
        });
    });
}

/**
 * Assembles the airport guide markdown into readable JSON, which
 * is itself a string of HTML.
 *
 * @returns {Promise.resolve} promise resolution
 */
function assembleMarkdown() {
    fancyLog(colors.green('--- Assembling guides.json from airportGuide markdown files'));

    let markdown = _generateAirportGuideDict();
    markdown = parseFiles(markdown);
    _writeFileOutput(markdown);

    return Promise.resolve();
}

module.exports = assembleMarkdown;
