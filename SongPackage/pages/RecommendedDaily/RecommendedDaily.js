import request from '../../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'',
        month:'',
        recommendlist:[],
        index:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = wx.getStorageSync('userInfo')
        let login_cookie = wx.getStorageSync('cookie')
        // if(!userInfo){
        if(!login_cookie){
            wx.showToast({
              title: '请先登录',
              icon:'error',
              success:()=>{
                  wx.navigateTo ({
                    url: '/pages/login/login',
                  })
              }
            })
        }
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth() +1
        })
        //获取每日推荐歌曲
        this.getRecommendlist()
    },
    //获取每日推荐歌曲
    async getRecommendlist(){
        let cookie = wx.getStorageSync('cookie')
        let recommendlistData  = await request('/recommend/songs',{cookie})
        // console.log(recommendlistData);
        this.setData({
            recommendlist:recommendlistData.data.dailySongs
        })
    },
    toMusicDetail(event){
        let {musicid,index} = event.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
          url: '/SongPackage/pages/SongDetail/SongDetail?songid='+JSON.stringify(musicid)+'&index='+this.data.index,
          success:(res)=>{
            res.eventChannel.emit('musicList',{musicList: this.data.recommendlist})
          }
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