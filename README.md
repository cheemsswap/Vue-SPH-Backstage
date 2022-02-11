### 第一步：分析模板目录结构

```bash
    ---build
        ---index.js    webpack配置文件 
    ---mork             mork数据                
        ---index.js     
    ---node_modules     依赖文件
    ---src              项目源代码
        ---api          请求相关的代码
        ---assets       静态文件
        ---components   组件
        ---icons        icon图标
        ---layout       里面有一些组件和混入
        ---router       路由
        ---store        Vuex仓库
        ---styles       样式文件
        ---utils        工具文件
            ---request.js  axios的二次封装
        ---views        路由组件
        App.vue         根组件
        main.js         入口文件
        permission.js   路由全局守卫:根据用户登录状态 路由跳转的判断
        settings.js     项目的配置文件
```
### 第二步:修改login组件

```bash
    ---views
        ---login
            ---index.vue
    1、修改登录页面的文字
    <h3 class="title">登录</h3>
    <el-button ... >登录</el-button>
    2、了解 e-form 的 model
        model为数据对象 ->用于给 rules 做表单验证提供数据
            用法如下:
            <el-from :model="loginForm">
            </el-form>
            data(){
                return {
                    loginForm:{
                        username: "",
                        password: "",
                    }
                }
            }
    3、了解 e-form 的 rules 表单验证 配合 model传入的参数
         用法如下:
            <el-from :model="loginForm">
                
            </el-form>

```

