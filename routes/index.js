var express = require('express');
var router = express.Router();
const redis = require('redis');
var config = require('../config.js');

var client  = redis.createClient(config.redis.port, '127.0.0.1');
console.log(config.redis.pwd);
// client.auth(config.redis.pwd);
// client.select(config.redis.db);

/* GET home page. */
router.get('/', function(req, res, next) {
 console.log('初始页');
 // var isPhone = true;
 var isPhone = false;
 var agentID = req.headers['user-agent'].toLowerCase().search(/(iphone|ipod|ipad|android)/);
 if (agentID) {
     isPhone = true;
 } else {
     isPhone = false;
 }
 var openid = req.query.openid || '';
 var access_token = req.query.access_token || '';
 superagent
     .get('https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN')
     .end(function(err, res4) {
         if (res4.text.indexOf('errcode') > 0 && isPhone) {
             var state = encodeURIComponent(('/'+req.url).split('&openid')[0]);
             // var state = encodeURIComponent('/pay/pay?id=960'.split('&openid')[0]);
             console.log(state);
             console.log('openid为空--------- ');
             console.log(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state);
             superagent
                 .get(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state)
                 .end(function(err, res3) {
                     if (res3 !== undefined && res3.ok) {
                         res.redirect(res3.text);
                         return;
                     } else {
                         console.error('微信授权错误。');
                         logger.error('微信授权错误。');
                         res.render('error', {});
                     }
                 });
         } else {
             console.log(' 正常请求---------- ');
             console.log('用户信息-----------'+res4);
             var orderId = req.query.id;
             res.render('welcome',{'orderId':orderId});
         }
     });
 // res.render('welcome');
});

router.get('/welcome', function(req, res, next) {
 console.log('初始页');
 // var isPhone = true;
 var isPhone = false;
 var agentID = req.headers['user-agent'].toLowerCase().search(/(iphone|ipod|ipad|android)/);
 if (agentID) {
     isPhone = true;
 } else {
     isPhone = false;
 }
 var openid = req.query.openid || '';
 var access_token = req.query.access_token || '';
 superagent
     .get('https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN')
     .end(function(err, res4) {
         if (res4.text.indexOf('errcode') > 0 && isPhone) {
             var state = encodeURIComponent(('/'+req.url).split('&openid')[0]);
             // var state = encodeURIComponent('/pay/pay?id=960'.split('&openid')[0]);
             console.log(state);
             console.log('openid为空--------- ');
             console.log(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state);
             superagent
                 .get(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state)
                 .end(function(err, res3) {
                     if (res3 !== undefined && res3.ok) {
                         res.redirect(res3.text);
                         return;
                     } else {
                         console.error('微信授权错误。');
                         logger.error('微信授权错误。');
                         res.render('error', {});
                     }
                 });
         } else {
             console.log(' 正常请求---------- ');
             console.log('用户信息-----------'+res4);
             var orderId = req.query.id;
             res.render('welcome',{'orderId':orderId});
         }
     });
});

router.get('/page_thailand', function(req, res, next) {
 res.render('page_thailand');
});

router.get('/page_korea', function(req, res, next) {
 res.render('page_korea') ;
});

router.get('/page_japan', function(req, res, next) {
 res.render('page_japan');
});

router.get('/page_britain', function(req, res, next) {
 res.render('page_britain');
});

router.get('/page_american', function(req, res, next) {
 res.render('page_american');
});

router.get('/page_dubai', function(req, res, next) {
 res.render('page_dubai');
});

router.post('/pass',function (req,res,next) {


})

module.exports = router;
