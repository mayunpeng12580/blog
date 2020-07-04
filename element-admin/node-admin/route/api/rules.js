const connection = require('../../db/index');
const express = require("express");
const router = express.Router();

//获取权限列表
router.get('/getAccesslist', (req, res) => {
    
    var  sql = 'SELECT * FROM bg_access';

    //查询
    connection.query(sql, (err, result) => {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return  res.status(404).json('没有任何内容');
            }

            res.json(result);

    });

    connection.end();

} ) 


//增加权限
router.post('/addAccess', (req, res) => {
    
    var  addSql = 'INSERT INTO bg_access(name,url,alexa,country) VALUES(?,?,?,?)';
    var  addSqlParams = req.body;
    //增
    connection.query(addSql,addSqlParams, (err, result) => {
            if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return res.status(404).json('添加失败');;
            }        
    
          res.json(result);
    });
    
    connection.end();

} ) 


//编辑信息
router.post("/editAccess/:uid", (req, res) => {

  var modSql = 'UPDATE bg_access SET name = ?,url = ? WHERE uid = ' + req.params.uid;
  var modSqlParams = {};
  if (req.body.uid) modSqlParams['uid'] = req.body.uid;
  if (req.body.group_id) modSqlParams['group_id'] = req.body.group_id;

  //改
  connection.query(modSql,modSqlParams,function (err, result) {
    if(err){
          return res.status(404).json('添加失败');;;
    }        
    res.json(result);
  });
  
  connection.end();
 
})

//删除信息
router.get("/deleteAccess/:uid", (req, res) => {
  var delSql = 'DELETE FROM bg_access where group_id=' + req.params.uid;
  //删
  connection.query(delSql,function (err, result) {
          if(err){
            console.log('[DELETE ERROR] - ',err.message);
            return res.status(404).json('删除失败');
          }        
  
        res.json(result.affectedRows);
  });
  
  connection.end();
})




module.exports = router;
