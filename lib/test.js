'use strict';
var fs = require( 'fs' );
var path = require( 'path' );
var Q = require( 'q' );
var extend = require( 'extend-shallow' );
var glob = require( "glob" );

/**
 * Retrieve the meta information of bla bla bla
 * @returns {{fromFolder: Function, fromFile: Function}}
 * @constructor
 * @api public
 */
var ExtInfo = function () {

    return {

        /**
         * Retrieve the extension meta information from a folder.         *
         * Doesn't search recursively, just in the root of the folder for any file matching the pattern *.qext
         *
         * @exception
         * Throws an exception in the following cases:
         * - More than one qext files in the folder
         * - content of the .qext file is not valid json
         * - property `type` is missing
         *
         * @returns {object} extension meta information.
         * @param folderPath Absolute path of the folder to search in.
         *
         * @api public

         * @todo - if ending slash is missing, the path is not recognized as a valid directory
         */
        fromDir: function ( folderPath ) {

            return 'xx';

        },

        /**
         * Retrieve meta information by pointing directly to the .qext file.
         * @param filePath Absolute path of the file to fetch the meta data from.
         * @throws
         *  - File doesn\'t exist in case of pointing to a non existing file
         * @returns {promise|*|Q.promise}
         *
         * @api public
         */
        fromFile: function ( filePath ) {

            return 'y';
        }
    };
};

module.exports = new ExtInfo();
