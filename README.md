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
### 第九步:移除路由组件From，nested，table，tree 并移除其路由

```bash
    ---views
        ---from 删除
        ---nested 删除
        ---table 删除
        ---tree 删除
    ---router
        ---index.js
            删除from,nested,table,tree路由
```

### 第十步:根据需求 创建产品路由组件 并配置其路由

```bash
    ---views
        ---product 产品
            ---Attr 产品属性
            ---Sku 产品单品管理
            ---Spu 产品管理
            ---tradeMark 品牌管理
    ---router
        ---index.js
        路由核心代码:
        {
            path: '/product',
            component: Layout,
            name: 'Product',
            redirect: '/',
            meta: { title: '产品管理', icon: 'el-icon-s-goods' },
            children: [{
                path: 'trademark',
                name: 'tradeMark',
                component: () => import('@/views/product/tradeMark'),
                meta: { title: '品牌管理' }
                },
                {
                path: 'spu',
                name: 'Spu',
                component: () => import('@/views/product/Spu'),
                meta: { title: 'Spu管理' }
                },
                {
                path: 'sku',
                name: 'Sku',
                component: () => import('@/views/product/Sku'),
                meta: { title: 'Sku管理' }
                },
                {
                path: 'attr',
                name: 'Attr',
                component: () => import('@/views/product/Attr'),
                meta: { title: 'Attr管理' }
            }]
        },
```

### 第十一步:加工品牌管理模块静态代码

```bash
    ---views
        ---product
            ---tradeMark
                ---index.vue
        代码:
        <template>
            <div class="tradeark-container">
                <!---顶部添加按钮--->
                <el-button type="primary" icon="el-icon-plus">添加</el-button>
                <!---中间展示表格--->
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="date" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="品牌名称" max-width="400" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="品牌LOGO" max-width="400" align="center">
                        <template>
                            <el-image style="width: 100px; height: 100px"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" align="center">
                        <template>
                            <el-button type="warning" icon="el-icon-edit" size="mini">
                                {{innerWidth > 660 ? "修改" : ""}}
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini">
                                {{innerWidth > 660 ? "删除" : ""}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!---底部分页器--->
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPageData.currentPage"
                :page-size="currentPageData.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="currentPageData.total"
                >
                </el-pagination>
            </div>
        </template>

        <script>
            export default {
                name: "tradeMark",
                data() {
                    return {
                        //用于判断是否展示 修改和删除按钮上的文字
                        innerWidth: this.getInnerWidth(),
                        //表格数据
                        tableData: [
                            {date: "1",name: "王小虎",address: "上海市普陀区金沙江路 1518 弄"},
                            {date: "1",name: "王小虎",address: "上海市普陀区金沙江路 1518 弄"},
                            {date: "1",name: "王小虎",address: "上海市普陀区金沙江路 1518 弄"},
                            {date: "1",name: "王小虎",address: "上海市普陀区金沙江路 1518 弄"},
                        ],
                        //分页数据
                        currentPageData:{
                            //当前页
                            currentPage:1,
                            //每页展示的数量
                            pageSize:5,
                            //总条数
                            total:1000
                        }
                    };
                },
                mounted() {
                    window.onresize = () => {
                        if (!this.timer) {
                            // 使用节流机制，降低函数被触发的频率
                            this.timer = true;
                            let that = this; // 匿名函数的执行环境具有全局性，为防止this丢失这里用that变量保存一下
                            setTimeout(function () {
                                that.innerWidth = that.getInnerWidth();
                                that.timer = false;
                            }, 20);
                        }
                    };
                },
                destroyed() {
                    // 组件销毁后解绑事件
                    window.onresize = null;
                },
                methods: {
                    getInnerWidth() {
                        return window.innerWidth;
                    },
                },
            };
        </script>

        <style  lang="scss" scoped>
            .tradeark {
                &-container {
                margin: 30px;
                    .el-table {
                        margin-top: 20px;
                    }
                    .el-pagination {
                        margin-top: 20px;
                        display: flex;
                        justify-content: center;
                    }
                }
            }
        </style>
```
### 第十二步:创建 产品管理-品牌管理 API接口文件

```bash
    ---api
        ---product
            ---tradeMark.js
```

### 第十三步:添加API 获取 产品管理-品牌管理 信息

```bash
    api文档:http://39.98.123.211:8216/swagger-ui.html#!/base45trademark45controller/indexUsingGET
    ---api
        ---product
            ---tradeMark.js
        核心代码:
        //获取商品品牌分页列表
        //GET /admin/product/baseTrademark/{page}/{limit}
        export function getProductBaseTrademarkList({ page, limit }) {
            return request({
                url: `/admin/product/baseTrademark/${page}/${limit}`,
                method: 'get',
            })
        }
```
### 第十四步:添加vuex 产品管理-品牌管理 ->获取商品分类

```bash
    ---store
        ---product
            ---tradeMark.js
        核心代码:
        import { getProductBaseTrademarkList } from '@/api/product/tradeMark'
        const getDefaultState = () => {
            return {
                currentPageData: []
            }
        }
        const state = getDefaultState()
        const mutations = {
            SET_CURRENTPAGEDATA(state, currentPageData) {
                state.currentPageData = currentPageData
            }
        }
        const actions = {
            getProductBaseTrademarkList({ commit }, { page, limit }) {
                return new Promise((resolve, reject) => {
                    getProductBaseTrademarkList({ page, limit })
                    .then(response => {
                        const { data } = response
                        commit('SET_CURRENTPAGEDATA', data)
                        resolve()
                    })
                    .catch(error => {
                        reject(error)
                    })
                }    
            }
        }
        export default {
            namespaced: true,
            state,
            mutations,
            actions
        }
```
### 第十五步:产品管理->品牌管理 使用Vux获取品牌管理信息

```bash
    ---views
        ---product
            ---tradeMark
                ---index.vue
        核心代码:
        <!---LOGO图片这里使用到了 组件作用域插槽--->
        <el-table-column label="品牌LOGO" max-width="400" align="center">
            <template slot-scope="scope">
                <el-image
                style="width: 100px; height: 50px"
                :src="scope.row.logoUrl ? scope.row.logoUrl : '/static/default.jpg'"
                lazy
                ></el-image>
            </template>
        </el-table-column>
        <!---底部分页器--->
        <el-pagination
        v-loading="loading"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPageData.currentPage"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="currentPageData.pageSize"
        layout="total, prev, pager, next,->,jumper,sizes "
        :total="currentPageData.total"
        >
        </el-pagination>

        data() {
            return {
                //用于判断是否展示 修改和删除按钮上的文字
                innerWidth: this.getInnerWidth(),
                //表格数据
                tableData: [],
                //分页数据
                currentPageData: {
                //当前页
                currentPage: parseInt(this.$route.query.page) || 1,
                //每页展示的数量
                pageSize: parseInt(this.$route.query.size) || 3,
                //总条数
                total: 0,
                },
                loading: true,
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            handleCurrentChange(val) {
                this.$router.push({
                    query: {
                        ...this.$route.query,
                        page: val,
                    },
                });
                this.currentPageData.currentPage = val;
                this.getData();
            },
            handleSizeChange(val) {
                this.$router.push({
                    query: {
                        page: 1,
                        size: val,
                    },
                });
                this.currentPageData.currentPage = 1;
                this.currentPageData.pageSize = val;
                this.getData();
            },
            getData() {
                this.loading = true;
                this.$store
                .dispatch("trademark/getProductBaseTrademarkList", {
                    page: this.currentPageData.currentPage,
                    limit: this.currentPageData.pageSize,
                })
                .then(() => {
                    const { records, total } = this.$store.getters.currentpagedata;
                    this.tableData = records;
                    this.currentPageData.total = total;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
            },
        }
```
### 第十六步:产品管理->品牌管理 为(添加和修改)按钮点击弹出 el-dialog 静态页面

```bash
    ---views
        ---product
            ---tradeMark
                ---index.vue
        核心代码:
        <el-button type="primary" icon="el-icon-plus" @click="addTradeMark">
            添加
        </el-button>

        <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark()"
        >
            {{ innerWidth > 660 ? "修改" : "" }}
        </el-button>

        <el-dialog :title="form.title" :visible.sync="form.dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="序号" :label-width="form.formLabelWidth">
                    <el-input
                    v-model="form.id"
                    autocomplete="off"
                    :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="品牌名称" :label-width="form.formLabelWidth">
                    <el-input v-model="form.tmName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Logo" :label-width="form.formLabelWidth">
                    <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    >
                        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="form.dialogFormVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="form.dialogFormVisible = false">
                    确 定
                </el-button
                >
            </div>
        </el-dialog>

        data() {
            return {
                form: {
                    dialogFormVisible: false,
                    formLabelWidth: "100px",
                    title: "",
                    id: "",
                    tmName: "",
                    imageUrl: "",
                },
            }
        }
        methods: {
            addTradeMark() {
                this.form.title = "新增品牌";
                this.form.dialogFormVisible = true;
            },
            updateTradeMark() {
                this.form.title = "修改品牌";
                this.form.dialogFormVisible = true;
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 JPG 格式!");
                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                }
                return isJPG && isLt2M;
            },
        }
```
### 第十七步:添加API  产品管理-品牌管理  -> 新增品牌

```bash
    ---api
        ---product
            ---tradeMark.js
        核心代码:
        //新增品牌
        //POST /admin/product/baseTrademark/save
        export function addBaseTrademark(data) {
            return request({
                url: `/admin/product/baseTrademark/save`,
                method: 'post',
                data: data
            })
        }
```
### 第十八步:产品管理->品牌管理 使用Vux新增品牌信息

```bash
    ---store
        ---product
            ---tradeMark.js
        核心代码:
        addBaseTrademark({ commit }, { tmName, logoUrl }) {
            return new Promise((resolve, reject) => {
                addBaseTrademark({ tmName, logoUrl }).then(response => {
                    console.log(response);
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        }
```
### 第十九步:产品管理->品牌管理 实现新增品牌功能

```bash
    ---views
        ---product
            ---tradeMark
                ---index.vue
        核心代码:
        <el-button @click="clearTradeMark">取 消</el-button>
        <el-button type="primary" @click="saveTradeMark">确 定</el-button>

        methods:{
            clearTradeMark() {
                this.form.tmName = undefined;
                this.form.imageUrl = undefined;
                this.form.dialogFormVisible = false;
            },
            saveTradeMark() {
                this.$store
                .dispatch("trademark/addBaseTrademark", {
                    tmName: this.form.tmName,
                    logoUrl: this.form.imageUrl || "",
                })
                .then((data) => {
                    this.clearTradeMark();
                    this.getData();
                })
                .catch((error) => {
                    console.log("失败");
                });
            },
            handleAvatarSuccess(res, file) {
                if (res.code == 200) this.form.imageUrl = res.data;
                else this.form.imageUrl = URL.createObjectURL(file.raw);
            }
        }
```

### 第二十步:添加API  产品管理-品牌管理  -> 修改品牌

```bash
    ---api
        ---product
            ---tradeMark.js
        //修改品牌
        //PUT /admin/product/baseTrademark/update
        export function updateBaseTrademark(data) {
            return request({
                url: `/admin/product/baseTrademark/update`,
                method: 'put',
                data: data
            })
        }
```
### 第二十一步:产品管理->品牌管理 使用Vux修改品牌信息

```bash
    ---store
        ---product
            ---tradeMark.js
        核心代码:
        updateBaseTrademark({ commit }, { id, tmName, logoUrl }) {
            return new Promise((resolve, reject) => {
                updateBaseTrademark({ id, tmName, logoUrl }).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
```

### 第二十二步:产品管理->品牌管理 新增品牌的确认校验

```bash
    ---views
        ---product
            ---tradeMark
                ---index.vue
        核心代码:
        data() {
            const validatetmName = (rule, value, callback) => {
                if (!(value && value.length > 0 && value.length < 12)) {
                    callback(new Error("品牌名称介于1~12个字符"));
                } else {
                    callback();
                }
            };
            const validateimageUrl = (rule, value, callback) => {
                if (!(value && value.substr(value.lastIndexOf(".") + 1) == "jpg")) {
                    callback(new Error("请上传有效图片"));
                } else {
                    callback();
                }
            };
            return {
                FormRules: {
                    tmName: [
                        { required: true, trigger: "change", validator: validatetmName },
                    ],
                    imageUrl: [
                        { required: true, trigger: "change", validator: validateimageUrl },
                    ],
                },
            };
        }
        methdos:{
            saveTradeMark() {
                this.$refs.Form.validate((valid) => {
                    if (valid) {
                        ...
                    }
            }
        }
```
### 第二十三步:产品管理->品牌管理 修改品牌

```bash
    ---views
        ---product
            ---tradeMark
                ---index.vue
        核心代码:
        <el-table-column prop="address" label="操作" align="center">
            <template slot-scope="scope">
                <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateTradeMark(scope.row)"
                >
                    {{ innerWidth > 660 ? "修改" : "" }}
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">
                    {{ innerWidth > 660 ? "删除" : "" }}
                </el-button>
            </template>
        </el-table-column>

        methods:{
            updateTradeMark({ id, logoUrl, tmName }) {
                this.$refs.Form && this.$refs.Form.resetFields();
                this.form = {
                ...this.form,
                title: "修改品牌",
                dialogFormVisible: true,
                id,
                imageUrl: logoUrl,
                tmName,
                };
            },
            saveTradeMark() {
                this.$refs.Form.validate((valid) => {
                    if (valid) {
                        if (this.form.id != "") {
                            this.$store.dispatch("trademark/updateBaseTrademark", {
                                id: this.form.id,
                                tmName: this.form.tmName,
                                logoUrl: this.form.imageUrl || "",
                            })
                            .then((data) => {
                                this.clearTradeMark();
                                this.$message({
                                    message: "修改成功",
                                    type: "success",
                                });
                                this.getData();
                            })
                            .catch((error) => {
                                this.$message({
                                    message: "修改失败",
                                    type: "error",
                                });
                            });
                        } else {
                            this.$store.dispatch("trademark/addBaseTrademark", {
                                tmName: this.form.tmName,
                                logoUrl: this.form.imageUrl || "",
                            })
                            .then((data) => {
                                this.clearTradeMark();
                                this.$message({
                                message: "添加成功",
                                type: "success",
                                });
                                this.getData();
                            })
                            .catch((error) => {
                                this.$message({
                                message: "添加失败",
                                type: "error",
                                });
                            });
                        }
                    }
                });
            },
        }

```
### 第二十四步:添加API  产品管理-品牌管理  -> 删除品牌

```bash
    ---api
        ---product
            ---tradeMark.js
        //删除品牌
        // DELETE /admin/product/baseTrademark/remove/{id}
        export function removeBaseTrademark({ id }) {
            return request({
                url: `/admin/product/baseTrademark/remove/${id}`,
                method: 'delete'
            })
        }
```
### 第二十五步:产品管理->品牌管理 使用Vux删除品牌信息

```bash
    ---store
        ---product
            ---tradeMark.js
        核心代码:
        removeBaseTrademark({ commit }, { id }) {
            return new Promise((resolve, reject) => {
                removeBaseTrademark({ id }).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        }
```

### 第二十六步:产品管理->品牌管理 删除品牌

```bash
    ---view
        ---product
            ---tradeMark
                ---index.vue
        核心代码:
        <el-button
        @click="removeTradeMark(scope.row)"
        type="danger"
        icon="el-icon-delete"
        size="mini"
        >
            {{ innerWidth > 660 ? "删除" : "" }}
        </el-button>

        methods:{
            removeTradeMark({ id, tmName }) {
                this.$confirm(
                    `此操作将永久删除"${tmName}"品牌信息, 是否继续?`,
                    "删除确认",
                    {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    }
                )
                .then(() => {
                    this.$store
                        .dispatch("trademark/removeBaseTrademark", { id })
                        .then((data) => {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                        if (
                            this.tableData.length <= 1 &&
                            this.currentPageData.currentPage >= 2
                        )
                            this.currentPageData.currentPage -= 1;
                        this.getData();
                        })
                        .catch((error) => {
                        this.$message({
                            message: `删除失败`,
                            type: "error",
                        });
                        });
                    })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
            },
        }
```

### 第二十七步:新增组件CategorySelect配置静态页面并注册为全局组件

```bash
    ---components
        ---CategorySelect
            ---index.vue
        核心代码:
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="一级分类">
                <el-select v-model="formInline.category1" placeholder="请选择">
                    <el-option
                    v-for="category1 of formInline.category1List"
                    :key="category1.id"
                    :label="category1.name"
                    :value="category1.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="formInline.category2" placeholder="请选择">
                    <el-option
                    v-for="category2 of formInline.category2List"
                    :key="category2.id"
                    :label="category2.name"
                    :value="category2.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="formInline.category3" placeholder="请选择">
                    <el-option
                    v-for="category3 of formInline.category3List"
                    :key="category3.id"
                    :label="category3.name"
                    :value="category3.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        核心代码:
        name: "CategorySelect",
        data() {
            return {
                formInline: {
                    category1: "",
                    category2: "",
                    category3: "",
                    category1List: [],
                    category2List: [],
                    category3List: [],
                },
            };
        }
    ---main.js
        核心代码:
        //注册全局组件
        import CategorySelect from '@/components/CategorySelect'
        Vue.component(CategorySelect.name, CategorySelect)
```
### 第二十八步:添加API  产品管理-Attr管理  -> 获取一~三级分类

```bash
    ---api
        ---product
            ---attr.js
        核心代码:
        //获取一级分类
        //GET /admin/product/get/category1
        export function reqgetCategory1() {
            return request({
                url: `/admin/product/getCategory1`,
                method: 'get',
            })
        }
        //获取二级分类
        //GET /admin/product/getCategory2/{category1Id}
        export function reqgetCategory2({ category1Id }) {
            return request({
                url: `/admin/product/getCategory2/${category1Id}`,
                method: 'get',
            })
        }
        //获取三级分类
        //GET /admin/product/getCategory3/{category2Id}
        export function reqgetCategory3({ category2Id }) {
            return request({
                url: `/admin/product/getCategory3/${category2Id}`,
                method: 'get',
            })
        }
```
### 第二十九步:产品管理->Attr管理 使用Vux 获取一~三级分类 ,注册Vuex模块

```bash
    ---store
        ---modules
            ---product
                ---attr.js
        核心代码:
        const actions = {
            reqgetCategory1({ commit }) {
                return new Promise((resolve, reject) => {
                    reqgetCategory1().then(response => {
                        resolve(response.data)
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            reqgetCategory2({ commit }, { category1Id }) {
                return new Promise((resolve, reject) => {
                    reqgetCategory2({ category1Id }).then(response => {
                        resolve(response.data)
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            reqgetCategory3({ commit }, { category2Id }) {
                return new Promise((resolve, reject) => {
                    reqgetCategory3({ category2Id }).then(response => {
                        resolve(response.data)
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
        }        
    ---stroe
        ---index.js
        核心代码:
        const store = new Vuex.Store({
            modules: {
                app,
                settings,
                user,
                trademark,
                //注册模块
                attr
            },
            getters
        })        
```
### 第三十步:组件CategorySelect使用接口实现逻辑

```bash
    ---components
        ---CategorySelect
            ---index.vue
        核心代码:
        watch: {
            "formInline.category1"() {
                this.getcategory2();
                this.clearcategory2();
            },
            "formInline.category2"(val) {
                if (val != "") this.getcategory3();
                this.clearcategory3();
            },
        },
        mounted() {
            this.getcategory1();
        },
        methods: {
            getcategory1() {
                this.$store
                .dispatch("attr/reqgetCategory1")
                .then((response) => {
                    this.formInline.category1List = response;
                })
                .catch((error) => {
                    this.$message({
                        message: error,
                        type: "error",
                    });
                });
            },
            getcategory2() {
                this.$store
                .dispatch("attr/reqgetCategory2", {category1Id: this.formInline.category1})
                .then((response) => {
                    this.formInline.category2List = response;
                })
                .catch((error) => {
                    this.$message({
                        message: error,
                        type: "error",
                    });
                });
            },
            getcategory3() {
                this.$store
                .dispatch("attr/reqgetCategory3", {category2Id: this.formInline.category2})
                .then((response) => {
                    this.formInline.category3List = response;
                })
                .catch((error) => {
                    this.$message({
                        message: error,
                        type: "error",
                    });
                });
            },
            clearcategory2() {
                this.formInline = {
                    ...this.formInline,
                    category2: "",
                    category3: "",
                    category3List: [],
                };
            },
            clearcategory3() {
                this.formInline.category3 = "";
            },
        },
```
### 第三十一步:组件Attr使用 自定义全局组件CategorySelect

```bash
    ---views
        ---product
            ---Attr
                ---index.vue
        核心代码:
        <el-card><CategorySelect /> </el-card>
```
### 第三十二步:添加API  产品管理-Attr管理  -> 获取商品基础属性

```bash
    ---api
        ---product
            ---attr.js
        核心代码:
        // 商品基础属性接口
        // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
        export function reqgetattrInfoList({ category1Id, category2Id, category3Id }) {
            return request({
                url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
                method: 'get',
            })
        }
```
### 第三十三步:产品管理->Attr管理 使用Vux 获取商品基础属性

```bash
    ---store
        ---product
            ---attr.js
        核心代码:
        action:{
            reqgetattrInfoList({ commit }, { category1Id, category2Id, category3Id }) {
                return new Promise((resolve, reject) => {
                    reqgetattrInfoList({ category1Id, category2Id, category3Id })
                        .then(response => {
                            resolve(response.data)
                        }).catch(error => {
                            reject(error)
                        })
                })
            },
        }
```
### 第三十四步:组件Attr使用 与自定义全局组件CategorySelect交互

```bash
    使用自定义事件
    当组件CategorySelect选择了 有效的三级分类 让Attr组件去获取商品基础属性
                              无效的三级分类 让Attr组件不展示商品分类属性
    ---views
        ---product
            ---Attr
                ---index.vue
        核心代码:
        <el-card><CategorySelect @getCategory="getCategory" /> </el-card>
        核心代码:
        data() {
            return {
                attrInfoList: [],
            }
        }
        methods: {
            getCategory(category1, category2, category3) {
                //判断是否是有效的三级分类
                if (category3)
                    this.$store
                    .dispatch("attr/reqgetattrInfoList", {
                        category1Id: category1,
                        category2Id: category2,
                        category3Id: category3,
                    })
                    .then((response) => {
                        this.attrInfoList = response.filter((element) => {
                            //只显示三级分类
                            return element.categoryLevel == 3;
                        });
                    })
                    .catch((error) => {
                        this.$message({
                            message: error,
                            type: "error",
                        });
                    });
                //无效的三级分类 清空
                else {
                    this.attrInfoList = [];
                }
            },
        }
    ---components
        ---CategorySelect
            ---index.vue
        核心代码:
        data() {
            return {
                formInline: {
                    category1: "",
                    category2: "",
                    category3: "",
                    category1List: [],
                    category2List: [],
                    category3List: [],
                },
            };
        },
        watch: {
            "formInline.category3"(val) {
                this.$emit(
                    "getCategory",
                    this.formInline.category1,
                    this.formInline.category2,
                    this.formInline.category3
                );
            },
        },
```
### 第三十五步:组件Attr下半部分静态页面的构建,并展示attrInfoList的数据

```bash
    ---views
        ---product
            ---Attr
                ---index.vue
        核心代码:
        <el-card>
            <el-button
            @click="addAttrInfo"
            type="primary"
            icon="el-icon-plus"
            >添加属性
            </el-button>
            <el-table :data="attrInfoList" border style="width: 100%">
                <el-table-column align="center" prop="id" label="序号" width="100">
                </el-table-column>
                <el-table-column prop="attrName" label="属性名称" width="180">
                </el-table-column>
                <el-table-column prop="attrValueList" label="属性值列表">
                    <template slot-scope="scope">
                        <el-tag
                        style="margin-right: 3px"
                        type="success"
                        :key="attrValue.id"
                        v-for="attrValue of scope.row.attrValueList"
                        >
                        {{ attrValue.valueName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <el-button type="warning" icon="el-icon-edit">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </el-table-column>
            </el-table>
        </el-card>
        核心代码:
        data() {
            return {
                attrInfoList: [],
                
            }
        }
```
### 第三十六步:组件Attr 为添加属性值按钮 添加el-dialog弹出框 静态页面

```bash
    ---views
        ---product
            ---Attr
                ---index.vue
        核心代码:
        <el-button
        :disabled="!isAdd"
        @click="addAttrInfo"
        type="primary"
        icon="el-icon-plus"
        >
        添加属性
        </el-button>

        <el-dialog :title="DialogForm.title" :visible.sync="DialogForm.visible">
            <el-form :model="DialogForm.value">
                <el-form-item label="属性ID" :label-width="DialogForm.formLabelWidth">
                    <el-input v-model="DialogForm.value.id" autocomplete="off"></el-input>
                </el-form-item>
            <el-form-item label="属性名称" :label-width="DialogForm.formLabelWidth">
                <el-input v-model="DialogForm.value.attrName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="属性值" :label-width="DialogForm.formLabelWidth">
                <template>
                    <el-tag 
                    :key="tag" 
                    v-for="tag in dynamicTags" 
                    closable 
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                    >
                    {{ tag }}
                    </el-tag>
                    <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ New Tag
                    </el-button>
                </template>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button>取 消</el-button>
                <el-button type="primary">保 存</el-button>
            </div>
        </el-dialog>
        核心代码:
        data() {
            return {
                isAdd: false,
                dynamicTags: ["标签一", "标签二", "标签三"],
                inputVisible: false,
                inputValue: "",
            };
        },
        methods: {
            addAttrInfo() {
                this.DialogForm = {
                    ...this.DialogForm,
                    title: "新增属性",
                    visible: true,
                };
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick((_) => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = "";
            },
        }
```
### 第三十七步:组件Attr 为添加属性的el-dialog弹出框 保存按钮添加校验规则,取消按钮事件

```bash
    ---views
        ---product
            ---Attr
                ---index.vue
        核心代码:
        <el-dialog :title="DialogForm.title" :visible.sync="DialogForm.visible">
            <el-form
            :model="DialogForm.value"
            :rules="DialogFormRules"
            ref="DialogForm"
            >
                <el-form-item label="属性ID" :label-width="DialogForm.formLabelWidth">
                    <el-input
                    disabled
                    v-model="DialogForm.value.id"
                    autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                prop="attrName"
                label="属性名称"
                :label-width="DialogForm.formLabelWidth"
                >
                    <el-input
                    v-model="DialogForm.value.attrName"
                    autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                prop="dynamicTags"
                label="属性值"
                :label-width="DialogForm.formLabelWidth"
                >
                    <template>
                        <el-tag
                        :key="tag"
                        v-for="tag in DialogForm.value.dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                        >
                        {{ tag }}
                        </el-tag>
                        <el-input
                        class="input-new-tag"
                        v-if="DialogForm.value.inputVisible"
                        v-model="DialogForm.value.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button
                        v-else
                        class="button-new-tag"
                        size="small"
                        @click="showInput"
                        >+ New Tag</el-button
                        >
                    </template>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAttrInfo">取 消</el-button>
                <el-button type="primary" @click="saveAttrInfo">保 存</el-button>
            </div>
        </el-dialog>
        核心代码:
        data() {
            const validateAttrName = (rule, value, callback) => {
                if (value && value.length >= 1 && value.length <= 12) {
                    callback();
                } else {
                    callback(new Error("请输入1~12个字符的属性名称"));
                }
            };
            const validatedynamicTags = (rule, value, callback) => {
                if (value.length) {
                    callback();
                } else {
                    callback(new Error("请添加至少1个属性值"));
                }
            };
            return {
                attrInfoList: [],
                isAdd: false,
                DialogForm: {
                    visible: false,
                    title: "",
                    formLabelWidth: "120px",
                    value: {
                        id: "",
                        attrName: "",
                        dynamicTags: [],
                        inputVisible: false,
                        inputValue: "",
                    },
                },
                DialogFormRules: {
                    attrName: [{ required: true, trigger: "change", validator: validateAttrName }],
                    dynamicTags: [{ required: true, trigger: "blur", validator: validatedynamicTags }],
                },
            };
        },
        methods: {
            addAttrInfo() {
                //重置表单参数
                this.$refs.DialogForm && this.$refs.DialogForm.clearValidate();
                this.DialogForm = {
                    ...this.DialogForm,
                    title: "新增属性",
                    visible: true,
                };
            },
            cancelAttrInfo() {
                this.$refs.DialogForm && this.$refs.DialogForm.resetFields();
                this.DialogForm = {
                    ...this.DialogForm,
                    visible: false,
                };
            },
            saveAttrInfo() {
                //校验
                this.$refs.DialogForm.validate((valid) => {
                    //判断校验是否成功
                    console.log(valid);
                });
            },
            handleClose(tag) {
                this.DialogForm.value.dynamicTags.splice(this.DialogForm.value.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.DialogForm.value.inputVisible = true;
                this.$nextTick((_) => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.DialogForm.value.inputValue;
                //无法插入相同的
                if (inputValue && this.DialogForm.value.dynamicTags.indexOf(inputValue) == -1) 
                    this.DialogForm.value.dynamicTags.push(inputValue);  
                this.DialogForm.value.inputVisible = false;
                this.DialogForm.value.inputValue = "";
            },
        }

```
### 第三十八步:添加API  产品管理-Attr管理  -> 增加和修改商品基础属性

```bash
    ---api
        ---product
            ---attr.js
        核心代码:
        //新增和修改商品属性
        //POST /admin/product/saveAttrInfo
        export function reqsaveattrInfo(req) {
            return request({
                url: `/admin/product/saveAttrInfo`,
                method: 'post',
                data: req
            })
        }
```
### 第三十九步:产品管理->Attr管理 使用Vux 增加和修改商品基础属性

```bash
    ---store
        ---product
            ---attr.js
        核心代码:
        action:{
            reqsaveattrInfo({ commit }, req) {
                return new Promise((resolve, reject) => {
                    reqsaveattrInfo(req)
                        .then(response => {
                            resolve(response)
                        }).catch(error => {
                            reject(error)
                        })
                })
            }
        }
```
### 第四十步:组件Attr 完善增加基本商品属性功能

```bash
    ---views
        ---product
            ---Attr
                ---index.vue
        核心代码:
        methods:{
            saveAttrInfo() {
            //校验
            this.$refs.DialogForm.validate((valid) => {
            //判断校验是否成功
            if (valid) {
                const attrValueList = [];
                for (const Tags of this.DialogForm.value.dynamicTags)
                    attrValueList.push({
                        valueName: Tags,
                    });
                const req = {
                    attrName: this.DialogForm.value.attrName,
                    attrValueList,
                    categoryId: this.category3Id,
                    categoryLevel: 3,
                };
                this.$store
                .dispatch("attr/reqsaveattrInfo", req)
                .then((response) => {
                    this.$message({
                        type: "success",
                        message: "添加成功",
                    });
                    //清空表单参数 并 隐藏Dialog表单
                    this.$refs.DialogForm && this.$refs.DialogForm.resetFields();
                    this.DialogForm = {
                        ...this.DialogForm,
                        visible: false,
                    };
                    //再次发送请求
                    this.getCategory(
                        this.category1Id,
                        this.category2Id,
                        this.category3Id
                    );
                })
                .catch((error) => {
                    this.$message({
                        message: error,
                        type: "error",
                    });
                });
                }
            });
            }
        }
```
### 第四十一步:组件Attr 增加修改功能

```bash
    ---views
        ---product
            ---Attr
                ---index.vue
        核心代码:
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                type="warning"
                icon="el-icon-edit"
                @click="updateAttrInfo(scope.row)"
                >修改</el-button
                >
                <el-button type="danger" icon="el-icon-delete">删除</el-button>
            </template>
        </el-table-column>
        核心代码:
        methods:{
            updateAttrInfo({ id, attrName, attrValueList }) {
                const dynamicTags = [];
                for (const value of attrValueList) {
                    dynamicTags.push(value.valueName);
                }
                this.DialogForm = {
                    ...this.DialogForm,
                    title: "修改属性",
                    visible: true,
                    value: {
                        ...this.DialogForm.value,
                        id,
                        attrName,
                        dynamicTags,
                    },
                };
            },
            saveAttrInfo() {
                //校验
                this.$refs.DialogForm.validate((valid) => {
                    //判断校验是否成功
                    if (valid) {
                        const attrValueList = [];
                        for (const Tags of this.DialogForm.value.dynamicTags)
                            attrValueList.push({
                                valueName: Tags,
                            });
                        const req = {
                            //判断是否是修改还是新增
                            id: this.DialogForm.value.id || undefined,
                            attrName: this.DialogForm.value.attrName,
                            attrValueList,
                            categoryId: this.category3Id,
                            categoryLevel: 3,
                        };
                        this.$store
                        .dispatch("attr/reqsaveattrInfo", req)
                        .then((response) => {
                            if (this.DialogForm.value.id) {
                                this.$message({
                                    type: "success",
                                    message: "修改成功",
                                });
                            } else {
                                this.$message({
                                    type: "success",
                                    message: "添加成功",
                                });
                            }
                            this.cancelAttrInfo();
                            this.getCategory(
                            this.category1Id,
                            this.category2Id,
                            this.category3Id
                            );
                        })
                        .catch((error) => {
                            this.$message({
                                message: error,
                                type: "error",
                            });
                        });
                    }   
                });
            }
        }
```
### 第四十二步:添加API  产品管理-Attr管理  -> 删除商品基础属性

```bash
    ---api
        ---product
            ---attr.js
        核心代码:
        //删除商品属性
        //DELETE /admin/product/deleteAttr/{attrId}
        export function reqdelattrInfo({ attrId }) {
            return request({
                url: `/admin/product/deleteAttr/${attrId}`,
                method: 'delete'
            })
        }
```
### 第四十三步:产品管理->Attr管理 使用Vux 删除商品基础属性

```bash
    ---store
        ---modules
            ---product
                ---attr.js
        核心代码:
        action:{
            reqdelattrInfo({ commit }, { attrId }) {
                return new Promise((resolve, reject) => {
                    reqdelattrInfo({ attrId })
                        .then(response => {
                            resolve(response)
                        })
                        .catch(error => {
                            reject(error)
                        })
                })
            }
        }
```
### 第四十四步:组件Attr 增加删除功能

```bash
    ---views
        ---product
            ---Attr
                ---index.vue
        核心代码:
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                type="warning"
                icon="el-icon-edit"
                @click="updateAttrInfo(scope.row)"
                >修改</el-button
                >
                <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteAttrInfo(scope.row)"
                >删除</el-button
                >
            </template>
        </el-table-column>
        核心代码:
        methods:{
            deleteAttrInfo({ id }) {
                this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                })
                .then(() => {
                    this.$store
                    .dispatch("attr/reqdelattrInfo", { attrId: id })
                    .then((response) => {
                        this.$message({
                            type: "success",
                            message: "删除成功",
                        });
                        this.getCategory(
                        this.category1Id,
                        this.category2Id,
                        this.category3Id
                        );
                    })
                    .catch((error) => {
                        this.$message({
                            type: "error",
                            message: error,
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
            }
        }
```
### 第四十五步:组件SPU静态页面构建

```bash
    ---views
        ---product
            ---Spu
                ---index.vue
        核心代码:
        <template>
            <div class="spu-container">
                <el-card class="box-card">
                    <CategorySelect />
                </el-card>
                <el-card class="box-card">
                    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column prop="date" label="序号" width="100">
                        </el-table-column>
                        <el-table-column prop="name" label="SPU名称" width="180">
                        </el-table-column>
                        <el-table-column prop="address" label="SPU描述"> </el-table-column>
                        <el-table-column prop="address" label="操作">
                        <template>
                            <el-button type="success" icon="el-icon-plus"></el-button>
                            <el-button type="warning" icon="el-icon-edit"></el-button>
                            <el-button type="info" icon="el-icon-view"></el-button>
                            <el-button type="danger" icon="el-icon-delete"></el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination background layout="prev, pager, next" :total="1000">
                    </el-pagination>
                </el-card>
            </div>
        </template>
        <script>
        export default {
            name: "Spu",
            data() {
                return {
                    tableData: [
                        {
                        date: "2016-05-02",
                        name: "王小虎",
                        address: "上海市普陀区金沙江路 1518 弄",
                        },
                    ],
                };
            },
        };
        </script>
```
### 第四十六步:添加API  产品管理-Spu管理  -> 查询Spu列表 

```bash
    ---api
        ---product
            ---spu.js
        核心代码:
        //获取SPU列表
        // GET /admin/product/{page}/{limit}
        export function reqgetspuInfoList({ page, limit, req }) {
            return request({
                url: `/admin/product/${page}/${limit}`,
                method: "get",
                params: req
            })
        }
```
### 第四十七步:产品管理->Spu管理 使用Vux(并注册) 查询Spu列表

```bash
    ---store
        ---modules
            ---product
                ---spu.js
        核心代码:
        const actions = {
            reqgetspuInfoList({ commit }, { page, limit, req }) {
                return new Promise((resolve, reject) => {
                    reqgetspuInfoList({ page, limit, req })
                        .then(response => {
                            resolve(response.data)
                        })
                        .catch(error => {
                            reject(error)
                        })
                })
            }
        }
    ---store
        ---index.js
        核心代码:
        const store = new Vuex.Store({
            modules: {
                app,
                settings,
                user,
                trademark,
                attr,
                //注册spu组件
                spu
            },
            getters
        })
```
### 第四十八步:组件SPU根据 使用自定义事件获取CategorySelect传来的参数并发送查询请求

```bash
    使用自定义事件
    当组件CategorySelect选择了 有效的三级分类 让SPU组件去获取SPU列表并展示
                              无效的三级分类 让SPU组件不展示列表
    当组件SPU触发分页 让SPU组件去获取SPU列表并展示
    ---views
        ---product
            ---Spu
                ---index.vue
        核心代码:
        <el-card class="box-card">
            <CategorySelect @getCategory="getCategory" />
        </el-card>
        <el-card class="box-card" v-loading="loading">
            <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
            <el-table :data="recordsData" border style="width: 100%">
                <el-table-column prop="id" label="序号" width="100"> </el-table-column>
                <el-table-column prop="spuName" label="SPU名称" width="180">
                </el-table-column>
                <el-table-column prop="description" label="SPU描述"> </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="success" icon="el-icon-plus"></el-button>
                        <el-button type="warning" icon="el-icon-edit"></el-button>
                        <el-button type="info" icon="el-icon-view"></el-button>
                        <el-button type="danger" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            :current-page.sync="currentPageData.currentPage"
            :page-size="currentPageData.pageSize"
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next"
            :total="currentPageData.total"
            >
            </el-pagination>
        </el-card>
        核心代码:
        data() {
            return {
                category1Id: "",
                category2Id: "",
                category3Id: "",
                //分页数据
                currentPageData: {
                    //当前页
                    currentPage: 1,
                    //每页展示的数量
                    pageSize: 3,
                    //总条数
                    total: 0,
                },
                recordsData: [],
                loading: false,
            };
        },
        methods: {
            getCategory(category1Id, category2Id, category3Id) {
                this.category1Id = category1Id;
                this.category2Id = category2Id;
                this.category3Id = category3Id;
                if (category3Id != "") {
                    this.getrecordsData();
                } else {
                    this.clearrecordsData();
                }
            },
            getrecordsData() {
                this.loading = true;
                const req = {
                    category3Id: this.category3Id,
                };
                this.$store
                .dispatch("spu/reqgetspuInfoList", {
                page: this.currentPageData.currentPage,
                limit: this.currentPageData.pageSize,
                req,
                })
                .then((response) => {
                    this.loading = false;
                    this.currentPageData.total = response.total;
                    this.recordsData = response.records;
                })
                .catch((error) => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: error,
                    });
                });
            },
            clearrecordsData() {
                this.recordsData = [];
                this.currentPageData.currentPage = 1;
                this.currentPageData.total = 0;
            },
            handleCurrentChange(val) {
                this.currentPageData.currentPage = val;
                this.getrecordsData();
            },
        }
```
