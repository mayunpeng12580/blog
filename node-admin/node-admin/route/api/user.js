const connection = require('../../db/index');
const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");

//使用body-parser中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// 设置跨域访问
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', req.headers.origin);//获取请求源 这样所有请求就都有访问权限了
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   next()
// });

//获取用户列表
router.get('/getUserlist', (req, res) => {
    
    var  sql = 'SELECT * FROM bg_users';

    //查询
    connection.query(sql, (err, result) => {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return  res.status(404).json('没有任何内容');
            }
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200);
            res.json(result);

    });


} ) 

//获取用户信息
router.get('/getUser/:id', (req, res) => {
    
  var  sql = 'SELECT * FROM bg_users where id = ' + req.params.id ;

  //查询
  connection.query(sql, (err, result) => {
          if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return  res.status(404).json('没有任何内容');
          }
          res.set("Access-Control-Allow-Origin", "*");
          res.status(200);
          res.json(result);

  });


} ) 


//增加用户
router.post('/addUser', (req, res) => {
    
    var  addSql = 'INSERT INTO bg_users(name,password,age,grender,uid) VALUES(?,?,?,?,?)';
    // var  addSqlParams = req.body;
    var  addSqlParams = ['test', '1234560','180','男','2'];;
    addSqlParams[0] = req.body['name'];
    addSqlParams[1] = req.body['password'];
    addSqlParams[2] = req.body['age'];
    addSqlParams[3] = req.body['grender'];
    addSqlParams[4] = req.body['uid']?req.body['uid']:"1";
    
    //增
    connection.query(addSql,addSqlParams, (err, result) => {
          res.set("Access-Control-Allow-Origin", "*");
            if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return res.status(404).json('添加失败');;
            }
            
            res.status(200);
            res.json(result);
    });
    
    // connection.end();

} ) 


//编辑用户信息
router.post("/editUser", (req, res) => {

  var modSql = 'UPDATE bg_users SET name = ? , password = ? ,age = ? ,grender = ? ,avr = ?,uid = ? WHERE id = ?';
  // var modSql = 'UPDATE bg_users SET name = ? , password = ?  WHERE id = ?';
  var modSqlParams = [];
  // if (req.body.id) modSqlParams['id'] = req.body.id;
  modSqlParams[0] = req.body.name;
  modSqlParams[1] = req.body.password;
  modSqlParams[2] = req.body.age;
  modSqlParams[3] = req.body.grender;
  modSqlParams[4] = req.body.avr;
  modSqlParams[5] = req.body.uid;
  modSqlParams[6] = (req.body.id-0);
  console.log(req.body);
  console.log(modSqlParams);

  //改
  connection.query(modSql,modSqlParams,function (err, result) {
    res.set("Access-Control-Allow-Origin", "*");
    if(err){
          return res.status(404).json('修改失败');;;
    }        
    
    res.status(200);
    res.json(result);
  });
  
  // connection.end();
 
})

//删除用户
router.get("/deleteUser/:id", (req, res) => {
  var delSql = 'DELETE FROM bg_users where id=' + req.params.id;
  //删
  connection.query(delSql,function (err, result) {
          if(err){
            console.log('[DELETE ERROR] - ',err.message);
            return res.status(404).json('删除失败');
          }        
          res.set("Access-Control-Allow-Origin", "*");
          res.status(200);
        res.json(result.affectedRows);
  });
  
  // connection.end();
})




module.exports = router;
