;(function(window){
window.Popup=(function(){
    return new PopLayer();
})(window);

//构造函数
function PopLayer(){
	this.default={
		time:2000,
		header:"信息",     //头部信息
		haveHeader:true,  //是否显示头部
		maskHide:false,   //是否点击遮罩隐藏
		closeBut:true,    //是否需要关闭按钮
		loadingImg:'loading-1',
		style:'',
		title:"请填写提示信息！",
		yes:function(){}
	};
    this.setting={};
}
/*公共变量*/
PopLayer.prototype.varLiang=function(json){
	if(json){
		this.setting.style="";
	    this.setting.title=json.title?json.title:this.default.title;
	    this.setting.header=json.header?json.header:this.default.header;
	    this.setting.closeBut=typeof(json.closeBut)=='boolean'?json.closeBut:this.default.closeBut;
	    this.setting.haveHeader=typeof(json.haveHeader)=='boolean'?json.haveHeader:this.default.haveHeader;
	    this.setting.maskHide=typeof(json.maskHide)=='boolean'?json.maskHide:this.default.maskHide;
	    this.setting.time=json.time?json.time:this.default.time;
	    this.setting.loadingImg=json.loadingImg?json.loadingImg:this.default.loadingImg;
	    this.setting.style=json.style?json.style:this.default.style;
	    this.setting.yes=json.yes?json.yes:this.default.yes;
   }else{
		this.setting.style="";
   }
}
/*页面层*/
PopLayer.prototype.customHtml=function(json){
	this.varLiang(json);
    var str='<div class="popup">';
	str+=this.setting.maskHide?'<div class="mask" onclick="closeThisPopup(this)"></div>':'<div class="mask"></div>';
    str+='<div class="main" style="'+this.setting.style+'">';
    if(this.setting.haveHeader){
    	str+=this.setting.closeBut?'<div class="header">'+this.setting.header+'</div>':'<div class="header">'+this.setting.header+'<span onclick="closeThisPopup(this)"></span></div>';
    }
    str+='<div class="content html">'+json.html+'</div>';
    str+='</div></div>';
	         
    $('body').append(str);
    middle(); //居中
	
}
/*iframe层*/
PopLayer.prototype.iframe=function(json){
	this.varLiang(json);
    var str='<div class="popup popup-iframe">';
	str+=this.setting.maskHide?'<div class="mask" onclick="closeThisPopup(this)"></div>':'<div class="mask"></div>';
    str+='<div class="main" style="'+this.setting.style+'">';
    if(this.setting.haveHeader){
    	str+=this.setting.closeBut?'<div class="header">'+this.setting.header+'</div>':'<div class="header">'+this.setting.header+'<span onclick="closeThisPopup(this)"></span></div>';
    }
    str+='<div class="content html"><iframe id="iframePage" src="'+json.src+'" width="100%" height="100%" frameborder="0"></iframe></div>';
    str+='</div></div>';
	         
    $('body').append(str);
    var height=$('div.main').height();
	if(this.setting.haveHeader){
		$('div.content').css({height:(height-60)+'px'});
	}else{
		$('div.content').css({height:(height-30)+'px'});
	}
}

//信息层
PopLayer.prototype.alert=function(json){
    this.varLiang(json);
    var str='<div class="popup">';
	str+=this.setting.maskHide?'<div class="mask" onclick="closeThisPopup(this)"></div>':'<div class="mask"></div>';
    str+='<div class="main" style="'+this.setting.style+'">';
    if(this.setting.haveHeader){
    	str+=this.setting.closeBut?'<div class="header">'+this.setting.header+'</div>':'<div class="header">'+this.setting.header+'<span onclick="closeThisPopup(this)"></span></div>';
    }
    str+='<div class="content">'+this.setting.title+'</div>';
    str+='<div class="footer"><span class="yes" onclick="closeThisPopup(this)">确定</span></div>';
    str+='</div></div>';
	         
    $('body').append(str);
    middle(); //居中
}
//确认层
PopLayer.prototype.confirm=function(json){
	this.varLiang(json);
    var str='<div class="popup">';
    	str+=this.setting.maskHide?'<div class="mask" onclick="closeThisPopup(this)"></div>':'<div class="mask"></div>';
		str+='<div class="main" style="'+this.setting.style+'">';
        if(this.setting.haveHeader){
        	str+=this.setting.closeBut?'<div class="header">'+this.setting.header+'</div>':'<div class="header">'+this.setting.header+'<span onclick="closeThisPopup(this)"></span></div>';
        }
        str+='<div class="content">'+this.setting.title+'</div>';
        str+='<div class="footer"><span class="no" onclick="closeThisPopup(this)">取消</span><span class="yes" onclick="dosomePopup(this,'+this.setting.yes+')">确定</span></div>';
        str+='</div></div>';     
    $('body').append(str);
    middle(); //居中
}
/*2s消失*/
PopLayer.prototype.miss=function(json){
	this.varLiang(json);
    var str='<div class="popup popup-hide">';
    	str+=this.setting.maskHide?'<div class="mask" onclick="closeThisPopup(this)"></div>':'<div class="mask"></div>';
		str+='<div class="main" style="'+this.setting.style+'">';
        str+='<div class="content">'+this.setting.title+'</div>';
        str+='</div></div>';     
    $('body').append(str);
    middle(); //居中
    setTimeout(function(){
    	$('div.popup-hide').remove();
    },this.setting.time);
}

//加载层
PopLayer.prototype.loading=function(json){
    this.setting.title="加载中,请稍后...";
    this.varLiang(json);
    var str='<div class="popup popup-loading">';
    	str+=this.setting.maskHide?'<div class="mask" onclick="closeThisPopup(this)"></div>':'<div class="mask"></div>';
		str+='<div class="main" style="'+this.setting.style+'">';
        str+='<div class="content">'+this.setting.title+'</div>';
        str+='</div></div>';     
    $('body').append(str);
    middle(); //居中
}
/*关闭加载层*/
PopLayer.prototype.closeLoading=function(){
	$('div.popup-loading').remove();
}
/*关闭iframe层*/
PopLayer.prototype.closeIframe=function(){
	$(".popup-iframe", parent.document).remove();
}
/*确认回调函数*/
window.dosomePopup=function(obj,yes){
	closeThisPopup(obj);
	yes();
}
/*关闭遮罩*/
window.closeThisPopup=function(obj){
	$(obj).parents('div.popup').remove();
}
//居中函数
window.middle=function(){
	var main=$('div .main');
    main.css({marginLeft:-main.width()/2+"px",marginTop:-main.height()/2+"px"});
}
})(window);




