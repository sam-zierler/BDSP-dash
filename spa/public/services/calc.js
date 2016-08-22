angular.module('app')
    .service('calcAverages', function() {
        this.dailyAverages = function(tbl) {
            var average = {};
            var avgArray = [];
            var numOfTerms = {};
            tbl.forEach(function(d) {
                if (typeof average[d.start.substring(0, 10)] !== "undefined") {
                    average[d.start.substring(0, 10)] += parseInt(d.tons);
                    numOfTerms[d.start.substring(0, 10)]++;
                }
                else {
                    average[d.start.substring(0, 10)] = parseInt(d.tons);
                    numOfTerms[d.start.substring(0, 10)] = 1;
                }
            });
            for (var key in average) {
                average[key] = (average[key] / numOfTerms[key]);
                avgArray.push({
                    date: key,
                    value: average[key]
                });
            }
            return avgArray;
        }
        this.weeklyAverages = function(tbl) {
            var average = {};
            var avgArray = [];
            var numOfTerms = {};
            tbl.forEach(function(d) {
                var week = moment(d.start, "YYYY-MM-DD hh:mm:ss");
                var weekYearStr = week.week() + "-" + week.year();
                if (typeof average[weekYearStr] !== "undefined") {
                    average[weekYearStr] += parseInt(d.tons);
                    numOfTerms[weekYearStr]++;
                }
                else {
                    average[weekYearStr] = parseInt(d.tons);
                    numOfTerms[weekYearStr] = 1;
                }
            });
            for (var key in average) {
                average[key] = (average[key] / numOfTerms[key]);
                avgArray.push({
                    date: key,
                    value: average[key]
                });
            }
            return avgArray;
        }
        this.lifeTimeAverage = function(tbl) {
            var total = 0;
            var numOfTerms = 0;
            tbl.forEach(function(d) {
                total += parseInt(d.tons);
                numOfTerms++;
            });
            return total / numOfTerms;
        }
    })
    .service('calcSums', function() {
        this.lifetime = function(run_table) {
            var weekStart = moment().startOf('week').format("YYYY-MM-DD hh:mm:ss");
            var total = 0;
            for (var i = run_table.length - 1; moment(run_table[i].start, "YYYY-MM-DD hh:mm:ss").isAfter(weekStart); i--) {
                total += parseInt(run_table[i].tons);
            }
            return total;
        }
    })