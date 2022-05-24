// pages/index/index.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerlist:[],//轮播图数据
        recommendlist:[],//推荐歌单
        toplist:[]//排行榜歌曲
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // wx.request({
        //   url: 'http://localhost:3000/banner',
        //   data:{
        //       type:2
        //   },
        //   success:(res)=>{
        //       console.log(res);
        //   },
        //   fail:(err)=>{
        //       console.log(err);
        //   }
        // })
        let bannerlistdata = await request('/banner',{type:2})
        this.setData({
            bannerlist:bannerlistdata
        })
        let recommendlistdata = await request('/personalized',{limit:10}) 
        this.setData({
            recommendlist : recommendlistdata.result
        })
        let index = 0;
        let resultArr = []
        while(index<5){
            let toplistdata = await request('/top/list',{idx:index++})
            let toplistItem = {name:toplistdata.playlist.name,tracks:toplistdata.playlist.tracks.slice(0,3)}
            resultArr.push(toplistItem)
            //data放在这里更新，用户体验会好，但是渲染次数会增多
            this.setData({
                toplist : resultArr
            })
        }
        //data数据在这里更新，用户会长时间白屏，但是渲染次数减少
        // this.setData({
        //     toplist : resultArr
        // })
    },
    toRecommedDaily(){
        wx.navigateTo({
          url: '/pages/RecommendedDaily/RecommendedDaily',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})