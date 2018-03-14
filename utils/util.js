function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkLocal(redirect){
  var now = Date.parse(new Date());
  var userInfo = wx.getStorageSync('userInfo');
  if(userInfo.api_token){
    return true;
  }else{
    if(redirect){
      wx.navigateTo({
        url: "/pages/passport/login",
        success: function(e){

        }
      });
    }

    return false
  }
}

function checkRemote(res, redirect){
  if(res.error && res.msg == 'Unauthenticated'){
    wx.setStorageSync('userInfo', {});
    if(redirect){
      wx.navigateTo({
        url: "/pages/passport/login",
        success: function(e){

        }
      });
    }

    return false;
  }

  return true;
}

module.exports = {
  formatTime: formatTime,
  checkLocal: checkLocal,
  checkRemote: checkRemote
}
