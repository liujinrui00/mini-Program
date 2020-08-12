Page({
  data: {
    userinfo:{},
    //被收藏的商品的数量
    collectNums:0
  },
  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    const collectNums=wx.getStorageSync("collect")||[];
      
    this.setData({
        userinfo,
        collectNums:collectNums.length
      })
  }
})