var util = require('../../utils/util.js');

var appInstance = getApp();
var redirectTo;

var factoryList = {};

Page({
	onShow: function(e){
		this.getList();
	},
	onLoad: function(e){
		if(e.redirectTo) {
			redirectTo = e.redirectTo;
		}else{
			redirectTo = null;
		}
	},
	onPullDownRefresh: function(e){
		this.getList();
	    wx.stopPullDownRefresh();
	},
	checkFactory: function(e){
		var dataset = e.currentTarget.dataset;
		if(redirectTo) {
			appInstance.globalData.factory = factoryList['factory_'+dataset.id];
			if(redirectTo == 'back'){
				wx.navigateBack();
			}
		}
	},
	getList: function(){
		if(util.checkLocal(false)){
			var userInfo = wx.getStorageSync('userInfo');
			var _this = this;
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/factory-list',
				method: 'POST',
				data: {
					api_token: userInfo.api_token
				},
				success: function(res) {
					var resData = res.data;
					if(util.checkRemote(resData, false)){
						_this.setData({nologin: false});
						if(resData.error){
							wx.showToast({
								title: resData.msg,
								image: '../../resources/cancel.png'
							});
							return;
						}

						for(var i in resData.data){
							factoryList['factory_'+resData.data[i].id] = resData.data[i];
						}

						_this.setData({factoryList: factoryList});
					}else{
						_this.setData({nologin: true});
					}
				}
			});
		}else{
			this.setData({nologin: true});
		}
	},
	login: function(e){
		util.checkLocal(true);
	}
});