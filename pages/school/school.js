const app = getApp()
Page({
  data: {
    schoolId: '',
    type: 1,
    tab: [{ text: '空闲率↓', value: 1 }, { text: '离我最近', value: 0 }],
    typeList: [
      { value: 'highRate', color: '#0adaf6', text: '>50%' },
      { value: 'middleRate', color: '#b651af', text: '20%~50%' },
      { value: 'lowRate', color: '#fa7860', text: '<20%' }
      ]
  },
  onLoad: function (options) {
    wx.setStorageSync('schoolId', options.id)
    wx.setStorageSync('schoolName', options.name)
    this.setData({
      schoolId: options.id
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.getBuildingInfo()
  },
  onPullDownRefresh: function () {
    this.getBuildingInfo()
  },
  getBuildingInfo: function () {
    wx.request({
      url: app.globalData.prefix + '/school/queryBuildingSeatfreeRate',
      method: 'POST',
      data: { schoolId: this.data.schoolId, type: this.data.type },
      header: {'content-type': 'application/json'},
      success: res => {
        this.setData({
          buildingList: res.data.data
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  typeChange: function (e) {
    this.setData({
      type: e.currentTarget.dataset.value
    })
  }
})