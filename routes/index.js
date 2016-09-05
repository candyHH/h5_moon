var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var redis = require('redis');
var config = require('../config.js');
var client  = redis.createClient(config.redis.port, config.redis.ip);
console.log(config.redis.pwd);
client.auth(config.redis.pwd);
// client.select(config.redis.db);

/* GET home page. */
router.get('/', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
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
              console.log(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state+'&finalbase='+global.browserURL);
              superagent
                  .get(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state+'&finalbase='+global.browserURL)
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
              console.log('用户信息-----------'+info);
              superagent
                .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
                .end(function(err2, res2) {
                  if (res2 !== undefined && res2.ok) {
                    res2.body.browserUrl = global.browserURL;
                    res.render('welcome',res2.body);
                  } else {
                    console.error('微信分享api错误。');
                  }
                });
          }
      });
});
router.get('/welcome', function(req, res, next) {
 var thisUrl = req.url;
 var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
 console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
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
             console.log(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state+'&finalbase='+global.browserURL);
             superagent
                 .get(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state+'&finalbase='+global.browserURL)
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
             var name = JSON.parse(res4.text);
             var name1 = JSON.stringify(name);
            //  var userinfo = name.json_decode();
             console.log('用户信息-----------'+info);
             console.log('用户信息-----------'+name1);
             superagent
               .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
               .end(function(err2, res2) {
                 if (res2 !== undefined && res2.ok) {
                   res2.body.browserUrl = global.browserURL;
                   var string2= JSON.stringify(res2.body);
                   console.log('分享成功啦！'+string2);
                   res.render('welcome',res2.body);
                 } else {
                   console.error('微信分享api错误。');
                 }
               });
         }
     });
});

router.get('/page_thailand', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_thailand', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

router.get('/wrong_thailand', function(req, res, next) {
    res.render('wrong_thailand');
});

router.get('/share_thailand', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_thailand', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

router.get('/page_korea', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_korea', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});
router.get('/wrong_korea', function(req, res, next) {
 res.render('wrong_korea');
});
router.get('/share_korea', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_korea', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

router.get('/page_japan', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_japan', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

router.get('/wrong_japan', function(req, res, next) {
 res.render('wrong_japan');
});

router.get('/share_japan', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_japan', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

router.get('/page_britain', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_britain', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});
router.get('/wrong_britain', function(req, res, next) {
 res.render('wrong_britain');
});
router.get('/share_britain', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_britain', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
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
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_american', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

router.get('/page_dubai', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_dubai', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

router.get('/wrong_dubai', function(req, res, next) {
 res.render('wrong_dubai');
});

router.get('/share_dubai', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // console.log(thisUrl);
  console.log('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_dubai', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

router.get('/pass', function(req, res, next) {
 res.render('pass');
});

router.post('/pass',function (req,res,next) {
  var pageNum = req.body.pageNum;
  console.log(pageNum);
})

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

router.get('/share', function(req, res, next) {
  var thisUrl = req.url;
  var pageNum = req.query.pageNum;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  console.log(thisUrl);
  console.log(pageNum);
  console.log(shareUrl);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        if(pageNum == 1){
          res2.body.question = '/share_thailand';
        }else if (pageNum == 2){
          res2.body.question = '/share_korea';
        }else if(pageNum == 3){
          res2.body.question = '/share_japan';
        }else if(pageNum == 4){
          res2.body.question = '/share_britain';
        }else if (pageNum == 5){
          res2.body.question = '/share_american';
        }else if(pageNum == 6){
          res2.body.question = '/share_dubai';
        }
        var string2= JSON.stringify(res2.body);
        console.log('分享成功啦！'+string2);
        res.render('share', res2.body);
      } else {
        console.error('微信分享api错误。');
      }
    });
});

module.exports = router;
