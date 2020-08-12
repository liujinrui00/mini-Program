import {
  request
} from "../../request/index.js";
import regeneratorRuntime, {
  async
} from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }

    ],
    goodsList: []

  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数，默认为1
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query=options.query|"";
    this.getGoodsList();
  },

  //获取商品列表数据

  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    })
    //获取数据的总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    //   console.log(this.totalPages);

    //   console.log(res);
    this.setData({
      //数据拼接
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
      
  },
  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    //1 获取被点击标题的索引
    const {
      index
    } = e.detail;
    //2 修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //3 赋值到data中
    this.setData({
      tabs
    })
  },

  //页面触底函数
  onReachBottom() {
    //判断是否还有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      //没有下一页数据了
      // console.log(没有了);
      wx.showToast({title: '没有数据了'});

    } else {
      //还有数据
      //console.log(还是有数据);
      this.QueryParams.pagenum++;
      this.getGoodsList()

    }
  },
  
  //下拉刷新事件
  onPullDownRefresh(){
    //1重置数组
    this.setData({
      goodsList:[]
    })
    //2 重置页码
    this.QueryParams.pagenum=1;
    //3 发送请求
    this.getGoodsList();
  }

})