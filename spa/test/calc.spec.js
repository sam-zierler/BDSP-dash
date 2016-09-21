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
       
       var fusionTable = {
           columns: ['tons', 'c2_heading'],
           rows: [ ["10","3"], ["20", "3"] ]
       };
       
       describe('calc.js tests', function() {
           describe('calcSums service', function() {

               var calcSums;
               beforeEach(module('app'));
               beforeEach(inject(function(_calcSums_) {
                   calcSums = _calcSums_;
               }));
               it('should add tonnage', function() {
                   assert.equal(30, calcSums.lifetime(runTable), "employeeCost not correct in calc.js");
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
       });
       describe('fusiontable.js tests', function() {
           describe('fusiontables service', function(){
               var ftToArr;
               beforeEach(module('app'));
               beforeEach(inject(function(_ftToArr_){
                   ftToArr = _ftToArr_;
               }));
               it('should convert fusion table object to a more usable object', function() {
                   expect(function() {
                       ftToArr.convert();
                   }).to.throw(Error);
                   var ft = ftToArr.convert(fusionTable)
                   expect(ft).to.be.instanceof(Array);
                   assert.equal(ft[0].tons,10,'conversion not correct');
               })
           });
       }); 
/*
       describe('assignController test', function() {
           var assignController;
           var getFusionTable = {
            runsTable: function() { return run_table }
           };
           beforeEach(module('app'));
           beforeEach(inject(function(_assignController_) {
               assignController = _assignController_;
           }));
           it('should ', function() {
               var controller = $controller('assignController', { $scope: $scope, getFusionTable: getFusionTable });
               assert.equal($scope.showAssignedValue, true, "not workin");
           });
       });
*/