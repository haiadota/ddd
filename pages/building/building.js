const app = getApp()
Page({
  data: {
    schoolId: '',
    type: 1,
    tab: [{ text: '空闲率↓', value: 1 }, { text: '离我最近', value: 0 }],
    typeList: [
      { value: 'highRate', src: '/image/buildinggreen.png', color: '#44df98' },
      { value: 'middleRate', src: '/image/buildingyellow.png', color: '#fcae44' },
      { value: 'lowRate', src: '/image/buildingred.png', color: '#ff4736' }
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
        let arr = res.data.data
        for (let i = 0; i < arr.length; i++) {
          let num = arr[i].seatFree/arr[i].sum
          if (num >= 0.6){
            arr[i].type = 0
          } else if (num < 0.2) {
            arr[i].type = 2
          } else {
            arr[i].type = 1
          }
        }
        this.setData({
          buildingList: arr
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