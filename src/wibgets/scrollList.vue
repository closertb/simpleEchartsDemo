<template>
  <div class="out-frame" :id="singleId">
    <frame-header :info="information"></frame-header>
    <!--定义标题边框，并预留内容边框-->
    <div class="model-content">
      <simple-list :scroll-data ="mockData" :configParams ="configOption"></simple-list>
    </div>
  </div>
</template>

<script>
  import simpleList from '../components/listSimple.vue'
  export default {
    name: 'scrollList',
    components:{
      'simple-list':simpleList
    },
    beforeMount(){
      const originData = [{name: '我脑中飘来飘去的css魔幻属性', limit: 173},
        {name: '用React写一个数字华容道，你需要知道的秘密', limit: 46},
        {name: 'cors跨域之简单请求与预检请求', limit: 25},
        {name: '动态添加元素绑定事件，造成程序重复执行', limit: 18},
        {name: '我所不注意的那些CSS冷知识', limit: 15},
        {name: '文件上传Content-type multipart/form-data怎么设置', limit: 14},
        {name: 'webpack再入门，说一下那些不入流的知识点', limit: 11},
        {name: '紧跟时尚，Fetch实践那些事', limit: 9},
        {name: 'VUE，关于导航列表样式切换', limit: 9}];
      let total = originData.reduce((prev,cur)=>{
        return ( prev.limit || prev ) + cur.limit;
      });
      this.mockData={
        unit:'赞',
        blocks:originData.map((t)=>{
            t.percent = (t.limit * 100 /total).toFixed(0) + '%';
            return t;
        })

      };
      this.configOption ={
        intervalTime : 5000,
        highRankColor: '#f249e5',
        fillColor:'background-image: linear-gradient(to right,#00d596,#00bbf0)'
      }
    },
/*    created(){
      console.log(this);
      debugger;
    },
    beforeMount(){
      console.log(this);
      debugger;
    },*/
    mounted() {
    },
    data() {
      return {
        singleId: 'radar' + Math.ceil(Math.random() * 10000),
        msg: 'small model',
        information: {
          name: '个人技术文章Top10',
          link: 'http:localhost:8080',
          dataSource: 'closertb.site'
        }
      }
    },
    methods: {
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
</style>
