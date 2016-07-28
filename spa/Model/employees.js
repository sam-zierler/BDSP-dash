var google = require('googleapis');
var API_KEY = 'AIzaSyAP6HP8YwGUXYu4AZ_syH2SjlxqfwkLHLU';
var empTableId = '1N5MESRSevHsiuQilArUgqb_QDaxCyBk-HhMMh_3f';

module.exports = {
    blank: function(){ return {} },
    get: function(ret) {
        var conn = google.fusiontables('v2');
        conn.query.sql({sql:"SELECT * FROM " + empTableId + " ORDER BY 'LastName'", auth:API_KEY}, function(err, res) {
            ret(err, res);
        });
    }
};

function getConnection() {
    var conn = new google.fusiontables('v2');
    return conn;
}