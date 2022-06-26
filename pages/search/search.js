import request from '../../utils/request'
let isSend = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderKeyword: '',//热搜关键词
        hotlist: [],
        searchContent: '',//搜索框自输入关键字
        SearchList: [] ,  //自输入关键字返回的数据
        historyList: [] 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取热搜关键词
        this.gethotKeyword()
        // 获取热搜榜单
        this.gehotlist()
        // 获取历史记录
        this.gethistoryList()
    },
    // 获取热搜关键词
    async gethotKeyword() {
        let placeholderdata = await request('/search/default')
        this.setData({
            placeholderKeyword: placeholderdata.data.showKeyword
        })
    },
    // 获取热搜榜单
    async gehotlist() {
        let hotlistdata = await request('/search/hot/detail')
        this.setData({
            hotlist: hotlistdata.data
        })
    },
    //获取搜索框自输入关键字
    hanlerinput(event) {
        if (isSend) {
            clearTimeout(isSend)
        }
        isSend = setTimeout(() => {
            // 更新数据
            this.setData({
                searchContent: event.detail.value.trim()
            })
            // 获取搜索数据
            this.getSearchData();
        }, 300)
    },
    // 获取搜索接口的返回的数据
    async getSearchData() {
        if(!this.data.searchContent){ 
            this.setData({
                SearchList:[]
            })
            return
        }
        let {historyList,searchContent} = this.data
        let SearchData = await request('/search', { keywords:searchContent, limit: 10 })
        // 判断这次搜索的关键词在历史记录中存不存在，存在就删除
        if(historyList.indexOf(searchContent) !== -1){
            historyList.splice(historyList.indexOf(searchContent),1)
        }
        // 在重新添加在最前面
        historyList.unshift(searchContent)
        this.setData({
            SearchList: SearchData.result.songs,
            historyList
        })
        // 历史记录存入本地
        wx.setStorageSync('searchHistory', historyList)
    },
    // 获取历史记录
    gethistoryList(){
        let historyList = wx.getStorageSync('searchHistory')
        if(historyList) this.setData({
            historyList
        })
    },
    // 清空表单项的搜索
    clearSearch(){
        this.setData({
            searchContent:'',
            SearchList:[]
        })
    },
    // 清空历史记录
    clearhistory(){
        wx.showModal({
            content:'是否确认清空?',
            success:(res)=>{
                if(res.confirm){
                    this.setData({
                        historyList:[]
                    })
                    wx.removeStorageSync('searchHistory')
                }
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