<template>
  <div class="out-frame" :id="singleId">
    <frame-header :info="information"></frame-header>
    <!--定义标题边框，并预留内容边框-->
    <div class="model-content">
      <div class="analyse-chart" id="mapChart"></div>
    </div>
  </div>
</template>

<script>
  import {addSeparator} from '../js/tools';
  import {themeColor} from '../theme/base';
  export default {
    name: 'favorScenic',
    mounted() {
      const datas = [{name: "成都市", value: 800},
        {name: "绵阳市", value:600},
        {name: "德阳市", value:500},
        {name: "广元市", value: 300}];
      this.initChart(datas);
    },
    data() {
      return {
        singleId: 'radar' + Math.ceil(Math.random() * 10000),
        msg: 'small model',
        information: {
          name: '职位数据分布',
          link: 'http:localhost:8080',
          dataSource: 'smallFlag'
        }
      }
    },
    methods: {
      initChart: function (data) {
        const target = document.getElementById(this.singleId).querySelector('#mapChart'),
          option = {
            tooltip: {
              show: true,
              position:function (point,params,dom,rect,size) {
                return [point[0]-size.contentSize[0]/2,point[1]-size.contentSize[1]-10];
              },
              formatter:function (param) {
                let html = '<div class="tool-tip"><h3 style="color:#d3edff;text-align: center;">'
                  + param.seriesName+'</h3><div style="padding: 3px 0;color:#8bb8e8;text-align: left;">'
                  +param.data.name +
                  ':<label <span style="color:#ffbf00;font-weight: bold;font-size:14px;padding: 0 5px;">'+param.data.value+'万个</label>' +
                  '</div></div>';
                return html
              }
            },
            visualMap: {
              min: 0,
              max: 1000,
              left: 'left',
              top: 'bottom',
              color:['#ffb414','#f0dd06','#00bbf0'],
              text: ['高','低'],           // 文本，默认为数值文本
              textStyle:{
                color:'white'
              },
              calculable: true
            },
            geo: {
              map: '四川',
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: '#d3edff'
                  },
                  position: ['50%', '50%'],
                  align: 'center',
                  fontSize: 14,
                  fontWeight: 'bold'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    color: '#d3edff'
                  }
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#45aaff',
                  borderWidth: 1,
                  borderColor: '#122e41'
                },
                emphasis: {
                  show: false,
                  areaColor: '#0083ef'
                }
              },
              roam: false,
              center: [102.9526, 29.8617],
              zoom: 1,
              /* 设置特定区域的样式 */
              regions: []
            },
            series: [{
              type: 'map',
              name:'职位总数',
              geoIndex: 0,
              data: [{name:'成都市',value:750},
                {name:'绵阳市',value:430},
                {name:'德阳市',value:300},
                {name:'自贡市',value:200},
                {name:'广元市',value:100},
                {name:'眉山市',value:80},
                {name:'资阳市',value:70},
                {name:'雅安市',value:50},
                {name:'南充市',value:60},
                {name:'遂宁市',value:20},
                {name:'乐山市',value:80},
                {name:'巴中市',value:20},
                {name:'宜宾市',value:20},
                {name:'泸州市',value:10},
                {name:'内江市',value:10},
                {name:'广安市',value:10},
                {name:'巴中市',value:10},
                {name:'攀枝花市',value:8},
                {name:'达州市',value:10},
                {name:'阿坝藏族羌族自治州',value:5},
                {name:'甘孜藏族自治州',value:5},
                {name:'凉山彝族自治州',value:5}]
            }]
        },
        myChart = this.$echarts.init(target);
        fetch('http://filealiyun.geeker.com.cn/ued/map/regionJson/510000.json', {
          method:'get',
          mode:'cors'
        }).then((response)=>{
          return response.json();
        }).then((data)=>{
          this.$echarts.registerMap('四川', data);
          myChart.setOption(option);
          this.$echarts.AutoShowTip(myChart, option, 3000);
        });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  $bgColor: '#013bba';
  $singleColor: '#1f5fd3';
  $triangleColor: '#003596';

  h1, h2 {
    font-weight: normal;
  }

  ul, li {
    list-style-type: none;
    padding: 0;
  }
  .out-frame{
    position: relative;
    width:950px;
    height: 710px;
  }
</style>
