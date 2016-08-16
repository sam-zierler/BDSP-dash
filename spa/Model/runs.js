var google = require('googleapis');
var API_KEY = 'AIzaSyAP6HP8YwGUXYu4AZ_syH2SjlxqfwkLHLU';
var tonsTableId = '1k9_64K9pd2eB5JiphqOD26JJpglwvy8uG4OaBSkC';

module.exports = {
    blank: function(){ return {} },
    get: function(ret) {
        var conn = google.fusiontables('v2');
        conn.query.sql({sql:"SELECT 'truckID', 'start', 'end', 'run', 'tons', 'distance' FROM " + tonsTableId + " ORDER BY 'start'", auth:API_KEY}, function(err, res) {
            ret(err, res);
        });
    },
    post: function(start, end, ret) {
        var conn = google.fusiontables('v2');
        conn.query.sql({sql:"SELECT 'start', 'tons', 'end' FROM " + tonsTableId + " where 'start' >= " + start + " AND 'start' <= " + end + " ORDER BY 'start'", auth:API_KEY}, function(err, res) {
            ret(err, res);
        });
    }
    
};

function getConnection() {
    var conn = new google.fusiontables('v2');
    return conn;
}