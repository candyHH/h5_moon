var express = require('express');
var app = express();

var shareInfo = {
  successInfo : {
    title: '可怕，竟然去迪拜吃月饼',
    desc: '哇！LALOCAL邀请你去迪拜吃月饼啦~',
    img : 'http://chuantu.biz/t5/32/1472972716x1822611323.png'
  },
  wrongInfo : {
    title: '天哪！我竟然闯关失败',
    desc: '在下月饼之旅闯关失败，大侠可否助我一臂之力',
    img : 'http://chuantu.biz/t5/32/1472972716x1822611323.png'
  }
}

module.exports = shareInfo;
