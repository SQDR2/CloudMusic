// pages/index/index.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showIndex: null,//打开弹窗的对应下标
        height: '',//屏幕高度
        //上面的是弹窗功能变量
        bannerlist: [],//轮播图数据
        recommendlist: [],//推荐歌单
        toplist: []//排行榜歌曲
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.openPopup(1)
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
        // 轮播图
        let bannerlistdata = await request('/banner', { type: 2 })
        this.setData({
            bannerlist: bannerlistdata
        })
        // 推荐歌单
        let recommendlistdata = await request('/personalized', { limit: 10 })
        this.setData({
            recommendlist: recommendlistdata.result
        })
        // 获取热歌风向标
        let resultArr = []
        let List_songs_data = await request('/toplist')
        List_songs_data = List_songs_data.list.splice(0, 4)
        for (let i = 0; i < List_songs_data.length; i++) {
            let toplistdata = await request(`/playlist/track/all?id=${List_songs_data[i].id}&limit=5&offset=0`)
            let toplistItem = { name: List_songs_data[i].name, tracks: toplistdata.songs }
            resultArr.push(toplistItem)
        }
        //data放在这里更新，用户体验会好，但是渲染次数会增多
        this.setData({
            toplist: resultArr
        })
        // console.log(this.data.toplist)
        // 获取热歌风向标
        // while(index<5){
        //     let toplistdata = await request('/top/list',{idx:index++})
        //     let toplistItem = {name:toplistdata.playlist.name,tracks:toplistdata.playlist.tracks.slice(0,3)}
        //     resultArr.push(toplistItem)
        //     //data放在这里更新，用户体验会好，但是渲染次数会增多
        //     this.setData({
        //         toplist : resultArr
        //     })
        // }
        //data数据在这里更新，用户会长时间白屏，但是渲染次数减少
        // this.setData({
        //     toplist : resultArr
        // })
    },
    toRecommedDaily() {
        wx.navigateTo({
            url: '/SongPackage/pages/RecommendedDaily/RecommendedDaily',
        })
    },


    // 打开弹窗
    openPopup(index) {
        this.setData({
            showIndex: index
        })
    },
    //关闭弹窗
    closePopup() {
        this.setData({
            showIndex: null
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        var that = this;
        // 动态获取屏幕高度
        wx.getSystemInfo({
            success: (result) => {
                that.setData({
                    height: result.windowHeight
                });
            },
        })
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