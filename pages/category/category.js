import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    //菜单绑定
    currentIndex:0,
    //右侧商品滚动条
    srollTop:0

  },

  //接口返回的数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    web中的本地存储和小程序中的本地存储的去别
      写代码方式不一样
        web:localStorage.setItem("key","value")   获取localStorage.getItem("key")
      小程序：wx.setStorageSync("key","value")      获取wx.setStorageSync("key")
    先判断一下本地存储中有没有旧的数据
      {time:Data.now(),data:[]}
    没有旧的数据 直接发送请求
    有旧的数据并且没有过期就是用本地数据
    */ 

    //1 获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    //2 判断
    if(!Cates){
      //不存在  发送请求获取数据
      this.getCates();
    }else{
      // 有旧的数据 定义过期时间  10s
      if(Date.now()-Cates.time > 1000 * 10){
        //数据过期 重新发请求
        this.getCates();
      }else{
        //直接使用旧数据
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        //构造右侧商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
 
      }
    }
     
  },
  //获取分类数据
  
  async  getCates(){
      // request({
      //   url: "/categories"
      // })
      // .then(res =>{
      //  // console.log(res);
      //   this.Cates=res.data.message;

      //   //把接口数据存入到本地存储中。
      //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
        
      //   //构造左侧的大菜单数据
      //   let leftMenuList=this.Cates.map(v=>v.cat_name);
      //   //构造右侧商品数据
      //   let rightContent=this.Cates[0].children;
      //   this.setData({
      //     leftMenuList,
      //     rightContent
      //   })

       
      // })
      const res=await request({url:"/categories"});
      this.Cates=res;

        //把接口数据存入到本地存储中。
        wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
        
        //构造左侧的大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        //构造右侧商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
    },

    //点击事件
    handleItemTap(e){
      /*
      1 获取被点击的标题身上的索引
      2 给data中的currentIndex赋值就可以了
      3 根据不同的索引渲染商品内容
      */
     const {index}=e.currentTarget.dataset;
     let rightContent = this.Cates[index].children;
     this.setData({
      currentIndex:index,
      rightContent,
      srollTop:0
     })

    }

  
})