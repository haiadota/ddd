//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    type: 0,
    title: '选择学校',
    tab: [{ text: '高教', value: 1 }, { text: '普教', value: 0 }],
    schoolList: []
  },
  onLoad: function () {
    this.getSchoolInfo()
    var schoolId = wx.getStorageSync('schoolId') || ''
    var schoolName = wx.getStorageSync('schoolName') || ''
    if (schoolId && schoolName) {
      wx.navigateTo({
        url: '../building/building?id=' + schoolId + '&name=' + schoolName
      })
    }
  },
  onHide () {
    wx.setStorageSync('schoolId', '')
    wx.setStorageSync('schoolName', '')
  },
  getSchoolInfo () {
    wx.request({
      url: app.globalData.prefix + '/school/findSchoolList',
      method: 'POST',
      data: {
        type: this.data.type,
        page: { pageSize: 100, pageIndex: 1 }
      },
      header: { 'content-type': 'application/json' },
      success: res => {
        this.setData({
          schoolList: res.data.list
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  typeChange: function (e) {
    this.setData({
      type: e.currentTarget.dataset.value
    })
    this.getSchoolInfo()
  }
})
