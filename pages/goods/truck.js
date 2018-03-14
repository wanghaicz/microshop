var appInstance = getApp();
var redirectTo;

Page({
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
	checkLength: function(e){
		var dataset = e.currentTarget.dataset;
		if(redirectTo) {
			appInstance.globalData.truckLength = dataset.length;
			if(redirectTo == 'back'){
				wx.navigateBack();
			}
		}
	}
});