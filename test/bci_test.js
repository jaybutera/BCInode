var assert = require('assert');
// Chai
var chai = require("chai");
var expect = chai.expect;
// Chai-as-promised
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var openBCI = require('../lib/bci/bciFactory')
                .createOpenBCI({
                    verbose : false,
                    save : false,
                });

/*
var openBCIsim = require('../lib/bci/bciFactory')
                .createOpenBCI({
                    verbose : false,
                    save : false,
                    simulate : true,
                });

describe('Stream (simulate)', function() {
    describe('init', function () {
        it('should initialize bci', function () {
            return expect(openBCI.connect()).to.eventually.equal(null);
        });
    });
});
*/

describe('Stream', function() {
    describe('init', function () {
        it('should initialize bci', function () {
            return expect(openBCI.connect()).to.eventually.equal(null);
        });
    });
});
