'use strict';
var chai = require( 'chai' );
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect();
var extInfo = require( './../lib/extinfo' );
var path = require( 'path' );

describe( 'extinfo', function () {

    it( 'should return basic information for a single file', function ( done ) {

        extInfo.fromFile( path.join( __dirname, './fixtures/basic/sample1.qext' ) )
            .then( function ( data ) {

                data.should.not.be.empty;
                assert( typeof(data) === 'object' );
                data.should.have.deep.property( 'version', '0.0.1' );
                data.should.have.deep.property( 'name', 'Sample 1' );
                done();

            } )
            .catch( function ( data ) {
                console.error( 'Error:', data );
                assert( false );
                done();
            } );

    } );

    it( 'should return exinfo properly (by dir without /)', function ( done ) {

        extInfo.fromDir( path.join( __dirname, './fixtures/basic' ) )
            .then( function ( data ) {
                data.should.not.be.empty;
                assert( typeof(data) === 'object' );
                data.should.have.deep.property( 'version', '0.0.1' );
                data.should.have.deep.property( 'name', 'Sample 1' );
                done();

            } )
            .catch( function ( data ) {
                console.error( 'Error: ', data );
                assert( false );
                done();
            } );
    } );

    it( 'should return exinfo properly (by dir with /)', function ( done ) {

        extInfo.fromDir( path.join( __dirname, './fixtures/basic/' ) )
            .then( function ( data ) {
                data.should.not.be.empty;
                assert( typeof(data) === 'object' );
                data.should.have.deep.property( 'version', '0.0.1' );
                data.should.have.deep.property( 'name', 'Sample 1' );
                done();

            } )
            .catch( function ( data ) {
                console.error( 'Error: ', data );
                assert( false );
                done();
            } );
    } );

} );
