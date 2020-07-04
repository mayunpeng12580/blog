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
router.get('/getCatelist', (req, res) => {
    
    var  sql = 'SELECT * FROM bg_cate order by o';

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
router.get('/getCate/:id', (req, res) => {
    
  var  sql = 'SELECT * FROM bg_cate where id = ' + req.params.id ;

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
router.get('/getCatePid', (req, res) => {
    
  var  sql = 'SELECT * FROM bg_cate where pid = 0';

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
router.post('/addCate', (req, res) => {
    
    var  addSql = 'INSERT INTO bg_cate(title,pid,path,o) VALUES(?,?,?,?)';
    // var  addSqlParams = req.body;
    var  addSqlParams = ['test', '1234560','180','男','2'];;
    addSqlParams[0] = req.body['title'];
    addSqlParams[1] = req.body['pid'];
    addSqlParams[2] = req.body['path'];
    addSqlParams[3] = req.body['o'];
    
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
router.post("/editCate", (req, res) => {

  var modSql = 'UPDATE bg_cate SET title = ? , pid = ? ,path = ? ,o = ? WHERE id = ?';
  // var modSql = 'UPDATE bg_users SET name = ? , password = ?  WHERE id = ?';
  var modSqlParams = [];
  // if (req.body.id) modSqlParams['id'] = req.body.id;
  modSqlParams[0] = req.body.title;
  modSqlParams[1] = req.body.pid;
  modSqlParams[2] = req.body.path;
  modSqlParams[3] = req.body.o;
  modSqlParams[4] = (req.body.id-0);
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
router.get("/deleteCate/:id", (req, res) => {
  var delSql = 'DELETE FROM bg_cate where id=' + req.params.id;
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
