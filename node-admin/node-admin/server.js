const express = require('express');
const app = express();
const bodyParser = require("body-parser");

//使用body-parser中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


// //设置跨域访问
  // app.all('*', function(req, res, next) {
  //   　　//设置允许跨域的域名，*代表允许任意域名跨域
  //       res.set("Access-Control-Allow-Origin", "*");
  //   　　//允许的header类型
  //       res.header('Access-Control-Allow-Headers', 'Content-type');
  //   　　//跨域允许的请求方式
  //       res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
  //   　　//可选，用来指定本次预检请求的有效期，单位为秒。在此期间，不用发出另一条预检请求。
  //       res.header('Access-Control-Max-Age',1728000);//预请求缓存20天
  //       next(); 
  //   });






//引入user.js
const rules = require("./route/api/rules");
const user = require("./route/api/user");
//引入cate.js
const cate = require("./route/api/cate");
//引入article.js
const article = require("./route/api/article");
 
app.get('/', function (req, res) {
   res.send('Hello World');
})


app.use("/api/user", user);
app.use("/api/rules", rules);
app.use("/api/cate", cate);
app.use("/api/article", article);


 
const server = app.listen(9000, function () {

  const host = server.address().address;
  const port = server.address().port;
 
  console.log(`应用实例，访问地址为 http:${host}:${port}`);
 
})