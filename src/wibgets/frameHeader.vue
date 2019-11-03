<!--
* Title:
* @author Mr Denzel
* @create Date 2017-10-26 09:19
* @version 1.0
* Description:
-->
<template>
  <!--定义标题边框，并预留内容边框-->
      <div class="model-head">
      <!--定义四周的边框和三角样式-->
      <span class="left-top">
      <span class="left-triangle"></span>
    </span>
      <span class="right-top">
      <span class="right-triangle"></span>
    </span>
      <div class="head-content">
        <span class="model-title">{{info.name}}</span>
        <span  v-if="info.dataSource" class="model-source">数据来源：{{info.dataSource}}</span>
      </div>
      </div>
</template>

<script>
  export default {
    name: 'frameHeader',
    props:['info']
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  $singleColor:'#1f5fd3';
  $triangleColor:'#003596';

  h1, h2 {
    font-weight: normal;
  }

  ul,li {
    list-style-type: none;
    padding: 0;
  }

  .model-head{
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    top:0;
    left:0;
    height:40px;
    border-bottom: 1px solid $segmentLine;
    border-radius: 5px;
    @mixin little-single{
      position: absolute;
      display: block;
      width:9px;
      height:9px;
      border:1px solid #1f5fd3;
    }
    .left-top {
      top:-1px;
      left:-1px;
      @include little-single;
      border-bottom: none;
      border-right: none;
    }
    .right-top {
      top:-1px;
      right:-1px;
      @include little-single;
      border-bottom: none;
      border-left: none;

    }
    @mixin triangle{
      display: block;
      position: absolute;
      width:0;
      height:0;
      border-color: transparent #003596;
      border-width: 0 0 7px 7px;
      border-style: solid;
    }
    .left-triangle{
      top:1px;
      left:1px;
      @include triangle;
    }
    .right-triangle{
      top:1px;
      right:1px;
      @include triangle;
      transform: rotate(90deg);
    }
  }
  .model-title{
    position: absolute;
    display: inline-block;
    left:15px;
    bottom: -1px;
    color:#b4d1e6 ;
    font: normal 16px/38px  'Microsoft YaHei';
    border-bottom: 1px solid rgba(180,208,230,.5);
  }
  .model-source{
    position: absolute;
    display: inline-block;
    right:15px;
    bottom: -1px;
    color:#728cc9 ;
    font: normal 14px/38px  'Microsoft YaHei';
  }
</style>
