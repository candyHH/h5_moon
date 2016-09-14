var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var redis = require('redis');
var config = require('../config.js');

var logger = require('../log4j').logger;  
var logger_error = require('../log4j').logger_error;  


var client  = redis.createClient(config.redis.port, config.redis.ip);
logger.info(config.redis.pwd+'999999');
client.auth(config.redis.pwd);
// client.select(config.redis.db);

/* GET home page. */
router.get('/', function(req, res, next) {
  var thisUrl = req.url;
  console.log(thisUrl);
  console.log(global.browserURL + thisUrl);
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  console.log(shareUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
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
              logger.info(state);
              logger.info('openid为空--------- ');
              logger.info(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state+'&finalbase='+global.browserURL);
              superagent
                  .get(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state+'&finalbase='+global.browserURL)
                  .end(function(err, res3) {
                      if (res3 !== undefined && res3.ok) {
                          res.redirect(res3.text);
                          return;
                      } else {
                          logger_error.error('微信授权错误。');
                          res.render('error', {});
                      }
                  });
          } else {
              logger.info(' 正常请求---------- ');
              var info = JSON.stringify(res4);
              var userInfo = JSON.parse(res4.text);
             //  logger.info('用户信息-----------'+info);
             //  logger.info('用户信息-----------'+userInfo.nickname);
              superagent
                .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
                .end(function(err2, res2) {
                  if (res2 !== undefined && res2.ok) {
                    res2.body.browserUrl = global.browserURL;
                    res2.body.nickname = userInfo.nickname;
                    var string2= JSON.stringify(res2.body);
                    logger.info('分享成功啦！'+string2);
                    res.render('welcome',res2.body);
                  } else {
                    logger_error.error('微信分享api错误。');
                  }
                });
          }
      });
});
router.get('/welcome', function(req, res, next) {
 var thisUrl = req.url;
 var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
 logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
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
             logger.info(state);
             logger.info('openid为空--------- ');
             logger.info(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state+'&finalbase='+global.browserURL);
             superagent
                 .get(global.wechatURL + '/wechat_oauth/getAuthorizeURL?state=' + state+'&finalbase='+global.browserURL)
                 .end(function(err, res3) {
                     if (res3 !== undefined && res3.ok) {
                         res.redirect(res3.text);
                         return;
                     } else {
                         logger_error.error('微信授权错误。');
                         res.render('error', {});
                     }
                 });
         } else {
             logger.info(' 正常请求---------- ');
             var info = JSON.stringify(res4);
             var userInfo = JSON.parse(res4.text);
            //  logger.info('用户信息-----------'+info);
            //  logger.info('用户信息-----------'+userInfo.nickname);
             superagent
               .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
               .end(function(err2, res2) {
                 if (res2 !== undefined && res2.ok) {
                   res2.body.browserUrl = global.browserURL;
                   res2.body.nickname = userInfo.nickname;
                   var string2= JSON.stringify(res2.body);
                   logger.info('分享成功啦！'+string2);
                   res.render('welcome',res2.body);
                 } else {
                   logger_error.error('微信分享api错误。');
                 }
               });
         }
     });
});

router.get('/page_thailand', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_thailand', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/wrong_thailand', function(req, res, next) {
    var flag = req.query.flag;
    logger.info('flag......................'+flag);
    res.render('wrong_thailand',{flag:flag});
});

router.get('/share_thailand', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_thailand', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/page_korea', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_korea', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});
router.get('/wrong_korea', function(req, res, next) {
  var flag = req.query.flag;
 res.render('wrong_korea',{flag:flag});
});
router.get('/share_korea', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_korea', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/page_japan', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_japan', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/wrong_japan', function(req, res, next) {
  var flag = req.query.flag;
 res.render('wrong_japan',{flag:flag});
});

router.get('/share_japan', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_japan', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/page_britain', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_britain', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});
router.get('/wrong_britain', function(req, res, next) {
  var flag = req.query.flag;
 res.render('wrong_britain',{flag:flag});
});
router.get('/share_britain', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_britain', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/page_american', function(req, res, next) {
 var thisUrl = req.url;
 var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
 // logger.info(thisUrl);
 logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
 superagent
   .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
   .end(function(err2, res2) {
     if (res2 !== undefined && res2.ok) {
       res2.body.browserUrl = global.browserURL;
       res.render('page_american', res2.body);
     } else {
       logger_error.error('微信分享api错误。');
     }
   });
});
router.get('/wrong_american', function(req, res, next) {
  var flag = req.query.flag;
 res.render('wrong_american',{flag:flag});
});

router.get('/share_american', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_american', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/page_dubai', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('page_dubai', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/wrong_dubai', function(req, res, next) {
  var flag = req.query.flag;
 res.render('wrong_dubai',{flag:flag});
});

router.get('/share_dubai', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('share_dubai', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.get('/pass', function(req, res, next) {
  var thisUrl = req.url;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  // logger.info(thisUrl);
  logger.info('shareUrl.................'+(global.browserURL + thisUrl).split('#')[0]);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        res.render('pass', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

router.post('/pass',function (req,res,next) {
  var nickname = req.body.nickname;
  logger.info('过关的用户'+nickname);
  client.select(config.redis.db,function (error) {
      if(error){
        logger.info(error);
      }else{
        client.sadd('nickname',nickname);
        logger.info('增加新用户...........'+nickname);
      }
    });
})

router.get('/show', function(req, res, next) {
  client.select(config.redis.db,function (error) {
    if(error){
      logger.info(error);
    }else{
      client.smembers('nickname',function (err,reply) {
        logger.info(reply);
        logger.info(reply.length);
        res.render('show',{reply:reply});
      });
    }
  });
});

router.get('/share', function(req, res, next) {
  var thisUrl = req.url;
  var pageNum = req.query.pageNum;
  var shareUrl = encodeURIComponent((global.browserURL + thisUrl).split('#')[0]);
  logger.info(thisUrl);
  logger.info(pageNum);
  logger.info(shareUrl);
  superagent
    .get(global.wechatURL + '/wechat_api/jsconfig?url=' + shareUrl)
    .end(function(err2, res2) {
      if (res2 !== undefined && res2.ok) {
        res2.body.browserUrl = global.browserURL;
        if(pageNum == 1){
          res2.body.question = '/share_thailand';
          res2.body.wrong = 'wrong_thailand';
        }else if (pageNum == 2){
          res2.body.question = '/share_korea';
          res2.body.wrong = 'wrong_korea';
        }else if(pageNum == 3){
          res2.body.question = '/share_japan';
          res2.body.wrong = 'wrong_japan';
        }else if(pageNum == 4){
          res2.body.question = '/share_britain';
          res2.body.wrong = 'wrong_britain';
        }else if (pageNum == 5){
          res2.body.question = '/share_american';
          res2.body.wrong = 'wrong_american';
        }else if(pageNum == 6){
          res2.body.question = '/share_dubai';
          res2.body.wrong = 'wrong_dubai';
        }
        var string2= JSON.stringify(res2.body);
        logger.info('分享成功啦！'+string2);
        res.render('share', res2.body);
      } else {
        logger_error.error('微信分享api错误。');
      }
    });
});

module.exports = router;
