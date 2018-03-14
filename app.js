var util = require('./utils/util.js');

//app.js
App({
 	globalData: {},
	onShow: function() {
		wx.login({
	    	success: function(res) {
				if (res.code) {
					//发起网络请求
					wx.request({
						url: 'https://wl.kaidisupplychain.com/api/getopenid',
						method: 'POST',
						data: {
							code: res.code
						},
						success: function(res) {
							var resData = res.data;
							if(resData.openid){
							 	wx.setStorageSync('openid', resData.openid);

							 	wx.request({
									url: 'https://wl.kaidisupplychain.com/api/autologin',
									method: 'POST',
									data: {
										api_token: resData.openid
									},
									success: function(res) {
										var resData = res.data;
										if(resData.succ){
											var userInfo = resData.data;
											userInfo.last_time = Date.parse(new Date());
											wx.setStorageSync('userInfo', userInfo);
										}
									}
								});
							}
						}
					});

					wx.authorize({
		                scope: 'scope.userInfo',
		                success: function() {
		                	wx.getUserInfo({
		                		lang: 'zh_CN',
		                		success: function(res){
		                			wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
		                		}
		                	});
		                }
		            });
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
	 	});
	}
});