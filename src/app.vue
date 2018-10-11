<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// const setFont = ()=>{
//     //document.body.clientWidth;  屏幕VIEWPORT宽度
//     //document.documentElement.clientWidth;
//     let html = document.querySelector('html');
//     //document.getElementsByTagName('html')[0]
//     let font = window.innerWidth / 10;
//     font = font>50?50:font;
//     html.style.fontSize = font+'px';
// };
// window.onresize = function(){
//   setFont();
// }
document.addEventListener('DOMContentLoaded',setFont);
export default {
  name: 'app'
}
</script>

