angular.module('app', ['ngRoute', 'ui.select', 'angularUtils.directives.dirPagination', 'ngSanitize', 'd3graphs.directives', 'gmaps.directives', 'panels.directives', 'moment-picker'])
			.config(function($routeProvider, $httpProvider) {
				$routeProvider.
				when('/runs', {
					templateUrl: 'views/runs-index.html',
					controller: 'runsController',
					controllerAs: 'vm'
				}).
				when('/employees', {
					templateUrl: 'views/emp-index.html',
					controller: 'employeesController',
					controllerAs: 'vm'
				}).
				when('/summary', {
					templateUrl: 'views/summary-index.html',
					controller: 'summaryController',
					controllerAs: 'vm'
				}).
				when('/assign', {
					templateUrl: 'views/assign-index.html',
					controller: 'assignController',
					controllerAs: 'vm'
				}).
				when('/stats', {
					templateUrl: 'views/stats-index.html',
					controller: 'statsController',
					controllerAs: 'vm'
				}).
				otherwise({
					redirectTo: '/summary'
				});
				//$httpProvider.defaults.cache = true;

			});