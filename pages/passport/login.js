var redirectTo;

Page({
	data: {
		mobile: '',
		password: ''
	},
	mobileInput: function(e){
		this.setData({
	      mobile: e.detail.value
	    });
	},
	pwdInput: function(e){
		this.setData({
	      password: e.detail.value
	    });
	},
	onLoad: function(e){
		redirectTo = e.redirectTo;
	},
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	},
	login: function(e){
		var mobile = this.data.mobile;
		var password = this.data.password;
		if(!mobile.trim() || !password){
			wx.showToast({
				title: '手机号和密码必填！',
				image: '../../resources/cancel.png'
			});
			return;
		}

		var openid = wx.getStorageSync('openid');

		wx.request({
			url: 'https://wl.kaidisupplychain.com/api/login',
			method: 'POST',
			data: {
				mobile: this.data.mobile,
				password: this.data.password,
				openid: openid
			},
			success: function(res) {
				var resData = res.data;
				if(resData.succ){
					var userInfo = resData.data;
					userInfo.last_time = Date.parse(new Date());
					wx.setStorageSync('userInfo', userInfo);
					wx.showToast({
						title: resData.msg,
						image: '../../resources/succ.png',
						success: function(){
							setTimeout(function(){
								wx.navigateBack();
							}, 2000);
						}
					});
				}

				if(resData.error){
					wx.showToast({
						title: resData.msg,
						image: '../../resources/cancel.png'
					});
				}
			}
		});
	}
});


