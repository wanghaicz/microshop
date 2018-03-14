var util = require('../../utils/util.js');

Page({
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	},
	pwdInput: function(e){
		this.setData({
	      	password: e.detail.value
	    });
	},
	newInput: function(e){
		this.setData({
	      	new_password: e.detail.value
	    });
	},
	confirmInput: function(e){
		this.setData({
	      	new_password_confirmation: e.detail.value
	    });
	},
	savePwd: function(e){
		if(util.checkLocal(true)){
			var userInfo = wx.getStorageSync('userInfo');
			var _this = this;
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/passport-resetpwd',
				method: 'POST',
				data: {
					api_token: userInfo.api_token,
					password: this.data.password,
					new_password: this.data.new_password,
					new_password_confirmation: this.data.new_password_confirmation
				},
				success: function(res) {
					var resData = res.data;
					if(util.checkRemote(resData, true)){
						if(resData.error){
							wx.showToast({
								title: resData.msg,
								image: '../../resources/cancel.png'
							});
						}

						if(resData.succ){
							wx.setStorageSync('userInfo', {});

							wx.showToast({
								title: resData.msg,
								image: '../../resources/succ.png'
							});

							setTimeout(function(){
								wx.navigateBack();
							}, 2000);
						}
					}
				}
			});
		}
	}
});