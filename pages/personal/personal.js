import request from '../../utils/request'
let startY,moveY,endY,moveDistance;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransfrom:'translateY(0)',
        coverTranstion:'',
        userInfo:{},
        recentPlayList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = wx.getStorageSync('userInfo')
        if(userInfo){
            this.setData({
                userInfo:userInfo
            })
            this.getUserRecentPlayList(this.data.userInfo.userId)
        }
    },
    async getUserRecentPlayList(uid){
        let recentPlayListData = await request('/user/record',{uid:uid,type:0})
        let index = 0;
        let recentPlayList  = recentPlayListData.allData.splice(0,10).map(item=>{
            item.id=index++;
            return item
        })
        this.setData({
            recentPlayList
        })
    },
    handlertouchstart(event){
        this.setData({
            coverTranstion:``
        })
        startY = event.touches[0].clientY
    },
    handlertouchmove(event){
        moveY = event.touches[0].clientY
        moveDistance = moveY-startY
        if(moveDistance <= 0){
            return
        }
        if(moveDistance >= 70){
            moveDistance = 70
        }
        this.setData({
            coverTransfrom:`translateY(${moveDistance}rpx)`
        })
    },
    handlertouchend(event){
        this.setData({
            coverTransfrom:`translateY(0)`,
            coverTranstion:`transform 0.7s linear`
        })
    },
    toLogin(){
        if(!wx.getStorageSync('userInfo')){
            wx.navigateTo({
                url: '/pages/login/login',
              })
        }else{
            wx.showToast({
                title: '您已经登录了！登录其他账号请退出当前账号！',
                icon:'error'
              })
        }
    },
    async logout(){
        if(wx.getStorageSync('userInfo')){
            wx.removeStorageSync('cookie')
            wx.removeStorageSync('userInfo')
            wx.reLaunch({
                url: '/pages/personal/personal',
            })
        }else{
            wx.showToast({
              title: '无用户登录',
              icon:'error'
            })
        }
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