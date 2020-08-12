//index.js
//获取应用实例
const app = getApp()
//引入 用来发送请求的方法 要把路径补全
import{ request } from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperList:[],
    catesList:[],
    floorList:[]
  },
//页面开始加载 就会触发
  onLoad: function (options) {
  this.getSwiperList();
  this.getCateList();
  this.getFloorList();
  },
  //获取轮播图数据
  getSwiperList(){
    request({ url: "/home/swiperdata"})
      .then(result =>{
        result.forEach(v => v.navigator_url=v.navigator_url.replace("main","goods_detail"));
        this.setData({
          swiperList: result
        })
        // console.log(result);
     
      })
    },

    //获取 分类导航数据
    getCateList(){
      request({ url: "/home/catitems"})
        .then(result =>{
          this.setData({
            catesList: result
          })
          // console.log(result);
        })
      },

       //获取 楼层数据
    getFloorList(){
      request({ url: "/home/floordata"})
        .then(result =>{
   // result.forEach(v => v.navigator_url=v.navigator_url.replace("/goods_list","/goods_list/goods_list"));
   for (let k = 0; k < result.length; k++) {
    result[k].product_list.forEach((v, i) => {
        result[k].product_list[i].navigator_url = v.navigator_url.replace('?', '/goods_list?');
    });
}
          this.setData({
            floorList: result
          })
          //console.log(result);
        })
      },

  
})
