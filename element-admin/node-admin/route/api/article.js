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
router.get('/getArticlelist', (req, res) => {
    
    var  sql = 'SELECT bg_article.*, bg_cate.title as cate FROM bg_article left join bg_cate on bg_article.cate_id = bg_cate.id order by bg_article.o';

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
router.get('/getArticle/:id', (req, res) => {
    
  var  sql = 'SELECT * FROM bg_article where id = ' + req.params.id ;

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

//获取栏目列表
router.get('/getCatePid', (req, res) => {
    
  var  sql = 'SELECT * FROM bg_cate where pid <> 0';

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


//增加文章
router.post('/addArticle', (req, res) => {
    
    var  addSql = 'INSERT INTO bg_article(cate_id,title,content,o,status) VALUES(?,?,?,?,?)';
    // var  addSqlParams = req.body;
    var  addSqlParams = ['test', '1234560','180','男','2'];;
    addSqlParams[0] = req.body['cate_id'];
    addSqlParams[1] = req.body['title'];
    addSqlParams[2] = req.body['content'];
    addSqlParams[3] = req.body['o'];
    addSqlParams[4] = req.body['status'];
    console.log(req.body);
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
router.post("/editArticle", (req, res) => {

  var modSql = 'UPDATE bg_article SET cate_id = ? ,title = ? , content = ? ,o = ?, status = ? WHERE id = ?';
  // var modSql = 'UPDATE bg_article SET name = ? , password = ?  WHERE id = ?';
  var modSqlParams = [];
  // if (req.body.id) modSqlParams['id'] = req.body.id;
  modSqlParams[0] = req.body.cate_id;
  modSqlParams[1] = req.body.title;
  modSqlParams[2] = req.body.content;
  modSqlParams[3] = req.body.o;
  modSqlParams[4] = req.body.status;
  modSqlParams[5] = (req.body.id-0);
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
router.get("/deleteArticle/:id", (req, res) => {
  var delSql = 'DELETE FROM bg_article where id=' + req.params.id;
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
