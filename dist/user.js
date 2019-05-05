import {User} from 'sx-user'

export default class wxUser extends User{
   constructor() {
      super();
      this.code = ''
      this._wxUserInfo = null
   }

   /**
    * @method init - 初始化用户数据，相当于调用doWxLogin和authSettingUserInfo
    *
    * @return Promise
    */
   init() {
      return Promise.all([
         this.doWxLogin(),
         this.authSettingUserInfo(),
      ])
   }

   /**
    * @method doWxLogin  - 执行微信登录（wx.login)，获取code
    *
    * @return Promise
    */
   doWxLogin() {
      return new Promise((resolve, fail) => {
         // 登录
         wx.login({
            success:res=> {
               this.code = res.code
               resolve(res)
            }, fail
         })
      })
   }

   /**
    * @method authSettingUserInfo - 判断用户授权，获取并保存授权数据到用户数据中(setWxUserInfo)
    *
    * @return Promise
    */
   authSettingUserInfo(){
      return new Promise((resolve, fail) => {
         wx.getSetting({
            success: res => {
               if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                     success: res => {
                        this.setWxUserInfo(res)
                        resolve(res)
                     },
                     fail
                  })
               } else
                  resolve()
            },
            fail
         });
      })
   }

   /**
    * @method getWxUserInfo - 获取授权数据
    *
    * @param {Boolean} sync=false - 同步获取
    *
    * @return {Object|Null|Promise}
    */
   getWxUserInfo(sync = false) {
      return sync ? this._wxUserInfo :
         new Promise((resolve) => {
            let event = this.event;
            this._wxUserInfo ?
               resolve(this._wxUserInfo) :
               event.$on('setWxUserInfo', onInit)
            function onInit(userInfo) {
               event.$off('setWxUserInfo', onInit)
               onInit = null;
               resolve(userInfo);
            }
         })
   }

   /**
    * @method setWxUserInfo - 保存用户授权数据
    */
   setWxUserInfo(wxUserInfo) {
      if(!wxUserInfo || typeof wxUserInfo !== 'object')
         return console.error(wxUserInfo,'is not a object!')
      this._wxUserInfo = Object.assign(this._wxUserInfo || {},wxUserInfo)
      this.event.$emit('setWxUserInfo',wxUserInfo)
   }

}
