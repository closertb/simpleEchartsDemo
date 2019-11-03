<template>
  <div class="out-frame" :id="singleId">
    <frame-header :info="information"></frame-header>
    <!--定义标题边框，并预留内容边框-->
    <div class="model-content">
      <div class="analyse-chart" id="highOpinionChart"></div>
    </div>
  </div>
</template>

<script>
import {convertRadarData,RadarAutoTip} from '../js/tools'
export default {
  name: 'favorCity',
  mounted(){
    const datas =[{cnName:'JS',allTotal:100,total:85},
      {cnName:'CSS',allTotal:100,total:75},
      {cnName:'React',allTotal:100,total:55},
      {cnName:'jQuery',allTotal:100,total:85},
      {cnName:'Vue',allTotal:100,total:72},
      {cnName:'HTML',allTotal:100,total:80}
    ];
      this.drawRadar(datas);
  },
  data () {
    return {
      singleId:'radar'+Math.ceil(Math.random()*10000),
      msg: 'small model',
      information:{
        name:'简历投递转化率'
      }
    }
  },
  methods:{
    drawRadar:function (data) {
      const target = document.getElementById(this.singleId).querySelector('#highOpinionChart'),
        originData = [
          {value: 100, name: '投递'},
          {value: 50, name: '被查看'},
          {value: 28, name: '邀请面试'},
          {value: 6, name: '收到offer'}
        ],
        realData=[
          {value: 50, name: '被查看'},
          {value: 28, name: '邀请面试'},
          {value: 6, name: '收到offer'},
          {value: 1, name: '入职'}
        ],
        option = {
        tooltip: {
          show:false
        },
        grid:{
          top:'10%'
        },
        series: [
          {
            name: '找工作的过程',
            type: 'funnel',
            left: '10%',
            width: '80%',
            label: {
              normal: {
                formatter: '{b}'
              },
              emphasis: {
                position:'inside',
                formatter: '{b}:{c}'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                opacity: 0.7
              }
            },
            data: originData
          },
          {
            name: '找工作的过程',
            type: 'funnel',
            left: '10%',
            width: '80%',
            maxSize: '80%',
            label: {
              normal: {
                position: 'inside',
                formatter: function (params) {
                  let index = params.dataIndex;
                  return realData[index].name +':'+ (realData[index].value*100/originData[index].value).toFixed(1)+'%';
                },
                textStyle: {
                  color: '#fff'
                }
              },
              emphasis: {
                position: 'inside',
                formatter: function (params) {
                  let index = params.dataIndex;
                  return realData[index].name +':'+ (realData[index].value*100/originData[index].value).toFixed(1)+'%';
                },
                textStyle: {
                  color: '#fff'
                }
              }
            },
            itemStyle: {
              normal: {
                opacity: 0.5,
                borderColor: '#fff',
                borderWidth: 2
              }
            },
            data: realData
          }
        ]
      };
      var myChart = this.$echarts.init(target);
      myChart.setOption(option);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
$bgColor: '#013bba';
$singleColor:'#1f5fd3';
$triangleColor:'#003596';

h1, h2 {
  font-weight: normal;
}

ul,li {
  list-style-type: none;
  padding: 0;
}

</style>
