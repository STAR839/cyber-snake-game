# 🚀 赛博霓虹贪吃蛇 - GitHub Pages 自动部署指南

## 📋 部署概述

本项目已配置自动部署到GitHub Pages，当您推送代码到GitHub仓库时，游戏会自动更新并发布到网上。

## 🔧 自动部署配置

项目包含了 `.github/workflows/deploy.yml` 文件，提供以下功能：

### ✨ 自动触发条件
- 推送代码到 `main` 或 `master` 分支
- 创建Pull Request时
- 手动触发部署

### 🛠️ 部署流程
1. **构建阶段**：检出代码并准备部署文件
2. **部署阶段**：自动发布到GitHub Pages

## 📖 完整部署步骤

### 步骤1：创建GitHub仓库

1. **登录GitHub**
   - 访问 [github.com](https://github.com)
   - 使用您的账号登录

2. **创建新仓库**
   ```
   仓库名称：cyber-snake-game
   描述：赛博霓虹风格贪吃蛇游戏
   可见性：Public（公开）
   ✅ 勾选 "Add a README file"
   ```

3. **点击 "Create repository"**

### 步骤2：上传项目文件

#### 方法A：网页上传（推荐新手）
1. 在仓库页面点击 "Add file" → "Upload files"
2. 拖拽以下文件到页面：
   ```
   📁 .github/workflows/deploy.yml
   📄 index.html
   📄 styles.css
   📄 README.md
   📄 DEPLOY.md
   📁 js/ (整个文件夹)
   ```
3. 填写提交信息：`初始化赛博霓虹贪吃蛇游戏`
4. 点击 "Commit changes"

#### 方法B：Git命令行（推荐有经验用户）
```bash
# 在项目目录下执行
git init
git add .
git commit -m "初始化赛博霓虹贪吃蛇游戏"
git branch -M main
git remote add origin https://github.com/您的用户名/cyber-snake-game.git
git push -u origin main
```

### 步骤3：启用GitHub Pages

1. **进入仓库设置**
   - 点击仓库页面的 "Settings" 标签

2. **配置Pages**
   - 在左侧菜单找到 "Pages"
   - Source 选择：`GitHub Actions`
   - 点击 "Save"

3. **等待部署完成**
   - 查看 "Actions" 标签页的部署进度
   - 绿色✅表示部署成功

### 步骤4：访问您的游戏

部署成功后，游戏将在以下地址可用：
```
https://您的GitHub用户名.github.io/cyber-snake-game
```

## 🔄 自动更新流程

配置完成后，每次您：
1. 修改游戏代码
2. 推送到GitHub仓库
3. 自动触发部署
4. 几分钟后网站自动更新

## 📱 游戏特性

您的游戏已完美支持：
- ✅ **跨平台兼容**：PC、手机、平板
- ✅ **响应式设计**：自动适配屏幕尺寸
- ✅ **触摸控制**：移动设备虚拟按键
- ✅ **本地存储**：分数和设置自动保存
- ✅ **性能优化**：流畅运行不卡顿
- ✅ **赛博朋克风格**：炫酷的视觉效果

## 🎯 分享您的游戏

部署完成后，您可以：

### 📤 直接分享
- 复制游戏链接发给朋友
- 在社交媒体上发布
- 添加到个人网站

### 📱 移动端分享
- 制作二维码方便扫码访问
- 微信、QQ群分享链接
- 朋友圈展示游戏截图

### 🌟 推广建议
- 录制游戏演示视频
- 制作精美的宣传图片
- 在游戏社区分享

## 🛠️ 故障排除

### 部署失败
1. 检查 "Actions" 页面的错误信息
2. 确保所有文件都已正确上传
3. 验证 `.github/workflows/deploy.yml` 文件格式

### 访问404错误
1. 确认GitHub Pages已启用
2. 检查仓库是否为Public
3. 等待几分钟让DNS生效

### 游戏功能异常
1. 检查浏览器控制台错误
2. 确认所有JS文件都已上传
3. 验证文件路径是否正确

## 📊 监控和分析

### 访问统计
可以添加Google Analytics：
```html
<!-- 在index.html的<head>中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 性能监控
- 使用浏览器开发者工具
- 监控加载速度和运行性能
- 收集用户反馈

## 🎮 享受您的游戏！

恭喜！您的赛博霓虹贪吃蛇游戏现在已经：
- 🌐 在线可访问
- 🔄 自动更新
- 📱 移动友好
- 🚀 性能优化

立即开始分享给朋友们体验吧！🎉