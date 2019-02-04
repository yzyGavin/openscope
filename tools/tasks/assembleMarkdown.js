const fs = require('fs');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const path = require('path');
const mkdirp = require('mkdirp');
const showdown = require('showdown');
const options = require('../options');

const sourceDir = options.DIR.ASSETS_GUIDES;
const destDir = options.DIR.DIST_GUIDES;

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
 * @method readMarkdownFiles
 * @returns {Object} filenames and data
 */
function readMarkdownFiles() {
    const input = {};

    fs.readdirSync(sourceDir).forEach(filename => {
        const filePath = path.join(sourceDir, filename);
        const fileData = fs.readFileSync(filePath, { encoding: 'utf8' });
        const icao = filename.split('.')[0];

        // If the file is empty, there is no guide, so we do not need to write it
        if (!fileData) {
            fancyLog(colors.yellow(`skipping airport: ${icao}, no guide found in file`));
            return;
        }

        input[icao] = fileData;
    });

    return input;
}

/**
 *
 * @param {Object} input 
 */
function parseFiles(input) {
    // adapted from stackoverflow:
    // https://stackoverflow.com/questions/921789/how-to-loop-through-a-plain-javascript-object-with-the-objects-as-members
    for (const key in input) {
        // skip if key is from prototype
        if (!input.hasOwnProperty(key)) continue;

        input[key] = _parseMarkdown(input[key]);
    }

    return input;
}

function _writeFileOutput(input) {
    const filePathToWrite = path.join(destDir, 'guides.json');
    const jsonOutput = JSON.stringify(input);

    mkdirp(destDir, err => {
        if (err) {
            fancyLog(colors.red(`Failed to write guidefile guides.json`));
            Promise.reject(err);
        }
        
        fs.writeFile(filePathToWrite, jsonOutput, err => {
            if (err) {
                fancyLog(colors.red(`Failed to write guidefile guides.json`));
                Promise.reject(err);
            }
        });
        fancyLog(colors.green(`--- Wrote guides to file guides.json`));
    });
}

/**
 * Assembles the airport guide markdown into readable JSON, which
 * is itself a string of HTML.
 */
function assembleMarkdown() {
    let markdown = readMarkdownFiles();

    markdown = parseFiles(markdown);
    _writeFileOutput(markdown);

    fancyLog(colors.green('--- Writing airport guide markdown to output'));
    

    return Promise.resolve();
}

module.exports = assembleMarkdown;