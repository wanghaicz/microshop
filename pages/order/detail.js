var util = require('../../utils/util.js');

Page({
	onLoad: function(e){
		if(util.checkLocal(true)){
			var userInfo = wx.getStorageSync('userInfo');
			var _this = this;
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/order-detail',
				method: 'POST',
				data: {
					order_bn: e.order_bn,
					api_token: userInfo.api_token
				},
				success: function(res) {
					var resData = res.data;
					if(util.checkRemote(resData, true)){
						if(resData.error){
							wx.showToast({
								title: resData.msg,
								image: '../../resources/cancel.png'
							});
							return;
						}

						_this.setData({orderData: resData.data});
					}
				}
			});
		}
	},
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	}
});