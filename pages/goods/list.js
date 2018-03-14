var goodsList = [];

var appInstance = getApp();

Page({
  onLoad: function(e){
    this.getList();
  },
  onShow: function(e){
    this.setData({searchValue: appInstance.globalData.searchValue});
    this.getList();
  },
  onPullDownRefresh: function(e){
    this.getList();
    wx.stopPullDownRefresh();
  },
  // onReachBottom: function(e){
  //   this.getList();
  // },
  searchInput: function(e){
    appInstance.globalData.searchValue = e.detail.value;
  },
  searchConfirm: function(e){
    this.getList();
  },
  goDetail: function(e){
    var dataset = e.currentTarget.dataset;
    if(dataset.id > 0){
      wx.navigateTo({
        url: "/pages/goods/detail?id="+dataset.id,
        success: function(e){

        }
      });
    }
  },
  getList: function(){
    var userInfo = wx.getStorageSync('userInfo');
    var _this = this;
    wx.request({
      url: 'https://wl.kaidisupplychain.com/api/item-list',
      method: 'POST',
      data: {
        api_token: userInfo.api_token,
        search: appInstance.globalData.searchValue
      },
      success: function(res) {
        var resData = res.data;
        if(resData.error){
          wx.showToast({
            title: resData.msg,
            image: '../../resources/cancel.png'
          });

          return;
        }
        goodsList = [];
        var row = [];
        for(var i in resData.data){
          row.push({
            id: resData.data[i].id,
            name: resData.data[i].product_name
          });

          if(i % 2 == 1){
            goodsList.push(row);
            row = [];
          }
        }

        if(row.length == 1)
        {
          row.push({
            id: 0,
            name: ''
          });
          goodsList.push(row);
          row = [];
        }

        _this.setData({goodsList: goodsList});
      }
    });
  }
});