var imgUrls = [
  'https://wl.kaidisupplychain.com/180115_1.jpg',
  'https://wl.kaidisupplychain.com/180115_2.jpg',
  'https://wl.kaidisupplychain.com/180115_3.jpg',
  'https://wl.kaidisupplychain.com/180115_4.jpg',
  'https://wl.kaidisupplychain.com/180115_5.jpg',
  'https://wl.kaidisupplychain.com/180115_6.jpg'
];

// var goodsList = [];

// var appInstance = getApp();

Page({
  data: {
    imgUrls: imgUrls
  },
  // onLoad: function(e){
  //   this.getList();
  // },
  // onShow: function(e){
  //   this.setData({searchValue: appInstance.globalData.searchValue});
  // },
  onPullDownRefresh: function(e){
    // this.getList();
    wx.stopPullDownRefresh();
  }
  // searchInput: function(e){
  //   appInstance.globalData.searchValue = e.detail.value;
  // },
  // searchConfirm: function(e){
  //   wx.switchTab({
  //     url: "/pages/goods/list",
  //     success: function(e){

  //     }
  //   });
  // },
  // goDetail: function(e){
  //   var dataset = e.currentTarget.dataset;
  //   wx.navigateTo({
  //     url: "/pages/goods/detail?id="+dataset.id,
  //     success: function(e){

  //     }
  //   });
  // },
  // getList: function(){
  //   var userInfo = wx.getStorageSync('userInfo');
  //   var _this = this;
  //   wx.request({
  //     url: 'https://wl.kaidisupplychain.com/api/item-recommend',
  //     data: {
  //       api_token: userInfo.api_token
  //     },
  //     method: 'POST',
  //     success: function(res) {
  //       var resData = res.data;
  //       if(resData.error){
  //         wx.showToast({
  //           title: resData.msg,
  //           image: '../../resources/cancel.png'
  //         });

  //         return;
  //       }
  //       goodsList = [];
  //       var row = [];
  //       for(var i in resData.data){
  //         row.push({
  //           id: resData.data[i].id,
  //           name: resData.data[i].product_name
  //         });

  //         if(i % 2 == 1){
  //           goodsList.push(row);
  //           row = [];
  //         }
  //       }

  //       if(row.length == 1)
  //       {
  //         row.push({
  //           id: 0,
  //           name: ''
  //         });
  //         goodsList.push(row);
  //         row = [];
  //       }

  //       _this.setData({goodsList: goodsList});
  //     }
  //   });
  // }
});