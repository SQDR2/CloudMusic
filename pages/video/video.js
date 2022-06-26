// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList:[],
        Navid:'',
        videoList:[],
        videoID:'',
        videoUpdataTime:[],
        isrefresh:false,
        videoListIndex:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = wx.getStorageSync('userInfo')
        if(!userInfo){
            wx.showToast({
              title: '请先登录',
              icon:'error',
              success:()=>{
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
              }
            })
        }
        this.getvideoGroupList()
    },
    // 获取视频页导航栏
    async getvideoGroupList(){
        let videoGroupListData = await request('/video/group/list')
        this.setData({
            videoGroupList:videoGroupListData.data.slice(0,11),
            Navid:videoGroupListData.data[0].id
        })
        this.getVideoList(this.data.Navid)
    },
    // 改变下划线
    changeActive(event){
        // console.log(event);
        let Navid = event.currentTarget.id
        this.setData({
            Navid:Navid*1,
            videoList:[]
        })
        wx.showLoading({
            title:'正在加载'
        })
        this.getVideoList(this.data.Navid)
    },
    // 获取导航栏下划线处视频列表
    async getVideoList(navid){
        let videoListData = await request('/video/group',{id:navid})
        wx.hideLoading()
        let index = 0
        let videoList = videoListData.datas.map(item=>{
            item.id=index++
            return item
        }
        )
        this.setData({
            videoList,
            isrefresh:false,
            videoListIndex:index
        })
    },
    handlerPlay(event){
        let vid = event.currentTarget.id
        this.setData({
            videoID:vid
        })
        // this.vid = vid
        // this.vid!==vid && this.videoContext && this.videoContext.stop()
        this.videoContext = wx.createVideoContext(vid)
        let {videoUpdataTime} = this.data
        let videoItem =  videoUpdataTime.find(item=>{item.id === vid})
        if(videoItem){
            this.videoContext.seek(videoItem.time)
        }
        this.videoContext.play()
    },
    // 监听视频播放的时间
    handlerUpdateTime(event){
        let videoTimeObj = {id:event.currentTarget.id,time:event.detail.currentTime}
        let {videoUpdataTime} = this.data
        let videoItem = videoUpdataTime.find(item=>item.id === videoTimeObj.id)
        if(videoItem){
            videoItem.time = videoTimeObj.time
        }else{
            videoUpdataTime.push(videoTimeObj)
        }
        this.setData({
            videoUpdataTime
        })
    },
    // 视频播放结束
    handlevideoend(event){
        let {videoUpdataTime} = this.data
        let index = videoUpdataTime.findIndex(item=>item.id === event.currentTarget.id)
        videoUpdataTime.splice(index ,1)
        this.setData({
            videoUpdataTime
        })
    },
    // 下拉刷新
    handleRefresh(){
        this.getVideoList(this.data.Navid)
    },
    // 滚动到底部时
    async handletolow(){
        let videoListData = await request('/video/group',{id:this.data.Navid})
        let newvideoList = videoListData.datas.map(item=>{
            item.id=this.data.videoListIndex++
            return item
        }
        )
        let videoList = this.data.videoList
        videoList.push(...newvideoList)
        this.setData({
            videoList
        })
    },
    tosearch(){
        wx.navigateTo({
          url: '/pages/search/search',
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