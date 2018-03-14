var util = require('../../utils/util.js');

Page({
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	},
	postcodeInput: function(e){
		this.setData({postcode: e.detail.value});
	},
	townInput: function(e){
		this.setData({town: e.detail.value});
	},
	addressInput: function(e){
		this.setData({address: e.detail.value});
	},
	saveAddr: function(e){
		if(util.checkLocal(true)){
			var userInfo = wx.getStorageSync('userInfo');
			var _this = this;
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/addr-save',
				method: 'POST',
				data: {
					api_token: userInfo.api_token,
					postcode: this.data.postcode,
					town: this.data.town,
					address: this.data.address
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