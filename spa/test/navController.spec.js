describe('navController tests', function() {
    var $controller;
    beforeEach(module('app'));
    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));
    describe('testing nav controller', function() {
        var $scope, navController;
        beforeEach(function() {
            $scope = {};
            $controller('navController', { $scope: $scope });
        });
        it('should work', function() {
            
        });
    });
})