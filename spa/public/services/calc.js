angular.module('app')

    /**
     * calcAverages service contains methods to calculate various averages
     * on data in a table
    **/
    .service('calcAverages', function() {
        /**
         *  Computes the average on a daily basis for all of the rows in the table
        **/
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
                avgArray.push({
                    date: key,
                    value: average[key]
                });
            }
            return avgArray;
        }
        
        /**
         * Gets the average for the week
        **/
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
    
    /**
     * 
    **/
    .service('calcSums', function() {
        /**
         *   lifetime returns the total number of tons of garbage collected 
         *   over the course of the current week
         * 
         *   @params run_table the run table from Fusiontables
         */
        this.forInterval = function(run_table,start,end) {
            var start = moment().startOf('week').format("YYYY-MM-DD hh:mm:ss");
            var total = 0;
            for (var i = run_table.length - 1; moment(run_table[i].start, "YYYY-MM-DD hh:mm:ss").isAfter(weekStart); i--) {
                total += Math.abs(parseInt(run_table[i].tons));
            }
            return total;
        }
        this.employeeCost = function(run) {
            var total = 0;
            if(run.isAssigned && typeof run.assigned != 'undefined') {
                run.assigned.forEach(function(d) {
                    total += Math.ceil(run.duration / 3600) * d.rate;
                });
                return total;
            }
            else if(run.isAssigned && typeof run.assigned == 'undefined'){
                console.error('run is assigned but property assigned is undefined');
                throw Error('RunAssignmentException');
            }
            return 0;
        }
    })