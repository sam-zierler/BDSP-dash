var mysql = require("mysql");

module.exports = {
    blank: function() { return {} },
    get: function(run_id, ret) {
        var conn = GetConnection();
        if(run_id === null) {
            var sql = 'SELECT * from gc';
            conn.query(sql, function(err, rows){
                ret(err,rows);
                conn.end();
            });
        }
        else {
            var sql = 'SELECT empl_id, rate, name from gc where run_id=?';
            conn.query(sql, [run_id], 
                  function(err, rows){
                  ret(err, rows);
                  conn.end();
             }); 
        }

    },
    save: function(row, ret) {
        var conn = GetConnection();
        var sql = "INSERT INTO gc "
            + "(run_id, empl_id, name, rate) "
            + "values (?, ?, ?, ?);" ;
        conn.query(sql, [row.run_id, row.empl_id, row.name, row.rate], 
            function(err, data){
            ret(err, row);
            conn.end();
        });
    },
    delete: function(row, ret) {
        var conn = GetConnection();
        var sql = "DELETE from gc WHERE run_id=? AND empl_id=? ;" ;
        conn.query(sql, [row.run_id, row.empl_id], 
            function(err, data){
            ret(err, row);
            console.log(row);
            console.log(err);
            conn.end();
        });
    }
};

function GetConnection(){
        var conn = mysql.createConnection({
          host: "localhost",
          user: "deisingj1",
          password: "",
          database: "c9"
        });
    return conn;
}