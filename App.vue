<script>
export default {
  onLaunch: function() {
    let t = this;
    console.log("App Launch");
  },
  onShow: function() {
    let t = this;
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  globalData:{
    hotelList:'6666'
  }
};
</script>

<style>
@import "./static/css/animate.min.css";
@import "./static/icon/font.css";
page {
  --themeColor: #7f9ff3;
  --greenColor: #00b26a;
  --nodeColor: #ededed;
  --contentBgc: #f6f9fe;
  --megColor: #54b5c9;
  --megsColor: #7f9ff3;
  --detailColor: #a2a2a2;
  --priceColor: #fc914c;
  --lineColor: #ededed;
  /* 未触发事件时的按钮背景色和字体颜色 */
  --remarksColor: #f7f7f7;
  --remarksFontColor: #adadad;
  /* 字体大小 */
  --iconSize: 40rpx;
  --bigTitleSize: 40rpx;
  --titleSize: 36rpx;
  --navFontSize: 32rpx;
  --normalFontSize: 28rpx;
  --normalTitleSize: 24rpx;
  --scenicTitleSize:28rpx;
  --stateBtnSize: 18rpx;
  --smallFontSize: 20rpx;
  --priceSize: 24upx;

  /* 页面左右边距 */
  --sideMargin: 40rpx;
  /* 设备管理栏目高度 */
  --navHeight: 80rpx;
  /* 容器间距 */
  --viewMargin: 20rpx;
  /* 字体间距 */
  --paddingMargin: 20rpx;
}
* {
  box-sizing: border-box;
}
</style>
