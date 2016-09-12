wx.config({
  debug: false,
  appId: wxConfig.appId,
  timestamp: wxConfig.timestamp,
  nonceStr: wxConfig.nonceStr,
  signature: wxConfig.signature,

  jsApiList: [
    'checkJsApi',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    // 'hideMenuItems',
    'showMenuItems',
    // 'hideAllNonBaseMenuItem',
    'showAllNonBaseMenuItem',
    'translateVoice',
    'startRecord',
    'stopRecord',
    'onRecordEnd',
    'playVoice',
    'pauseVoice',
    'stopVoice',
    'uploadVoice',
    'downloadVoice',
    'chooseImage',
    'previewImage',
    'uploadImage',
    'downloadImage',
    'getNetworkType',
    'openLocation',
    'getLocation',
    'hideOptionMenu',
    'showOptionMenu',
    'closeWindow',
    'scanQRCode',
    'chooseWXPay',
    'openProductSpecificView',
    'addCard',
    'chooseCard',
    'openCard'
  ]
});

wx.ready(function() {
  wx.onMenuShareAppMessage({
    title : '天哪！我竟然闯关失败',
    desc : '在下月饼之旅闯关失败，大侠可否助我一臂之力',
    imgUrl : 'http://a4.qpic.cn/psb?/V12r8I4D1MpPWh/VDPoxJ7pB7WUrgvqv5xGFZ1cMKqT*QT1gLwqBnuxF7k!/b/dG8BAAAAAAAA&ek=1&kp=1&pt=0&bo=9QH1AfUB9QEDCC0!&sce=0-12-12&rf=viewer_311',
    link : '<%=browserUrl%>' + '<%=question%>',
    success:function (res) {
      // var wrong = '<%=wrong%>';
      // alert(wrong+'?flag=1');
      alert('hello');
      window.location.href=wrong+'?flag=1';
    }
  });
  wx.onMenuShareTimeline(shareData);
  wx.hideMenuItems({
    menuList: ['menuItem:originPage', 'menuItem:openWithQQBrowser',
      'menuItem:copyUrl', 'menuItem:openWithSafari'
    ],
  });
});
wx.error(function(res) {
  alert(res.errMsg);
});
wx.success(function (res) {
  alert('hhhhh');
})
