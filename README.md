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
    2、了解 e-form 
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left"
        >
        各种参数的作用:
        ---ref  对绑定提交表单事件发送请求前 做一个数据校验
                核心代码:
                methods: {
                    handleLogin() {
                        this.$refs.loginForm.validate((valid) => {
                            if (valid) {
                                this.loading = true;
                                this.$store.dispatch("user/login", this.loginForm)
                                    .then(() => {
                                            this.$router.push({ path: this.redirect || "/" });
                                            this.loading = false;
                                    })
                                    .catch(() => {
                                        this.loading = false;
                                    });
                            }
                            else {
                                console.log("error submit!!");
                                return false;
                            }
                    });
                }
        ---model 的作用是配合rules参数做校验用，并且插槽内必须要传prop
                  核心代码:
                  <el-form :model="loginForm">
                        <el-form-item prop="username">...</el-form-item>
                        <el-form-item prop="password">...</el-form-item>
                  </el-from>
                  data(){
                      return {
                        loginForm: {
                            username: "",
                            password: "",
                        },
                      }
                  }
        ---rules 数据校验必须要配合model，插槽内必须要传prop 
                  核心代码:
                  data(){
                    //固定参数
                    const validateUsername = (rule, value, callback) => {
                        if (!validUsername(value)) {
                            callback(new Error("Please enter the correct user name"));
                            } 
                        else {
                            callback();
                        }
                    };
                    const validatePassword = (rule, value, callback) => {
                        if (value.length < 6) {
                            callback(new Error("The password can not be less than 6 digits"));
                        } 
                        else {
                            callback();
                        }
                    };
                    return{
                        loginRules: {
                            username: [
                                //必填  失去焦点触发  自定义规则
                                { required: true, trigger: "blur", validator: validateUsername },
                            ],
                            password: [
                                { required: true, trigger: "blur", validator: validatePassword },
                            ],
                        },
                    }
                  }
        --- auto-complete 是否开启自动补全功能 好像放在 el-from 中是无效参数 需要放到el-input 这种才有效
    3、修改登录背景
        ---assets
            增加图片
            ---loginbg.jpg
        ---views
            ---login
                ---index.vue
            $bgimg: url(~@/assets/loginbg.jpg);
            .login-container {
                background-image: $bgimg;
                background-repeat: no-repeat;
                background-position: 50% 50%;
            }
```
### 第三步:查看提供的API接口

```bash
    API接口1:http://39.98.123.211:8170/swagger-ui.html
    API接口2:http://39.98.123.211:8216/swagger-ui.html
```
### 第四步:关闭mock数据

```bash
    ---vue.config.js
        注释掉第三十九行
        before: require('./mock/mock-server.js')
```
### 第五步:根据API接口1修改接口地址

```bash
    ---src
        ---api
            ---user.js
        修改三个API接口:
        export function login(data) {
            return request({
                url: '/admin/acl/index/login',
                method: 'post',
                data
            })
        }

        export function getInfo(token) {
            return request({
                url: '/admin/acl/index/info',
                method: 'get',
                params: { token }
            })
        }

        export function logout() {
            return request({
                url: '/admin/acl/index/logout',
                method: 'post'
            })
        }

```
### 第六步:增加修改二次封装的axios -> request.js文件

```bash
    ---src
        ---utils
            ---request.js
        因为后端请求头传的是token 将X-token修改成token 
        config.headers['token'] = getToken()
```
### 第七步:增加proxy代理

```bash
    ---vue.config.js
        devServer: {
            proxy: {
                '/dev-api': {
                    target: 'http://39.98.123.211:8170',
                    pathRewrite: { '^/dev-api': '' },
                }
            }
        }
```

### 第八步:修改 Navbar.vue 模块

```bash
    ---src
        ---layout
            ---components
                ---Navbar.vue
        删除:
        <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
        </a>
        <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
        </a>
        修改将英文home 和 Log Out 修改成中文:
        <router-link to="/">
            <el-dropdown-item> 主页 </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
        </el-dropdown-item>
```
