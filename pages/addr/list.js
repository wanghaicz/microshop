var util = require('../../utils/util.js');

var appInstance = getApp();
var redirectTo;
var maxRight = 60;
var startX, startY, endX, endY, moving = false;

var addrList = {};

Page({
	onShow: function(e){
		if(util.checkLocal(false)){
			var userInfo = wx.getStorageSync('userInfo');
			var _this = this;
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/addr-list',
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
							addrList['addr_'+resData.data[i].id] = {
								id: resData.data[i].id,
								addr: resData.data[i].town+resData.data[i].address,
								right: 0
							};
						}
						_this.setData({addrList: addrList});
					}else{
						_this.setData({nologin: true});
					}
				}
			});
		}else{
			this.setData({nologin: true});
		}
	},
	onLoad: function(e){
		if(e.redirectTo) {
			redirectTo = e.redirectTo;
		}else{
			redirectTo = null;
		}
	},
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	},
	checkAddr: function(e){
		var dataset = e.currentTarget.dataset;
		if(redirectTo) {
			appInstance.globalData.addr = addrList['addr_'+dataset.id];
			if(redirectTo == 'back'){
				wx.navigateBack();
			}
		}
	},
	login: function(e){
		util.checkLocal(true);
	},
	addAddr: function(e){
		if(util.checkLocal(true)){
			wx.navigateTo({
				url: "/pages/addr/new",
				success: function(e){

				}
		    });
		}
	},
	drawStart: function(e){
		var touch = e.touches[0];
		startX = touch.clientX;
		startY = touch.clientY;
		var addrList = this.data.addrList;
		moving = true;
	},
	drawEnd : function(e){
		var addrList = this.data.addrList;
		for(var i in addrList){
			var data = addrList[i];
			if(data.right <= maxRight/2){
				data.right = 0;
			}else{
				data.right = maxRight;
			}
		}
		this.setData({addrList:addrList});
		moving = false;
	},
	drawMove : function(e){
		var dataset = e.currentTarget.dataset;
		var addrList = this.data.addrList;
		if(moving){
			var touch = e.touches[0];
			endX = touch.clientX;
			endY = touch.clientY;
			if(endX == startX) return;
			//从右往左
			if(endX - startX < 0){
				var item = addrList['addr_'+dataset.id];
				var startRight = item.right;
				var change = startX - endX;
				startRight += change;
				if(startRight > maxRight) startRight = maxRight;
				addrList['addr_'+dataset.id].right = startRight;
			}else{
				var item = addrList['addr_'+dataset.id];
				var startRight = item.right;
				var change = endX - startX;
				startRight -= change;
				if(startRight < 0) startRight = 0;
				addrList['addr_'+dataset.id].right = startRight;
			}
			this.setData({addrList:addrList});
		}
	},
	delAddr: function(e){
		if(util.checkLocal(true)){
			var dataset = e.currentTarget.dataset;
			var userInfo = wx.getStorageSync('userInfo');
			var _this = this;
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/addr-del',
				method: 'POST',
				data: {
					api_token: userInfo.api_token,
					addr_id: dataset.id
				},
				success: function(res) {
					var resData = res.data;
					if(util.checkRemote(resData, false)){
						if(resData.error){
							wx.showToast({
								title: resData.msg,
								image: '../../resources/cancel.png'
							});
						}

						if(resData.succ){
							wx.showToast({
								title: resData.msg,
								image: '../../resources/succ.png'
							});

							delete addrList['addr_'+dataset.id];
							_this.setData({addrList: addrList});
						}
					}
				}
			});
		}
	}
});