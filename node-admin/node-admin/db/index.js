const mysql = require('mysql');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'el_blog'
})

//连接数据库
connection.connect();


module.exports = connection;