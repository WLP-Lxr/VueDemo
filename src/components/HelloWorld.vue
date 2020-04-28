<template>
    <div class="hello">
        <h1>{{msg}}</h1>
        <el-radio v-model="radio" label="1">备选项</el-radio>
        <el-radio v-model="radio" label="1">备选项</el-radio>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    data() {
        return{
            msg: "welcome tp your Vue.js APP",
            radio: '1'
        }
    }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
