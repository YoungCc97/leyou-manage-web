import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    route("/login",'/Login',"Login"),
    {
      path:"/",
      component: () => import('../pages/Layout'),
      redirect:"/index/dashboard",
      children:[
        route("/index/dashboard","/Dashboard","Dashboard"),
        //第一个参数：对应的路径   第二个参数：对应的组件位置  第三个参数：对应的组件名称
        route("/item/category",'/item/Category',"Category"),
        route("/item/brand",'/item/MyBrand',"Brand"),
        route("/item/list",'/item/Goods',"Goods"),
        route("/item/specification",'/item/Specification',"Specification"),
        route("/user/statistics",'/item/Statistics',"Statistics"),
        route("/trade/promotion",'/trade/Promotion',"Promotion")
      ]
    }
  ]
})
