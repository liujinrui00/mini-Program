import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js";
import { login } from "../../utils/asyncWx.js"
Page({
 async handleGetUserInfo(e){
    //console.log(e);
  //1 获取用户信息
  const {encryptedData,iv,rawData,signature} = e.detail;
  //2 获取小程序登录成功后的code
  const { code }=await login();
  //console.log(code);
  //3 发送请求，获取用户token
  const loginParams={ encryptedData,iv,rawData,signature,code };
  //const token=request({url:"/user/wxopenapp/setting/fastregister",data:loginParams,method:"post"});
  const token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
  //console.log(token);
  //把token存到缓存中
  wx.setStorageSync("token", token);
  //跳回到上一个页面
  wx.navigateBack({
    delta: 1
  });
    
    
    
  
  
}
})