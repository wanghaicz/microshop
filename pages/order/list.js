var util = require('../../utils/util.js');

var orderStatus = {
	"todo": "active",
	"doing": "",
	"done": "",
	"cancel": ""
};

var curStatus = "todo";

Page({
	data: {
		orderStatus: orderStatus
	},
	onShow: function(e){
		this.getList(curStatus);
	},
	onPullDownRefresh: function(e){
		this.getList(curStatus);
	    wx.stopPullDownRefresh();
	},
	checkStatus: function(e){
		for(var i in orderStatus){
			orderStatus[i] = "";
			if(i == e.target.id){
				orderStatus[i] = "active";
				curStatus = i;
			}
		}
		this.setData({orderStatus: orderStatus});
		this.getList(curStatus);
	},
	login: function(e){
		util.checkLocal(true);
	},
	// again: function(e){
	// 	if(util.checkLocal(true)){
	// 		var dataset = e.currentTarget.dataset;
	// 	    if(dataset.order_bn){
	// 			var userInfo = wx.getStorageSync('userInfo');
	// 			var _this = this;
	// 			wx.request({
	// 				url: 'https://wl.kaidisupplychain.com/api/order-again',
	// 				method: 'POST',
	// 				data: {
	// 					order_bn: dataset.order_bn,
	// 					api_token: userInfo.api_token
	// 				},
	// 				success: function(res) {
	// 					var resData = res.data;
	// 					if(util.checkRemote(resData, true)){
	// 						if(resData.error){
	// 							wx.showToast({
	// 								title: resData.msg,
	// 								image: '../../resources/cancel.png'
	// 							});
	// 						}

	// 						if(resData.succ){
	// 							wx.redirectTo({
	// 								url: "/pages/order/succ",
	// 								success: function(e){

	// 								}
	// 							});
	// 						}
	// 					}
	// 				}
	// 			});
	// 		}
	// 	}
	// },
	detail: function(e){
		if(util.checkLocal(true)){
			var dataset = e.currentTarget.dataset;
		    if(dataset.order_bn){
		    	wx.navigateTo({
			        url: "/pages/order/detail?order_bn="+dataset.order_bn,
			        success: function(e){

			        }
		    	});
		    }
		}
	},
	cancel: function(e){
		if(util.checkLocal(true)){
			var dataset = e.currentTarget.dataset;
		    if(dataset.order_bn){
		    	wx.navigateTo({
					url: "/pages/order/cancel?order_bn="+dataset.order_bn,
					success: function(e){

					}
				});
		    }
		}
	},
	getList: function(status){
		if(util.checkLocal(false)){
			var userInfo = wx.getStorageSync('userInfo');
			var _this = this;
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/order-list',
				method: 'POST',
				data: {
					status: status,
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
						_this.setData({orderData: resData.data});
					}else{
						_this.setData({nologin: true});
					}
				}
			});
		}else{
			this.setData({nologin: true});
		}
	}
});