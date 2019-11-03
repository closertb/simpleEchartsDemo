<template>
  <div class="out-frame" :id="singleId">
    <frame-header :info="information"></frame-header>
    <!--定义标题边框，并预留内容边框-->
    <div class="model-content">
      <div class="analyse-chart" id="trendAnalyseChart"></div>
      <div class="analyse-list">
        <simple-list :scroll-data ="mockData" :configParams ="configOption"></simple-list>
      </div>
    </div>
  </div>
</template>

<script>
  import {addSeparator} from '../js/tools';
  import {themeColor} from '../theme/base';
  import simpleList from '../components/listSimple.vue'

  export default {
    name: 'favorScenic',
    components:{
      'simple-list':simpleList
    },
    beforeMount(){
      this.listData=[{name: "成都市", value: 750},
        {name: "绵阳市", value:430},
        {name: "其他城市", value: 400},
        {name: "德阳市", value:300},
        {name: "自贡市", value: 200},
        {name: "广元市", value: 100}];
      const total = this.listData.reduce((prev,cur)=>{
        return (prev.value||prev)+cur.value;
      });
      const transformData = this.listData.map((t)=>{
        return {
          name:t.name,
          limit:t.value,
          percent:(t.value*100/total).toFixed(0)+'%'
        }
      });
      this.mockData={
        unit:'万个',
        blocks:transformData
      };
      this.configOption ={
        size         : 'mini',
        intervalTime : 5000,
        fillColor:'background-image: linear-gradient(to right,#2f88ff,#c664ff)'
      }
    },
    mounted() {
      this.initChart(this.listData);
    },
    data() {
      return {
        singleId: 'radar' + Math.ceil(Math.random() * 10000),
        msg: 'small model',
        information: {
          name: 'IT职位资源分布百分比',
          link: 'http:localhost:8080',
          dataSource: 'smallFlag'
        }
      }
    },
    methods: {
      initChart: function (data) {
        const target = document.getElementById(this.singleId).querySelector('#trendAnalyseChart'),
        option = {
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(0,0,0,0.6)',
              formatter: function (param) {
                var res = '';
                if (param) {
                  res += '<p style="padding: 3px 0"> ' + param.data.name + ': <span style="color:#ffbf00;font-weight: bold;font-size:14px;" >' + '</span><span style="color:#ffbf00;font-weight: bold;font-size:14px;" >(' + param.percent + '%)</span></p>';
                }
                return res;
              },
              position: function (p) {
                var x = p[0] + p[0] * 0.2,
                  y = p[1];
                return [x, y];
              }
            },
            legend: {
              show: false,
              orient: 'horizontal',
              bottom: 10,
              left: '10%',
              width: 250,
              align: 'left',
              data: data.map((t)=>{return t.name}),
              itemWidth: 12,
              itemHeight: 8,
              textStyle: {
                color: '#a9c7dc'
              }
            },
            series: [
              {
                name: '',
                type: 'pie',
                selectedMode: 'single',
                radius: ['25%', '50%'],
                center: ['54%', '50%'],
                color: ['#8c64ff', '#00cab5', '#0e8cf6', '#00be55', '#f0dd06', '#00a2ff'],
                label: {
                  position:'inisde',
                  normal: {
                    show: true
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                data: data
              }
            ]
          },
        myChart = this.$echarts.init(target);
        myChart.setOption(option);
        this.$echarts.AutoShowTip(myChart, option, 3000);
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
  .analyse-chart{
    width:60%;
  }
  .analyse-list{
    position: absolute;
    left:60%;
    width:40%;
    top:40px;
    bottom: 0;
  }

</style>
