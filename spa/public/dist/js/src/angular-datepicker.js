(function (angular) {
	'use strict';
	
	var momentPickerProvider = (function () {
		var defaults;
		
		function momentPickerProvider() {
			defaults = {
				locale:        'en',
				format:        'L LTS',
				minView:       'month',
				maxView:       'month',
				startView:     'month',
				today:         false,
				autoclose:     true,
				leftArrow:     '&larr;',
				rightArrow:    '&rarr;',
				yearsFormat:   'YYYY',
				monthsFormat:  'MMM',
				daysFormat:    'D',
				hoursFormat:   'HH:[00]',
				secondsFormat: 'ss',
				minutesStep:   5,
				secondsStep:   1
			};
		}
		momentPickerProvider.prototype.options = function (options) {
			angular.extend(defaults, options);
			return angular.copy(defaults);
		};
		momentPickerProvider.prototype.$get = function () {
			return defaults;
		};
		
		return momentPickerProvider;
	})();
	
	var $timeout, $sce, $compile, $document, $window, momentPicker;
	
	var MomentPickerDirective = (function () {
		
		// Utility
		function getOffset(element) {
			var docElem, win, rect, doc;
			if (!element) return;
			if (!element.getClientRects().length) return { top: 0, left: 0 };
			rect = element.getBoundingClientRect();
			if (!rect.width && !rect.height) return rect;
			doc = element.ownerDocument;
			win = doc != null && doc === doc.window ? element : doc.nodeType === 9 && doc.defaultView;
			docElem = doc.documentElement;
			return {
				top: rect.top + win.pageYOffset - docElem.clientTop,
				left: rect.left + win.pageXOffset - docElem.clientLeft
			};
		}
		
		// Directive
		function MomentPickerDirective(timeout, sce, compile, document, window, momentPickerProvider) {
			this.restrict = 'A',
			this.scope = {
				model:     '=momentPicker',
				locale:    '@?',
				format:    '@?',
				minView:   '@?',
				maxView:   '@?',
				startView: '@?',
				minDate:   '=?',
				maxDate:   '=?',
				today:     '=?',
				disabled:  '=?disable',
				autoclose: '=?',
				change:    '&?'
			};
			$timeout     = timeout;
			$sce         = sce;
			$compile     = compile;
			$document    = document;
			$window      = window;
			momentPicker = momentPickerProvider;
		}
		MomentPickerDirective.prototype.$inject = ['$timeout', '$sce', '$compile', '$document', '$window', 'momentPicker'];
		MomentPickerDirective.prototype.link = function ($scope, $element, $attrs) {
			$scope.template = (
				'<div class="moment-picker-container {{view.selected}}-view" ' +
					'ng-show="view.isOpen && !disabled" ng-class="{\'moment-picker-disabled\': disabled, \'open\': view.isOpen}">' +
					'<table class="header-view">' +
						'<thead>' +
							'<tr>' +
								'<th ng-class="{disabled: !view.previous.selectable}" ng-bind-html="view.previous.label" ng-click="view.previous.set()"></th>' +
								'<th ng-bind="view.title" ng-click="view.setParentView()"></th>' +
								'<th ng-class="{disabled: !view.next.selectable}" ng-bind-html="view.next.label" ng-click="view.next.set()"></th>' +
							'</tr>' +
						'</thead>' +
					'</table>' +
					'<div class="moment-picker-specific-views">' +
						'<table ng-if="view.selected == \'month\'">' +
							'<thead>' +
								'<tr>' +
									'<th ng-repeat="day in monthView.days" ng-bind="day"></th>' +
								'</tr>' +
							'</thead>' +
							'<tbody>' +
								'<tr ng-repeat="days in monthView.weeks">' +
									'<td ng-repeat="day in days track by day.date" ng-class="day.class" ng-bind="day.label" ng-click="monthView.setDate(day)"></td>' +
								'</tr>' +
							'</tbody>' +
						'</table>' +
					'</div>' +
				'</div>'
			);
			
			// one-way binding attributes
			angular.forEach(['locale', 'format', 'minView', 'maxView', 'startView', 'today', 'leftArrow', 'rightArrow', 'autoclose'], function (attr) {
				if (!angular.isDefined($scope[attr])) $scope[attr] = momentPicker[attr];
				if (!angular.isDefined($attrs[attr])) $attrs[attr] = $scope[attr];
			});
			
			// utilities
			$scope.momentToDate = function (value) { return angular.isDefined(value) && value.isValid() ? value.clone().toDate() : undefined; };
			$scope.valueUpdate = function () { if (!$scope.disabled) $scope.value = $scope.momentToDate($scope.valueMoment); };
			$scope.limits = {
				isAfterOrEqualMin: function (value, precision) {
					return !angular.isDefined($scope.minDateMoment) || value.isAfter($scope.minDateMoment, precision) || value.isSame($scope.minDateMoment, precision);
				},
				isBeforeOrEqualMax: function (value, precision) {
					return !angular.isDefined($scope.maxDateMoment) || value.isBefore($scope.maxDateMoment, precision) || value.isSame($scope.maxDateMoment, precision);
				},
				isSelectable: function (value, precision) {
					return $scope.limits.isAfterOrEqualMin(value, precision) && $scope.limits.isBeforeOrEqualMax(value, precision);
				},
				checkValue: function () {
					if (!angular.isDefined($scope.valueMoment)) return;
					if (!$scope.limits.isAfterOrEqualMin($scope.valueMoment)) $scope.valueUpdate($scope.valueMoment = $scope.minDateMoment.clone());
					if (!$scope.limits.isBeforeOrEqualMax($scope.valueMoment)) $scope.valueUpdate($scope.valueMoment = $scope.maxDateMoment.clone());
				},
				checkView: function () {
					if (!angular.isDefined($scope.view.moment)) $scope.view.moment = moment().locale($scope.locale);
					if (!$scope.limits.isAfterOrEqualMin($scope.view.moment)) $scope.view.moment = $scope.minDateMoment.clone();
					if (!$scope.limits.isBeforeOrEqualMax($scope.view.moment)) $scope.view.moment = $scope.maxDateMoment.clone();
					$scope.view.update();
				}
			};
			
			$scope.views = {
				all: ['month'],
				// for each view, `$scope.views.formats` object contains the available moment formats
				// formats present in more views are used to perform min/max view detection (i.e. 'LTS', 'LT', ...)
				formats: {
					'month':	'[Dd]{1,4}(?![Ddo])|DDDo|[Dd]o|[Ww]{1,2}(?![Wwo])|[Ww]o|[Ee]|L{1,2}(?!T)|l{1,2}',
								/* formats: D,DD,DDD,DDDD,d,dd,ddd,dddd,DDDo,Do,do,W,WW,w,ww,Wo,wo,E,e,L,LL,l,ll */
				},
			};
			$scope.view = {
				isOpen: false,
				selected: $scope.startView,
				update: function () { $scope.view.value = $scope.momentToDate($scope.view.moment); },
				toggle: function () { $scope.view.isOpen ? $scope.view.close() : $scope.view.open(); },
				open: function () {
					// close every open picker
					// this is required because every picker stops click event propagation
					angular.forEach($document[0].querySelectorAll('.moment-picker-container.open'), function (element) {
						((angular.element(element).scope().view || {}).close || angular.noop)();
					});
					if (!$scope.disabled) $scope.view.isOpen = true;
					$timeout($scope.view.position, 0, false);
				},
				close: function () {
					$scope.view.isOpen = false;
					$scope.view.selected = $scope.startView;
				},
				position: function () {
					$scope.picker.removeClass('top').removeClass('left');
					
					var container = $scope.container[0],
						offset    = getOffset(container),
						top       = offset.top - $window.pageYOffset,
						left      = offset.left - $window.pageXOffset,
						winWidth  = $window.innerWidth,
						winHeight = $window.innerHeight;
					
					if (top + $window.pageYOffset - container.offsetHeight > 0 && top > winHeight / 2) $scope.picker.addClass('top');
					if (left + container.offsetWidth > winWidth) $scope.picker.addClass('left');
				},
				// utility
				unit: function () { return $scope.view.selected == 'decade' ? 10 : 1; },
				precision: function () { return $scope.view.selected.replace('decade', 'year'); },
				// header
				title: '',
				previous: {
					label: $sce.trustAsHtml($scope.leftArrow),
					selectable: true,
					set: function () {
						if ($scope.view.previous.selectable) $scope.view.update($scope.view.moment.subtract($scope.view.unit(), $scope.view.precision()).toDate());
					}
				},
				next: {
					selectable: true,
					label: $sce.trustAsHtml($scope.rightArrow),
					set: function () {
						if ($scope.view.next.selectable) $scope.view.update($scope.view.moment.add($scope.view.unit(), $scope.view.precision()).toDate());
					}
				},
				setParentView: function () { $scope.view.change($scope.views.all[ Math.max(0, $scope.views.all.indexOf($scope.view.selected) - 1) ]); },
				// body
				render: function () {
					var momentPrevious = $scope.view.moment.clone().startOf($scope.view.precision()).subtract($scope.view.unit(), $scope.view.precision()),
						momentNext     = $scope.view.moment.clone().endOf($scope.view.precision()).add($scope.view.unit(), $scope.view.precision());
					
					$scope.view.previous.selectable = $scope.limits.isAfterOrEqualMin(momentPrevious, $scope.view.precision());
					$scope.view.previous.label      = $sce.trustAsHtml($scope.view.previous.selectable ? $scope.leftArrow : '&nbsp;');
					$scope.view.next.selectable     = $scope.limits.isBeforeOrEqualMax(momentNext, $scope.view.precision());
					$scope.view.next.label          = $sce.trustAsHtml($scope.view.next.selectable ? $scope.rightArrow : '&nbsp;');
					$scope.view.title               = $scope[$scope.view.selected + 'View'].render();
				},
				change: function (view) {
					var nextView = $scope.views.all.indexOf(view),
						minView  = $scope.views.all.indexOf($scope.minView),
						maxView  = $scope.views.all.indexOf($scope.maxView);
					
					if (nextView < 0 || nextView > maxView) {
						$scope.valueUpdate($scope.valueMoment = $scope.view.moment.clone());
						if ($scope.autoclose) $scope.view.close();
					} else if (nextView >= minView) $scope.view.selected = view;
				}
			};
			// month view
			$scope.monthView = {
				days: (function () {
					var days = [],
						day  = moment().locale($scope.locale).startOf('week');
					for (var i = 0; i < 7; i++) {
						days.push(day.format('dd'));
						day.add(1, 'days');
					}
					return days;
				})(),
				weeks: [],
				render: function () {
					var month     = $scope.view.moment.month(),
						day       = $scope.view.moment.clone().startOf('month').startOf('week'),
						weeks     = {},
						firstWeek = day.week(),
						lastWeek  = firstWeek + 5;
					
					$scope.monthView.weeks = [];
					for (var w = firstWeek; w <= lastWeek; w++)
						weeks[w] = '0000000'.split('').map(function () {
							var selectable = $scope.limits.isSelectable(day, 'day'),
								d = {
									label: day.format(momentPicker.daysFormat),
									year:  day.year(),
									date:  day.date(),
									month: day.month(),
									class: [
										!!$scope.today && day.isSame(new Date(), 'day') ? 'today' : '',
										!selectable || day.month() != month ? 'disabled' : day.isSame($scope.valueMoment, 'day') ? 'selected' : ''
									].join(' ').trim(),
									selectable: selectable
								};
							day.add(1, 'days');
							return d;
						});
					// object to array - see https://github.com/indrimuska/angular-moment-picker/issues/9
					angular.forEach(weeks, function (week) {
						$scope.monthView.weeks.push(week);
					});
					// return title
					return $scope.view.moment.format('MMMM YYYY');
				},
				setDate: function (day) {
					if (!day.selectable) return;
					$scope.view.update($scope.view.moment.year(day.year).month(day.month).date(day.date));
					$scope.view.change('day');
				}
			};

			// creation
			$scope.picker = angular.element('<span class="moment-picker"></span>');
			$element.after($scope.picker);
			$scope.contents = $element.addClass('moment-picker-contents').removeAttr('moment-picker');
			$scope.container = $compile($scope.template)($scope);
			$scope.picker.append($scope.contents);
			$scope.picker.append($scope.container);
			
			// initialization
			$scope.limits.checkView();
			
			// properties listeners
			$scope.$watch('model', function (model) {
				if (angular.isDefined(model)) {
					$scope.valueMoment = moment(model, $scope.format, $scope.locale);
					if (!$scope.valueMoment.isValid())
						$scope.valueMoment = undefined;
					else {
						$scope.view.moment = $scope.valueMoment.clone();
						$scope.view.update();
					}
				}
				$scope.valueUpdate($scope.valueMoment);
				$scope.limits.checkValue();
			});
			$scope.$watch('value', function () {
				if (!angular.isDefined($scope.valueMoment)) return;
				var oldValue = $scope.model,
					newValue = $scope.valueMoment.format($scope.format);
				if (newValue != oldValue)
					$timeout(function () {
						$scope.view.update($scope.view.moment = $scope.valueMoment.clone());
						$scope.model = newValue;
						if (angular.isFunction($scope.change))
							$timeout(function () {
								$scope.change({ newValue: newValue, oldValue: oldValue });
							}, 0, false);
					});
			});
			$scope.$watch('[view.selected, view.value]', $scope.view.render, true);

			$scope.$watch('[minDate, maxDate]', function () {
				angular.forEach(['minDate', 'maxDate'], function (limitValue) {
					if (angular.isDefined($scope[limitValue])) {
						$scope[limitValue + 'Moment'] = moment($scope[limitValue], $scope.format, $scope.locale);
						if (!$scope[limitValue + 'Moment'].isValid())
							$scope[limitValue + 'Moment'] = undefined;
					}
				});
				$scope.limits.checkValue();
				$scope.limits.checkView();
				$scope.view.render();
			}, true);
			
			// open/close listeners
			$document.on('click', function () { if ($scope.view.isOpen) $timeout($scope.view.close); });
			$scope.container.on('click', function (e) { e.stopPropagation(); });
			$scope.contents.on('click', function (e) {
				e.stopPropagation();
				if (!$scope.view.isOpen) $timeout($scope.view.open);
			});
			angular.element($scope.contents[0].querySelector('input')).on('focus', function () { if (!$scope.view.isOpen) $timeout($scope.view.open); });
			angular.element($window).on('resize', $scope.view.position);
		};
		
		return MomentPickerDirective;
	})();
	
	angular
		.module('moment-picker', [])
		.provider('momentPicker', [function () {
			return new momentPickerProvider();
		}])
		.directive('momentPicker', [
			'$timeout', '$sce', '$compile', '$document', '$window', 'momentPicker',
			function ($timeout, $sce, $compile, $document, $window, momentPicker) {
				return new MomentPickerDirective($timeout, $sce, $compile, $document, $window, momentPicker);
			}
		]);
	
})(window.angular);