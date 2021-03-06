'use strict';
var fs = require( 'fs' );
var path = require( 'path' );
var Q = require( 'q' );
var glob = require( "glob" );
var S = require( 'string' );
var logger = require( './logger' );
var extend = require( 'extend-shallow' );

/**
 * Retrieve the meta information of a Qlik Sense visualization extension + the unique name of the extension.
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

            var that = this;

            var defer = Q.defer();

            var searchMask = S( path.normalize( folderPath ) ).ensureRight( '/' ) + '*.qext';
            var options = {};

            glob( searchMask, options, function ( err, files ) {

                if ( err ) {
                    defer.reject( {message: 'Error finding the .qext file', error: err} );
                } else {

                    // sanity check first, then return
                    if ( files.length > 1 ) {

                        defer.reject( {message: 'Found more than on file with the extension .qext', result: files} );

                    } else if ( files.length === 0 ) {

                        defer.reject( {message: 'Didn\'t find any .qext file in folder ' + folderPath} );

                    } else {

                        defer.resolve( that.fromFile( files[0] ) );

                    }
                }

            } );

            return defer.promise;

        },

        /**
         * Retrieve meta information by pointing directly to the .qext file.
         *
         * In addition to the defined meta data in the .qext file the following information will be added:
         *
         *    - _uniqueName - file path of the .qext file
         *    - _fullPath - full directory name
         *
         * @param filePath Absolute path of the file to fetch the meta data from.
         * @throws
         *  - File doesn\'t exist in case of pointing to a non existing file
         * @returns {promise|*|Q.promise}
         *
         * @api public
         */
        fromFile: function ( filePath ) {

            var defer = Q.defer();

            if ( fs.existsSync( filePath ) ) {
                fs.readFile( filePath, function ( err, data ) {

                    if ( err ) {
                        defer.reject( err );

                    } else {

                        var props = {};
                        try {
                            props = extend( props, JSON.parse( data ) );
                        } catch ( e ) {

                            // Do not throw the error, since we also want to keep track of invalid json files
                            // Instead just mark the file as _invalidJson
                            //defer.reject( {message: 'Invalid JSON file', error: e} );
                            props._invalidJson = true;
                        }

                        props._uniqueName = path.basename( filePath, '.qext' );
                        props._fullPath = path.dirname( filePath );
                        defer.resolve( props );

                    }

                } );
            } else {
                defer.reject( 'File doesn\'t exist: ' + filePath );
            }

            return defer.promise;

        }
    };
};

module.exports = new ExtInfo();
