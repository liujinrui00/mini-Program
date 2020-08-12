/*
  1 发送请求获取数据
  2 点击轮播图 预览大图
    1 给轮播图绑定点击事件
    2 调用小程序的api previewImage
  3 点击加入购物车
    1 绑定点击事件
    2 获取缓存中的购物车数据 数组格式
    3 先判断 当前的商品是否存在于购物车中，
    4 如果存在 修改商品数据 购物车数量++ 重新把购物车数组填充到缓存中
    5 不存在于购物车的数组中 直接给购物车数组添加一个新元素，新元素带上购买数量属性 num
    6 弹出提示

  4 商品收藏
    1 页面onShow的时候，加载缓存中给你的商品收藏的数据
    2 判断当前商品是不是被收藏
      1 是 改变页面的图标
      2 不是 无需操作
    3  点击商品收藏按钮
      1 判断商品是否存在于缓存数组中
      2 已经存在 把该商品删除
      3 没有存在，把该商品添加到收藏数组中，存入缓存中
*/ 
import {request} from "../../request/index.js";
import regeneratorRuntime, {async} from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect:false
  },

  //商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPages = pages[pages.length-1];
    let options=currentPages.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);

  },

  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail?goods_id=${goods_id}",
      data: {
        goods_id
      }
    });
    this.GoodsInfo = goodsObj;
    
    //1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //2 判断当前商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,

        //iphone部分手机不识别webp格式，需要改成jpg格式

        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics

      },
      isCollect
    })
  },

  //可以用
  //   getGoodsDetail(goods_id){
  //     wx.request({
  //     url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",
  //     data:{goods_id},
  //     success:(res)=>{
  //       console.log(res);
  //       this.setData({
  //         goodsObj:res
  //       })
  //     }

  //   })
  // }
  //点击轮播图放大预览
  handlePreviewImage(e) {
    //1 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    //2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });

  },

  //点击加入购物车
  handleCartAdd(){
    //1 获取缓存中的购物车数组
    let cart=wx.getStorageSync("cart")||[];
    //2 判断商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //3 不存在，第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push( this.GoodsInfo);
    }else{
      //4 已经存在了 执行num++
      cart[index].num++;
    }
    // 5 把购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);
    //6 弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true,
      
    });
  },
  //点击收藏
  handleCollect(){
    let isCollect=false;
    //1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //2 判断商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //3 当index!=-1表示已经收藏过
    if(index!==-1){
      //能找到 已经收藏过 在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: false,
      });
    }else{
      //没有被收藏
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: false,
      });
    }
    //4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    //5 修改data
    this.setData({
      isCollect
    })
  }
})

