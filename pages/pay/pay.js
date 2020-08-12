/*
1 页面加载的时候
  1从缓存中获取购物车数据 渲染到页面中，checked=true
2 微信支付
  1 那些人 哪些账户可以实现微信支付
    1 企业账户
    2 企业账户中的小程序后台中 必须给开发者添加上白名单
      1一个appid可以绑定多个开发者
      2这些开发者可以用这个appid和它的开发权限
    3 支付按钮
      1 先判断缓存中有没有token
      2 没有 跳转到授权页面进行获取token
      3 有token,执行下一步
 
 */

import { getSetting, chooseAddress, openSetting, showModal ,showToast,requestPayment} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组  被选中的商品
    cart=cart.filter(v=>v.checked);
    this.setData({ address });
     // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice, 
      totalNum, 
      address
    });
  }, 

  //点击支付按钮
async  handleOredrPay(){
  try {
    
    //1 判断缓存中有没有token
    const token=wx.getStorageSync("token");
    //2 判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }
    // 3 创建订单
    //3.1 准备请求头参数
  //  const header={Authorization:token};
    //3.2 准备请求参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
   //4 发送请求，获得订单编号
   const orderParams={order_price,consignee_addr,goods};
   const {order_number}= await request({url:"/my/orders/create",method:"POST",data:orderParams});
   // console.log(order_number);
  //5 发起预支付接口
    const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
 //   console.log(res);
    //6 发起微信支付
 await requestPayment(pay);
    //console.log(res);
    //7 查询后台订单状态
    const res=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}})
    // console.log(res);
    await showToast({title:"z支付成功"});
    
  } catch (error) {
    await showToast({title:"支付成功"});
    //删除购物车中已经支付的商品
    let newCart=wx.getStorageSync("cart");
    newCart=newCart.filter(v=>!v.checked);
    wx.setStorageSync("cart", newCart);
    console.log(error);
    wx.navigateTo({
      url: '/pages/order/order',
      success: (result)=>{ 
      }
  
    });
    
  }
}
})