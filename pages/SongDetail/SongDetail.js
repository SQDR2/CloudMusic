import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isplay:false,
        song:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let musicid = JSON.parse(options.songid)
        this.getSongdetail(musicid)

        this.backgroundaudio = wx.getBackgroundAudioManager();
        this.backgroundaudio.onPause(()=>{
            this.setData({
                isplay:false
            })
        })
        this.backgroundaudio.onPlay(()=>{
            this.setData({
                isplay:true
            }) 
        })
    },
    async getSongdetail(mid){
        let songdata = await request('/song/detail',{ids:mid})
        this.setData({
            song:songdata.songs[0]
        })
        wx.setNavigationBarTitle({
          title: this.data.song.name
        })
    },
    MusicPLay(){
        let isplay  = !this.data.isplay
        this.musicControl(isplay)
    },
    async musicControl(isplay){

        if(isplay){
            let musicData = await request('/song/url',{id:this.data.song.id})
            let musiclink = musicData.data[0].url
            this.backgroundaudio.src=musiclink
            this.backgroundaudio.title=this.data.song.name
        }else{
            this.backgroundaudio.pause();
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