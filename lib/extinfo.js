'use strict';
var fs = require( 'fs' );
var path = require( 'path' );
var Q = require( 'q' );
var extend = require( 'extend-shallow' );
var recursive = require( 'recursive-readdir' );
var glob = require( "glob" );

/**
 * Retrieve the meta information of a Qlik Sense extension + the unqiue name of the extension.
 * @returns {{fromFolder: Function, fromFile: Function}}
 * @constructor
 */
var ExtInfo = function () {

	// empty props definition
	//Todo: other props
	var defaultProps = {
		name: "",
		version: "",
		type: "visualization"
	};

	return {

		/**
		 * Retrieve the extension meta information from a folder.
		 *
		 * Doesn't search recursively, just in the root of the folder for any file matching the pattern *.qext
		 *
		 * Throws an exception in the following cases:
		 * - More than one qext files in the folder
		 * - content of the .qext file is not valid json
		 * - property `type` is missing
		 *
		 * @returns {object} extension meta information.
		 * @param folderPath Absolute path of the folder to search in.
		 */
		fromFolder: function ( folderPath ) {

			var that = this;

			var defer = Q.defer();

			var searchMask = folderPath + '*.qext';
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
		 * @param filePath Absolute path of the file to fetch the meta data from.
		 * @throws
		 *  - File doesn\'t exist in case of pointing to a non existing file
		 * @returns {promise|*|Q.promise}
		 */
		fromFile: function ( filePath ) {

			var defer = Q.defer();

			if ( fs.existsSync( filePath ) ) {
				fs.readFile( filePath, function ( err, data ) {

					if ( err ) {
						defer.reject( err );

					} else {

						var props = null;
						try {
							props = JSON.parse( data );
						} catch ( e ) {
							defer.reject( {message: 'Invalid JSON file', error: e} );
						}

						props.uniqueName = path.basename( filePath, '.qext' );
						props = extend( defaultProps, props );
						defer.resolve( props );

					}

				} );
			} else {
				defer.reject( 'File doesn\'s exist: ' + filePath );
			}

			return defer.promise;

		}
	};
};

module.exports = new ExtInfo();
