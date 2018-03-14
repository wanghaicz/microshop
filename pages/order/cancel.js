var util = require('../../utils/util.js');

var type = 0;
var inputReason = '';
var order_bn;
var reason = {
	1: '订单信息错误',
	2: '停电',
	3: '设备故障',
	4: '天气原因',
	5: '改送其他地方',
	6: '其他'
};

var id_of_setTimeout;

Page({
	onLoad: function(e){
		type = 0;
		inputReason = '';
		order_bn = e.order_bn;
		this.setData({type: type});
	},
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	},
	checkType: function(e){
		var dataset = e.currentTarget.dataset;
		type = dataset.type
		this.setData({type: type});
	},
	reasonInput: function(e){
		inputReason = e.detail.value;
	},
	submit: function(e){
		if(util.checkLocal(true)){
			if(!order_bn){
				wx.showToast({
					title: '参数错误！请重新进入页面后再提交！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			if(!reason[type]){
				wx.showToast({
					title: '请选择订单取消原因！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			var cancelReason = reason[type];

			if(type == 6){
				if(!inputReason){
					wx.showToast({
						title: '请填写订单取消原因！',
						image: '../../resources/cancel.png'
					});
					return;
				}

				cancelReason = inputReason;
			}

			var userInfo = wx.getStorageSync('userInfo');
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/order-cancel',
				method: 'POST',
				data: {
					api_token: userInfo.api_token,
					cancel_reason: cancelReason,
					order_bn: order_bn
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

							id_of_setTimeout = setTimeout(function(){
								wx.switchTab({
									url: "/pages/order/list",
									success: function(e){

									}
								});
							}, 3000);
						}
					}
				}
			});
		}
	},
	onUnload: function(e){
		clearTimeout(id_of_setTimeout);
	},
});