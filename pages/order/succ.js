var id_of_setTimeout;

Page({
	onLoad: function(e){
		id_of_setTimeout = setTimeout(function(){
			wx.switchTab({
				url: "/pages/order/list",
				success: function(e){

				}
			});
		}, 3000);
	},
	onUnload: function(e){
		clearTimeout(id_of_setTimeout);
	},
	onPullDownRefresh: function(e){
	    wx.stopPullDownRefresh();
	}
});