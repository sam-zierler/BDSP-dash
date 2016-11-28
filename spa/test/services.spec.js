var runTable = [{
    start: moment().subtract(2, 'weeks').format("YYYY-MM-DD hh:mm:ss"),
    isAssigned: false,
    tons: 10
}, {
    start: moment().subtract(1, 'weeks').format("YYYY-MM-DD hh:mm:ss"),
    isAssigned: true,
    tons: 10
}, {
    start: moment().format("YYYY-MM-DD hh:mm:ss"),
    isAssigned: true,
    assigned: [{
        rate: 10
    }, {
        rate: 5
    }, {
        rate: 5
    }],
    duration: 7200,
    tons: 10
}, {
    start: moment().subtract(1, 'hours').format("YYYY-MM-DD hh:mm:ss"),
    isAssigned: false,
    tons: 10
}, {
    start: moment().subtract(2, 'hours').format("YYYY-MM-DD hh:mm:ss"),
    isAssigned: false,
    tons: -10
}, ];

var runsFusionTable = {
    columns: ['tons', 'run', 'truckID', 'start', 'end'],
    rows: [
        ['10', '41', '1', '2016-01-01 03:04:05', '2016-01-01 03:07:05'],
        ['20', '2', '2', '2016-01-01 03:09:05', '2016-01-01 03:12:05']
    ]
};
var emplFusionTable = {
    columns: ['test', 'yes', 'empl_id'],
    rows: ['112', '421', '111']
};
var assignmentTableA = [{
    run_id: '12016-01-01 03:04:05',
    empl_id: '8',
    name: 'Gene Gardener',
    rate: 9
}, {
    run_id: '12016-01-01 03:04:05',
    empl_id: '3',
    name: 'Eustace Endicott',
    rate: 9
}];
var assignmentTableB = [];

describe('calc.js tests', function() {
    describe('calcSums service', function() {
        var calcSums;
        beforeEach(module('app'));
        beforeEach(inject(function(_calcSums_) {
            calcSums = _calcSums_;
        }));
        it('should add tonnage', function() {
            //assert.equal(30, calcSums.weekly(runTable), "employeeCost not correct in calc.js");
        });
        it('should calculate employee pay', function() {
            assert.equal(0, calcSums.employeeCost(runTable[0]), "pay not calculated correctly");
            expect(function() {
                calcSums.employeeCost(runTable[1]);
            }).to.throw(Error);
            assert.equal(40, calcSums.employeeCost(runTable[2]), "pay not calculated correctly");
            assert.equal(0, calcSums.employeeCost(runTable[3]), "pay not calculated correctly");
            assert.equal(0, calcSums.employeeCost(runTable[4]), "pay not calculated correctly");
        });
    });
    describe('calcAverages service', function() {
        var calcSums;
        beforeEach(module('app'));
        beforeEach(inject(function(_calcAverages_) {
            calcAverages = _calcAverages_;
        }));
        it('should calc daily average', function() {
            
        });
    });
});

describe('fusiontable.js tests', function() {
    describe('ftToArr service', function() {
        var ftToArr;
        beforeEach(module('app'));
        beforeEach(inject(function(_ftToArr_) {
            ftToArr = _ftToArr_;
        }));
        it('should convert fusion table object to a more usable object', function() {
            expect(function() {
                ftToArr.convert();
            }).to.throw(Error);
            var ft = ftToArr.convert(runsFusionTable)
            expect(ft).to.be.instanceof(Array);
            assert.equal(ft[0].tons, 10, 'conversion not correct');
        })
    });
    describe('fusionTables service', function() {
        var fusionTables, $httpBackend, $rootScope;
        beforeEach(module('app'));
        beforeEach(inject(function($injector, _fusionTables_) {
            fusionTables = _fusionTables_;
            $httpBackend = $injector.get('$httpBackend');

        }));

        it('should fetch a fusiontable', function() {
            $httpBackend.expectGET('/runs').respond(runsFusionTable);
            $httpBackend.expectGET('/employees').respond(emplFusionTable);
            $httpBackend.expectGET('/assignments/12016-01-01 03:04:05').respond(assignmentTableA);
            $httpBackend.expectGET('/assignments/22016-01-01 03:09:05').respond(assignmentTableB);
            $httpBackend.flush();
            expect(fusionTables.runsTable).is.not.null;
            expect(fusionTables.emplTable).is.not.null;
            assert.equal(fusionTables.runsTable[0].isAssigned, true, 'assigned flag not set properly');
            assert.equal(fusionTables.runsTable[1].isAssigned, false, 'assigned flag not set properly');
            assert.equal(fusionTables.runsTable[0].assigned.length, 2, 'missing employees in assigned table');
        });
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});