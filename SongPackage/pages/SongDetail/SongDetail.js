import request from '../../../utils/request'
import dayjs from '../../dayjs/index'
// let dayjs = request('dayjs')
const appInstance = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isplay:false,
        musicid:'',
        song:{},
        index:0,     //当前音乐在每日推荐歌单数组的下标
        musicList:[],
        musiclink:'',
        currentTime:'00:00',
        totalTime:'00:00',  //总播放时间
        currentWidth:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取推荐音乐歌单
        //	获取所有打开的EventChannel事件
        const eventChannel = this.getOpenerEventChannel();
        // 监听 index页面定义的 musicList 事件(每日推荐的歌单)
        eventChannel.on('musicList', (res) => {
            this.setData({
                musicList:res.musicList
            })
        })
        //获取音乐id
        let musicid = JSON.parse(options.songid)
        // console.log(JSON.parse(options.index));
        this.setData({
            index:JSON.parse(options.index),
            musicid
        })
        //获取音乐link
        this.getSongdetail(musicid)
        // 判断全局音乐播放标签是否为真和当前音乐播放音乐id和当前音乐详情页面的id是否一致
        if(appInstance.globaldata.isMusicPlay && appInstance.globaldata.musicid === musicid){
            this.setData({
                isplay:true
            })
        }
        // 创建背景音乐监听实例
        this.backgroundaudio = wx.getBackgroundAudioManager();
        // 背景音乐暂停事件
        this.backgroundaudio.onPause(()=>{
            this.changeMusicState(false)
        })
        // 背景音乐播放事件
        this.backgroundaudio.onPlay(()=>{
            this.changeMusicState(true)
            appInstance.globaldata.musicid = musicid
        })
        // 背景音乐暂停事件
        this.backgroundaudio.onStop(()=>{
            this.changeMusicState(false)
        })
        // 监听背景音频播放进度更新事件
        this.backgroundaudio.onTimeUpdate(()=>{
            // 将实时播放进度转化为毫秒在转化为密mm:ss
            let currentTime = dayjs(this.backgroundaudio.currentTime*1000).format('mm:ss')
            let currentWidth = this.backgroundaudio.currentTime/this.backgroundaudio.duration*450
            this.setData({
                currentTime,
                currentWidth
            })
        })
        // 背景音乐结束
        this.backgroundaudio.onEnded(()=>{
            let index = this.data.index
            if(index === this.data.musicList.length-1){
                this.switchMusicPart(0)
            }else{
                this.switchMusicPart(index+1)
            }
            this.setData({
                currentWidth:0,
                currentTime:'00:00'
            })
        })
    },
    // 修改音乐详情页面的播放状态
    changeMusicState(isplay){
        this.setData({
            isplay:isplay
        })
        appInstance.globaldata.isMusicPlay = isplay
    },
    // 获取音乐详情
    async getSongdetail(mid){
        let songdata = await request('/song/detail',{ids:mid})
        let totalTime=dayjs(songdata.songs[0].dt).format('mm:ss')
        this.setData({
            song:songdata.songs[0],
            totalTime,
        })
        wx.setNavigationBarTitle({
          title: this.data.song.name
        })
    },
    // 点击播放事件
    MusicPLay(){
        let isplay  = !this.data.isplay
        let id = this.data.musicid
        let musiclink = this.data.musiclink
        this.musicControl(isplay,id,musiclink)
    },
    // 音乐控制
    async musicControl(isplay,id,musiclink){
        if(isplay){
            if(!musiclink){
                // console.log(id)
                let musicData = await request('/song/url',{id:id,cookie:wx.getStorageSync('cookie')})
                // console.log(musicData)
                musiclink = musicData.data[0].url
                this.setData({
                    musiclink
                })
            }
            this.backgroundaudio.src=musiclink
            this.backgroundaudio.title=this.data.song.name
        }else{
            this.backgroundaudio.pause();
        }
    },
    // 切换音乐
    switchMusic(event){
        let type = event.currentTarget.id
        let index = this.data.index
        if(type === 'pre'){
            if(this.data.index === 0){ 
                this.switchMusicPart(this.data.musicList.length-1)
            }else{
                this.switchMusicPart(index-1)
            }
        }else{
            if(index === this.data.musicList.length-1){
                this.switchMusicPart(0)
            }else{
                this.switchMusicPart(index+1)
            }
        }
    },
    // 封装切换音乐重复代码
    switchMusicPart(index){
        this.backgroundaudio.onStop(()=>{
            this.changeMusicState(false)
        })
        this.setData({
            index
        })
        let id = this.data.musicList[index].id
        this.getSongdetail(id)
        this.musicControl(true,id)
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