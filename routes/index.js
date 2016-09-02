var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var redis = require('redis');
var config = require('../config.js');
var client  = redis.createClient(config.redis.port, '127.0.0.1');
// console.log(config.redis.pwd);
// client.auth(config.redis.pwd);
// client.select(config.redis.db);

/* GET home page. */
router.get('/welcome', function(req, res, next) {
 console.log('初始页');
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
             var state = encodeURIComponent((req.url).split('&openid')[0]);
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
             var info = JSON.stringify(res4);
             console.log('用户信息-----------'+res4);
             var orderId = req.query.id;
             res.render('welcome');
         }
     });
});

router.get('/page_thailand', function(req, res, next) {
 res.render('page_thailand');
});
router.get('/wrong_thailand', function(req, res, next) {
 res.render('wrong_thailand');
});
router.get('/share_thailand', function(req, res, next) {
 res.render('share_thailand');
});

router.get('/page_korea', function(req, res, next) {
 res.render('page_korea') ;
});
router.get('/wrong_korea', function(req, res, next) {
 res.render('wrong_korea');
});
router.get('/share_korea', function(req, res, next) {
 res.render('share_korea');
});

router.get('/page_japan', function(req, res, next) {
 res.render('page_japan');
});
router.get('/wrong_japan', function(req, res, next) {
 res.render('wrong_japan');
});
router.get('/share_japan', function(req, res, next) {
 res.render('share_japan');
});

router.get('/page_britain', function(req, res, next) {
 res.render('page_britain');
});
router.get('/wrong_britain', function(req, res, next) {
 res.render('wrong_britain');
});
router.get('/share_britain', function(req, res, next) {
 res.render('share_britain');
});

router.get('/page_american', function(req, res, next) {
 var thisUrl = req.url;
 var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
 // console.log(thisUrl);
 console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
 superagent
   .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
   .end(function(err2, res2) {
     if (res2 !== undefined && res2.ok) {
       res2.body.browserUrl = global.browserURL;
       res.render('page_american', res2.body);
     } else {
       console.error('微信分享api错误。');
     }
   });
});
router.get('/wrong_american', function(req, res, next) {
 res.render('wrong_american');
});
router.get('/share_american', function(req, res, next) {
 res.render('share_american');
});

router.get('/page_dubai', function(req, res, next) {
 res.render('page_dubai');
});
router.get('/wrong_dubai', function(req, res, next) {
 res.render('wrong_dubai');
});
router.get('/share_dubai', function(req, res, next) {
 res.render('share_dubai');
});

router.get('/pass', function(req, res, next) {
 res.render('pass');
});

// router.get('/show', function(req, res, next) {
//   var nameId;
//   client.select('15',function (error) {
//     if(error){
//       console.log(error);
//     }else{
//       client.sadd('myset','6');
//       client.sadd('myset','7');
//     }
//   });
//   client.select('15',function (error) {
//     if(error){
//       console.log(error);
//     }else{
//       client.smembers('myset',function (err,reply) {
//         console.log(reply);
//         console.log(reply.length);
//          res.render('show',{reply});
//       });
//       // console.log(nameId);
//     }
//   });
// });

// router.get('/share', function(req, res, next) {
//   var thisUrl = req.url;
//   var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
//   console.log(thisUrl);
//   console.log(shareUrl);
//   superagent
//     .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
//     .end(function(err2, res2) {
//       if (res2 !== undefined && res2.ok) {
//         res2.body.browserUrl = global.browserURL;
//         console.log('分享成功啦！'+res2.body);
//         var string2= JSON.stringify(res2.body);
//         console.log('分享成功啦！'+string2);
//         res.render('share', res2.body);
//       } else {
//         console.error('微信分享api错误。');
//       }
//     });
// });


module.exports = router;
