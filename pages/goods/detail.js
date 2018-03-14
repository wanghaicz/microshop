var util = require('../../utils/util.js');

var quality = {
	excellent: true,
	good: true,
	unknown: true
};

var appInstance = getApp();

var quantity = '';
var weight = '';
var volume = '';
// var length = '';
var pickupDate = '';
var pickupTime = '';
var postData = {
	item_id: 0,
	quantity: quantity,
	weight: weight,
	volume: volume,
	// truck_length: length,
	quality: '',
	addr_id: 0,
	factory_id: 0,
	pickup_date: pickupDate,
	pickup_time: pickupTime
};

var btndisabled = false;

Page({
	onLoad: function(e){
		quantity = '';
		weight = '';
		volume ='';
		quality = {
			excellent: true,
			good: true,
			unknown: true
		};
		pickupDate = '';
		pickupTime = '';

		postData.quantity = quantity;
		postData.weight = weight;
		postData.volume = volume;
		postData.quality = '';
		postData.pickup_date = pickupDate;
		postData.pickup_time = pickupTime;

		btndisabled = false;

		this.setData({
			quantity: quantity,
			weight: weight,
			volume: volume,
			quality: quality
		});

		//物料id
		postData.item_id = e.id;
		var _this = this;
		wx.request({
			url: 'https://wl.kaidisupplychain.com/api/item-detail',
			method: 'POST',
			data: {
				item_id: e.id
			},
			success: function(res) {
				var resData = res.data;
				if(resData.error){
					wx.showToast({
						title: resData.msg,
						image: '../../resources/cancel.png'
					});
					// setTimeout(function(){
					// 	wx.navigateBack();
					// }, 2000);
					return;
				}

				_this.setData({goodsData: resData.data});
			}
		});
	},
	onShow: function(e){
		if(appInstance.globalData.addr) postData.addr_id = appInstance.globalData.addr.id;
		if(appInstance.globalData.factory) postData.factory_id = appInstance.globalData.factory.id;
		// if(appInstance.globalData.truckLength) postData.truck_length = appInstance.globalData.truckLength;

		this.setData({
			addrData: appInstance.globalData.addr,
			factoryData: appInstance.globalData.factory,
			// length: appInstance.globalData.truckLength
		});
	},
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	},
	checkQuantity: function(e){
		var dataset = e.currentTarget.dataset;

		for(var i in quality){
			quality[i] = true;
		}

		if(this.data.quality[dataset.quality]){
			quality[dataset.quality] = false;
			//物料品质
			postData.quality = dataset.quality;
		}else{
			quality[dataset.quality] = true;
		}

		this.setData({quality: quality});
	},
	// checkLength: function(e){
	// 	wx.navigateTo({
	//       url: "/pages/goods/truck?redirectTo=back",
	//       success: function(e){

	//       }
	//     });
	// },
	checkAddr: function(e){
		if(util.checkLocal(true)){
			wx.navigateTo({
		      url: "/pages/addr/list?redirectTo=back",
		      success: function(e){

		      }
		    });
		}
	},
	checkFactory: function(e){
		if(util.checkLocal(true)){
			wx.navigateTo({
		      url: "/pages/factory/list?redirectTo=back",
		      success: function(e){

		      }
		    });
	    }
	},
	// deliveryDateChange: function(e){
	// 	deliveryDate = e.detail.value;
	// 	postData.delivery_date = deliveryDate;
	// 	this.setData({
	// 		deliveryDate: deliveryDate
	// 	});
	// },
	pickupDateChange: function(e){
		pickupDate = e.detail.value;
		postData.pickup_date = pickupDate;
		this.setData({
			pickupDate: pickupDate
		});
	},
	pickupTimeChange: function(e){
		pickupTime = e.detail.value;
		postData.pickup_time = pickupTime;
		this.setData({
			pickupTime: pickupTime
		});
	},
	postOrder: function(e){
		if(util.checkLocal(true)){
			if(btndisabled){
				wx.showToast({
					title: '请不要重复下单！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			if(!postData.item_id){
				wx.showToast({
					title: '参数错误！请重新进入页面后再提交！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			if(!postData.quality){
				wx.showToast({
					title: '请选择品质！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			if(!(+postData.weight)){
				wx.showToast({
					title: '请输入重量！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			if(!(+postData.quantity)){
				wx.showToast({
					title: '请输入数量！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			if(!(+postData.volume)){
				wx.showToast({
					title: '请输入体积！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			// if(!postData.truck_length){
			// 	wx.showToast({
			// 		title: '请选择场地最大可进车型！',
			// 		image: '../../resources/cancel.png'
			// 	});
			// 	return;
			// }

			if(!postData.addr_id){
				wx.showToast({
					title: '请选择地址！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			if(!postData.factory_id){
				wx.showToast({
					title: '请选择电厂！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			// if(!postData.delivery_date){
			// 	wx.showToast({
			// 		title: '请选择送货日期！',
			// 		image: '../../resources/cancel.png'
			// 	});
			// 	return;
			// }

			if(!postData.pickup_date){
				wx.showToast({
					title: '请选择提货日期！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			if(!postData.pickup_time){
				wx.showToast({
					title: '请选择提货时间！',
					image: '../../resources/cancel.png'
				});
				return;
			}

			btndisabled = true;

			var userInfo = wx.getStorageSync('userInfo');
			postData.api_token = userInfo.api_token;
			wx.request({
				url: 'https://wl.kaidisupplychain.com/api/order-create',
				method: 'POST',
				data: postData,
				success: function(res) {
					var resData = res.data;
					if(util.checkRemote(resData, true)){
						if(resData.error){
							wx.showToast({
								title: resData.msg,
								image: '../../resources/cancel.png'
							});

							btndisabled = false;
						}

						if(resData.succ){
							wx.redirectTo({
								url: "/pages/order/succ",
								success: function(e){

								}
							});
						}
					}
				}
			});
		}
	},
	quantityMinus: function(e){
		var newQuantity = (+quantity) - 1;
		if(newQuantity < 0) return;
		quantity = newQuantity.toFixed(1);
		postData.quantity = quantity;
		this.setData({quantity: quantity});
	},
	quantityPlus: function(e){
		var newQuantity = (+quantity) + 1;
		quantity = newQuantity.toFixed(1)
		postData.quantity = quantity;
		this.setData({quantity: quantity});
	},
	quantityInput: function(e){
		var newQuantity = e.detail.value;

		if(newQuantity && !/^[0-9]+\.?[0-9]?$/.test(newQuantity))
		{
			this.setData({quantity: quantity});
			return;
		}

		quantity = newQuantity;
		postData.quantity = quantity;
		this.setData({quantity: quantity});
	},
	weightMinus: function(e){
		var newWeight = (+weight) - 1;
		if(newWeight < 0) return;
		weight = newWeight.toFixed(2);
		postData.weight = weight;
		this.setData({weight: weight});
	},
	weightPlus: function(e){
		var newWeight = (+weight) + 1;
		weight = newWeight.toFixed(2)
		postData.weight = weight;
		this.setData({weight: weight});
	},
	weightInput: function(e){
		var newWeight = e.detail.value;

		if(newWeight && !/^[0-9]+\.?[0-9]{0,2}$/.test(newWeight))
		{
			this.setData({weight: weight});
			return;
		}

		weight = newWeight;
		postData.weight = weight;
		this.setData({weight: weight});
	},
	volumeMinus: function(e){
		var newVolume = (+volume) - 1;
		if(newVolume < 0) return;
		volume = newVolume.toFixed(1);
		postData.volume = volume;
		this.setData({volume: volume});
	},
	volumePlus: function(e){
		var newVolume = (+volume) + 1;
		volume = newVolume.toFixed(1)
		postData.volume = volume;
		this.setData({volume: volume});
	},
	volumeInput: function(e){
		var newVolume = e.detail.value;

		if(newVolume && !/^[0-9]+\.?[0-9]?$/.test(newVolume))
		{
			this.setData({volume: volume});
			return;
		}

		volume = newVolume;
		postData.volume = volume;
		this.setData({volume: volume});
	}
});