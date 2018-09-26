const app = getApp()
Page({
  data: {
    buildingId: '',
    type: 1,
    tab: [{ text: '空闲率↓', value: 1 }, { text: '教室名称↑', value: 2 }],
    bdImgList: ['/image/80.png', '/image/50.png', '/image/20.png'],
    classroomList: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      buildingId: options.buildingId,
      seatFree: options.seatFree,
      sum: options.sum
    })
    this.getClassroomInfo()
  },
  onPullDownRefresh: function () {
    this.getClassroomInfo()
  },
  getClassroomInfo () {
    wx.request({
      url: app.globalData.prefix + '/classroom/queryClassroomFreeRateByBuildingId',
      method: 'POST',
      data: { buildingId: this.data.buildingId, type: this.data.type },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let result = res.data.data, len = result.length, arr = []
        for (var j = 0; j < len; j++) {
          result[j].freeRate = parseInt(result[j].freeRate)
          if (result[j].freeRate > 50) {
            result[j].status = 0
            result[j].step = (92 - result[j].freeRate) * 0.8 + 'rpx'
          } else if (result[j].freeRate <= 20) {
            result[j].status = 2
            result[j].step = (92 - result[j].freeRate) * 0.8 + 'rpx'
          } else {
            result[j].status = 1
            result[j].step = (92 - result[j].freeRate) * 0.8 + 'rpx'
          }
        }
        for (var i = 0; i < len; i += 3) {
          arr.push(result.slice(i, i + 3))
        }
        this.setData({classroomList: arr})
        wx.stopPullDownRefresh()
      }
    })
  },
  typeChange: function (e) {
    this.setData({
      type: e.currentTarget.dataset.value
    })
    this.getClassroomInfo()
  }
})