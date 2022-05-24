import config from './config'
export default (url, data={},method='GET')=>{
    return new Promise((resolve,reject)=>{
        wx.request({
            url:config.mobilehost+url,
            data,
            method,
            header:{
                cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U')!==-1):''
            },
            success:(res)=>{
                if(data.isLogin){
                    console.log(res);
                    wx.setStorage({
                        key:'cookies',
                        data:res.cookies
                    })
                }
                // console.log(res);
                resolve(res.data)
            },
            fail:(err)=>{
                // console.log(err);
                reject(err);
            }
        })
    })
}