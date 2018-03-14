var util = require('../../utils/util.js');

Page({
	onShow: function(e){
		if(util.checkLocal(false)){
			var userInfo = wx.getStorageSync('userInfo');
			this.setData({
				avatarUrl: wx.getStorageSync('avatarUrl'),
				name: userInfo.name,
				mobile: userInfo.mobile,
				nologin: false
			});
		}else{
			this.setData({nologin: true});
		}
	},
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	},
	manageAddr: function(e){
		if(util.checkLocal(true)){
			wx.navigateTo({
		      url: "/pages/addr/list",
		      success: function(e){

		      }
		    });
		}
	},
	modifyPwd: function(e){
		if(util.checkLocal(true)){
			wx.navigateTo({
		      url: "/pages/member/pwd",
		      success: function(e){

		      }
		    });
		}
	},
	login: function(e){
		util.checkLocal(true);
	},
	logout: function(e){
		var userInfo = wx.getStorageSync('userInfo');
		var _this = this;
		wx.request({
			url: 'https://wl.kaidisupplychain.com/api/logout',
			method: 'POST',
			data: {
				api_token: userInfo.api_token
			},
			success: function(res) {
				wx.setStorageSync('userInfo', {});
				_this.setData({nologin: true});
			}
		});
	}
});