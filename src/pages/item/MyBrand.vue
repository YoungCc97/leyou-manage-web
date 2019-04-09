<template>
    <div>
      <v-layout class="px-3 pb-2">
        <v-flex xs2>
          <v-btn @click="addBrand" color="primary">新增品牌</v-btn>
        </v-flex>
        <v-spacer/>
        <v-flex xs4>
          <v-text-field label="搜索" hide-details append-icon="search" v-model="key"></v-text-field>
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="brands"
        :pagination.sync="pagination"
        :total-items="totalBrands"
        :loading="loading"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">
            <img v-if="props.item.image!=''" :src="props.item.image" width="130" height="40">
            <span v-else>
              无
            </span>
          </td>
          <td class="text-xs-center">{{ props.item.letter }}</td>
          <td class="text-xs-center">
            <v-btn flat icon color="info">
              <v-icon small>edit</v-icon>
            </v-btn>
            <v-btn flat icon color="error">
              <v-icon small>delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
      <v-dialog v-model="show" max-width="600" scrollable v-if="show">
        <v-card>
          <v-toolbar dark dense color="primary">
            <v-toolbar-title>{{isEdit ? '修改品牌' : '新增品牌'}}</v-toolbar-title>
            <v-spacer/>
            <v-btn icon @click="show = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="px-5 py-2">
            <!-- 表单 -->
            <brand-form :oldBrand="brand" :isEdit="isEdit" @close="show = false" :reload="loadBrands"/>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
    import BrandForm from './BrandForm'
    export default {
      name: "MyBrand",
      components: {
        BrandForm
      },
      data(){
          return{
            headers:[
              { text: "品牌id",value: "id",align: 'center',sortable: true },
              { text: "品牌名称",value: "name",align: 'center',sortable: false },
              { text: "品牌LOGO",value: "image",align: 'center',sortable: false },
              { text: "品牌首字母",value: "letter",align: 'center',sortable: true },
              { text: "操作",align: 'center',sortable: false },
            ],
            brands:[],
            pagination:{},
            totalBrands: 0,
            loading: false,
            key:"",//搜索条件
            show: false,// 是否弹出窗口
            brand: {}, // 品牌信息
            isEdit: false // 判断是编辑还是新增
          }
      },
      created(){
        // 去后台查询
        this.loadBrands();
      },
      watch:{
        key(){
          this.pagination.page = 1;
          this.loadBrands();
        },
        pagination:{
          deep: true,
          handler(){
            this.loadBrands();
          }
        },
        show(val, oldVal) {
          // 表单关闭后重新加载数据
          if (oldVal) {
            this.getDataFromApi();
          }
        }
      },
      methods:{
        addBrand() {
          this.brand = {};
          this.isEdit = false;
          this.show = true;
        },
        loadBrands(){
          this.loading = true;
          this.$http.get("/item/brand/page",{
            params:{
              page: this.pagination.page,//当前页
              rows: this.pagination.rowsPerPage,//每页大小
              sortBy: this.pagination.sortBy,//排序字段
              desc: this.pagination.descending,//是否降序
              key: this.key,//搜索条件
            }
          }).then(resp => {
            this.brands = resp.data.items;
            this.totalBrands = resp.data.total;
            this.loading = false;
          })
        }
      }
    }
</script>

<style scoped>

</style>
