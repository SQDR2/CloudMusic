import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        key: '',
        //二维码
        QRcode: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getQRcode();
        this.getQRLoginStatus();
        console.log(getCurrentPages())
    },
    //获取二维码
    async getQRcode() {
        const res = await request(`/login/qr/key?timerstamp=${Date.now()}`);
        this.setData({
            key: res.data.unikey
        })
        const res2 = await request(`/login/qr/create?key=${this.data.key}&qrimg=true?timerstamp=${Date.now()}`)
        this.setData({
            QRcode: res2.data.qrimg
        })
    },
    //检查登录状态
    async getQRLoginStatus(cookie = '') {
        let timer;
        timer = setInterval(async () => {
            //检查二维码扫描状态
            let statusRes = await request(`/login/qr/check?key=${this.data.key}&timerstamp=${Date.now()}`)
            console.log(statusRes)
            if (statusRes.code === 800) {
                wx.showToast({
                    title: '二维码已过期,请重新获取',
                    icon: 'error'
                })
                clearInterval(timer)
            }
            if (statusRes.code === 803) {
                wx.showToast({
                    title: '授权成功!',
                    icon: 'success'
                })
                // 这一步会返回cookie
                clearInterval(timer)
                //   await this.getLoginStatus(statusRes.cookie)
                //   localStorage.setItem('cookie', statusRes.cookie)
                wx.setStorageSync('cookie', statusRes.cookie)
                wx.navigateBack({
                    delta:4
                })
            }
        }, 3500)
    },
    //二维码过期 刷新二维码
    RefreshQRcode() {
        console.log("刷新了")
        this.getQRcode();
        this.getQRLoginStatus();
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