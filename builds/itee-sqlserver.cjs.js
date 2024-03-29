console.log('Itee.Database.SQLServer v1.0.4 - CommonJs')
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var SqlServerDriver = require('tedious');
var iteeDatabase = require('itee-database');
var iteeValidators = require('itee-validators');

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () {
						return e[k];
					}
				});
			}
		});
	}
	n['default'] = e;
	return Object.freeze(n);
}

var SqlServerDriver__namespace = /*#__PURE__*/_interopNamespace(SqlServerDriver);

/**
 * @author [Ahmed DCHAR]{@link https://github.com/dragoneel}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

const DEFAULT_CONNECT_TIMEOUT        = 15 * 1000;
const DEFAULT_CLIENT_REQUEST_TIMEOUT = 15 * 1000;
const DEFAULT_CANCEL_TIMEOUT         = 5 * 1000;
const DEFAULT_CONNECT_RETRY_INTERVAL = 500;
const DEFAULT_PACKET_SIZE            = 4 * 1024;
const DEFAULT_TEXTSIZE               = 2147483647;
const DEFAULT_DATEFIRST              = 7;
const DEFAULT_PORT                   = 1433;
const DEFAULT_TDS_VERSION            = '7_4';
const DEFAULT_LANGUAGE               = 'us_english';
const DEFAULT_DATEFORMAT             = 'mdy';

class TSQLServerDatabase extends iteeDatabase.TAbstractDatabase {

    constructor ( parameters = {} ) {

        const _parameters = {
            ...{
                server:         'localhost',
                authentication: {
                    type:    [ 'default', 'ntlm', 'azure-active-directory-password', 'azure-active-directory-access-token' ][ 0 ],
                    options: {
                        userName: 'user',
                        password: 'password',
                        domain:   ''
                    }
                },
                options: {
                    abortTransactionOnError:  false,
                    appName:                  undefined,
                    camelCaseColumns:         false,
                    cancelTimeout:            DEFAULT_CANCEL_TIMEOUT,
                    columnNameReplacer:       undefined,
                    connectionRetryInterval:  DEFAULT_CONNECT_RETRY_INTERVAL,
                    connectTimeout:           DEFAULT_CONNECT_TIMEOUT,
                    //                    connectionIsolationLevel:         ISOLATION_LEVEL.READ_COMMITTED,
                    cryptoCredentialsDetails: {},
                    database:                 undefined,
                    datefirst:                DEFAULT_DATEFIRST,
                    dateFormat:               DEFAULT_DATEFORMAT,
                    debug:                    {
                        data:    false,
                        packet:  false,
                        payload: false,
                        token:   false
                    },
                    enableAnsiNull:                   true,
                    enableAnsiNullDefault:            true,
                    enableAnsiPadding:                true,
                    enableAnsiWarnings:               true,
                    enableArithAbort:                 false,
                    enableConcatNullYieldsNull:       true,
                    enableCursorCloseOnCommit:        null,
                    enableImplicitTransactions:       false,
                    enableNumericRoundabort:          false,
                    enableQuotedIdentifier:           true,
                    encrypt:                          false,
                    fallbackToDefaultDb:              false,
                    instanceName:                     undefined,
                    //                    isolationLevel:                   ISOLATION_LEVEL.READ_COMMITTED,
                    language:                         DEFAULT_LANGUAGE,
                    localAddress:                     undefined,
                    maxRetriesOnTransientErrors:      3,
                    multiSubnetFailover:              false,
                    packetSize:                       DEFAULT_PACKET_SIZE,
                    port:                             DEFAULT_PORT,
                    readOnlyIntent:                   false,
                    requestTimeout:                   DEFAULT_CLIENT_REQUEST_TIMEOUT,
                    rowCollectionOnDone:              false,
                    rowCollectionOnRequestCompletion: false,
                    tdsVersion:                       DEFAULT_TDS_VERSION,
                    textsize:                         DEFAULT_TEXTSIZE,
                    trustServerCertificate:           true,
                    useColumnNames:                   false,
                    useUTC:                           true
                }
            },
            ...parameters
        };

        _parameters.driver = {
            SqlServerDriver: SqlServerDriver__namespace,
            Connection:      new SqlServerDriver__namespace.Connection( _parameters ),
            Request:         SqlServerDriver__namespace.Request
        };

        super( _parameters );

    }

    close ( onCloseCallback ) {

        this.driver.Connection.close();
        onCloseCallback();

    }

    connect () {

        this.driver.Connection.on( 'connect', connectionError => {

            if ( connectionError ) {
                this.logger.error( connectionError );
                return
            }

            const config   = this.driver.Connection.config;
            const host     = config.server;
            const port     = config.options.port;
            const database = config.options.database;
            this.logger.log( `SQLServer at ms-sql-s://${host}:${port}/${database} is connected !` );

        } );

    }

    init () {
        super.init();

    }

    on ( /*eventName, callback*/ ) {}

}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @class TSQLServerController
 * @classdesc The TSQLServerController is the base class to perform CRUD operations on the database
 */

class TSQLServerController extends iteeDatabase.TAbstractDataController {

    constructor ( parameters = {} ) {

        const _parameters = {
            ...{
                driver:    null,
                tableName: '',
                columns:   []
            }, ...parameters
        };

        super( _parameters );

        this.tableName = _parameters.tableName;
        this.columns   = _parameters.columns;

    }

    get tableName () {
        return this._tableName
    }

    set tableName ( value ) {

        const valueName = 'Table name';
        const expect    = 'Expect an instance of String.';

        if ( iteeValidators.isNull( value ) ) { throw new TypeError( `${valueName} cannot be null ! ${expect}` ) }
        if ( iteeValidators.isUndefined( value ) ) { throw new TypeError( `${valueName} cannot be undefined ! ${expect}` ) }
        if ( iteeValidators.isNotString( value ) ) { throw new TypeError( `${valueName} cannot be an instance of ${value.constructor.name} ! ${expect}` ) }

        this._tableName = value;

    }

    get columns () {
        return this._columns
    }

    set columns ( value ) {

        const valueName = 'Columns';
        const expect    = 'Expect an array of strings.';

        if ( iteeValidators.isNull( value ) ) { throw new TypeError( `${valueName} cannot be null ! ${expect}` ) }
        if ( iteeValidators.isUndefined( value ) ) { throw new TypeError( `${valueName} cannot be undefined ! ${expect}` ) }
        if ( iteeValidators.isNotArrayOfString( value ) ) { throw new TypeError( `${valueName} cannot be an instance of ${value.constructor.name} ! ${expect}` ) }

        this._columns = value;

    }

    setTableName ( value ) {

        this.tableName = value;
        return this

    }

    setColumns ( value ) {

        this.columns = value;
        return this

    }

    _createMany ( datas, response ) {
        super._createMany( datas, response );

        const columns         = this.columns;
        const formatedColumns = columns.toString();

        let data           = null;
        let formatedValues = '';
        let value          = null;

        for ( let index = 0, numberOfDatas = datas.length ; index < numberOfDatas ; index++ ) {
            data = datas[ index ];

            formatedValues += `(`;
            for ( let key in data ) {

                if ( !columns.includes( key ) ) { continue }

                value = data[ key ];

                if ( iteeValidators.isString( value ) ) {
                    formatedValues += `'${value}', `;
                } else {
                    formatedValues += `${value}, `;
                }

            }
            formatedValues = formatedValues.slice( 0, -2 );
            formatedValues += `), `;

        }
        formatedValues = formatedValues.slice( 0, -2 );

        const query   = `INSERT INTO ${this._tableName} (${formatedColumns}) VALUES ${formatedValues}`;
        const request = new this._driver.Request( query, this.return( response ) );

        this._driver.Connection.execSql( request );

    }

    _createOne ( data, response ) {
        super._createOne( data, response );

        const columns = this.columns;

        let formatedColumns = '';
        let column          = null;
        let formatedValues  = '';
        let value           = null;
        for ( let index = 0, numberOfColumns = columns.length ; index < numberOfColumns ; index++ ) {
            column = columns[ index ];
            value  = data[ column ];

            if ( value ) {
                formatedColumns += `${column}, `;

                if ( iteeValidators.isString( value ) ) {
                    formatedValues += `'${value}', `;
                } else {
                    formatedValues += `${value}, `;
                }
            }
        }
        formatedColumns = formatedColumns.slice( 0, -2 );
        formatedValues  = formatedValues.slice( 0, -2 );

        const query   = `INSERT INTO ${this._tableName} (${formatedColumns}) VALUES (${formatedValues})`;
        const request = new this._driver.Request( query, this.return( response ) );

        this._driver.Connection.execSql( request );

    }

    _deleteAll ( response ) {
        super._deleteAll( response );

        const query   = `TRUNCATE TABLE ${this._tableName}`;
        const request = new this._driver.Request( query, this.return( response ) );

        this._driver.Connection.execSql( request );

    }

    _deleteMany ( ids, response ) {
        super._deleteMany( ids, response );

        const query   = `DELETE FROM ${this._tableName} WHERE id IN (${ids})`;
        const request = new this._driver.Request( query, this.return( response ) );

        this._driver.Connection.execSql( request );

    }

    _deleteOne ( id, response ) {
        super._deleteOne( id, response );

        const query   = `DELETE FROM ${this._tableName} WHERE id=${id}`;
        const request = new this._driver.Request( query, this.return( response ) );

        this._driver.Connection.execSql( request );

    }

    _deleteWhere ( query, response ) {
        super._deleteWhere( query, response );

        iteeDatabase.TAbstractDataController.returnError( 'Unimplemented methods (DELETE WHERE)', response );

    }

    _readAll ( projection, response ) {
        super._readAll( projection, response );

        const query   = `SELECT * FROM ${this.tableName}`;
        const request = new this._driver.Request( query, ( requestError, rowCount, results ) => {

            if ( requestError ) {

                iteeDatabase.TAbstractDataController.returnError( requestError, response );

            } else if ( results.length === 0 ) {

                iteeDatabase.TAbstractDataController.returnNotFound( response );

            } else {

                iteeDatabase.TAbstractDataController.returnData( results, response );

            }

        } );

        request.on( 'row', columns => {

            let result = {};
            columns.forEach( column => {

                result[ column.metadata.colName ] = column.value;

            } );

        } );

        this._driver.Connection.execSql( request );

    }

    _readMany ( ids, projection, response ) {
        super._readMany( ids, projection, response );

        const idsFormated = ids.toString();
        const query       = `SELECT * FROM ${this.tableName} WHERE id IN (${idsFormated})`;

        const request = new this._driver.Request( query, ( requestError, rowCount, results ) => {

            if ( requestError ) {

                iteeDatabase.TAbstractDataController.returnError( requestError, response );

            } else if ( results.length === 0 ) {

                iteeDatabase.TAbstractDataController.returnNotFound( response );

            } else {

                iteeDatabase.TAbstractDataController.returnData( results, response );

            }

        } );

        request.on( 'row', columns => {

            let result = {};
            columns.forEach( column => {

                result[ column.metadata.colName ] = column.value;

            } );

        } );

        this._driver.Connection.execSql( request );

    }

    _readOne ( id, projection, response ) {
        super._readOne( id, projection, response );

        const query   = `SELECT * FROM ${this.tableName} WHERE id=${id}`;
        const request = new this._driver.Request( query, ( requestError, rowCount, results ) => {

            if ( requestError ) {

                iteeDatabase.TAbstractDataController.returnError( requestError, response );

            } else if ( results.length === 0 ) {

                iteeDatabase.TAbstractDataController.returnNotFound( response );

            } else {

                iteeDatabase.TAbstractDataController.returnData( results, response );

            }

        } );

        request.on( 'row', columns => {

            let result = {};
            columns.forEach( column => {

                result[ column.metadata.colName ] = column.value;

            } );

        } );

        this._driver.Connection.execSql( request );

    }

    _readWhere ( query, projection, response ) {
        super._readWhere( query, projection, response );

        iteeDatabase.TAbstractDataController.returnError( 'Unimplemented methods (READ WHERE)', response );

    }

    _updateAll ( update, response ) {
        super._updateAll( update, response );

        let formatedUpdates = '';
        for ( let key in update ) {
            const formatedUpdate = update[ key ];
            if ( iteeValidators.isString( formatedUpdate ) ) {
                formatedUpdates += `${key} = '${formatedUpdate}', `;
            } else {
                formatedUpdates += `${key} = ${formatedUpdate}, `;
            }
        }
        formatedUpdates = formatedUpdates.slice( 0, -2 );

        const query   = `UPDATE ${this._tableName} SET ${formatedUpdates}`;
        const request = new this._driver.Request( query, this.return( response ) );

        this._driver.Connection.execSql( request );

    }

    _updateMany ( ids, updates, response ) {
        super._updateMany( ids, updates, response );

        let formatedUpdates = '';
        let formatedUpdate  = null;
        for ( let key in updates ) {
            formatedUpdate = updates[ key ];
            if ( iteeValidators.isString( formatedUpdate ) ) {
                formatedUpdates += `${key} = '${formatedUpdate}', `;
            } else {
                formatedUpdates += `${key} = ${formatedUpdate}, `;
            }
        }
        formatedUpdates = formatedUpdates.slice( 0, -2 );

        const query   = `UPDATE ${this._tableName} SET ${formatedUpdates} WHERE id IN (${ids})`;
        const request = new this._driver.Request( query, this.return( response ) );

        this._driver.Connection.execSql( request );

    }

    _updateOne ( id, update, response ) {
        super._updateOne( id, update, response );

        let formatedUpdates = '';
        let formatedUpdate  = null;
        for ( let key in update ) {
            formatedUpdate = update[ key ];
            if ( iteeValidators.isString( formatedUpdate ) ) {
                formatedUpdates += `${key} = '${formatedUpdate}', `;
            } else {
                formatedUpdates += `${key} = ${formatedUpdate}, `;
            }
        }
        formatedUpdates = formatedUpdates.slice( 0, -2 );

        const query   = `UPDATE ${this._tableName} SET ${formatedUpdates} WHERE id=${id}`;
        const request = new this._driver.Request( query, this.return( response ) );

        this._driver.Connection.execSql( request );

    }

    _updateWhere ( query, update, response ) {
        super._updateWhere( query, update, response );

        iteeDatabase.TAbstractDataController.returnError( 'Unimplemented methods (UPDATE WHERE)', response );

    }

}

exports.TSQLServerController = TSQLServerController;
exports.TSQLServerDatabase = TSQLServerDatabase;
//# sourceMappingURL=itee-sqlserver.cjs.js.map
