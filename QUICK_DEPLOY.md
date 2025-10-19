# 🚀 快速部署指南

## 方法一：Vercel 一键部署（推荐）

### 1. 访问 Vercel
打开 [vercel.com](https://vercel.com) 并登录

### 2. 导入项目
- 点击 "New Project"
- 选择 "Import Git Repository" 
- 如果代码在本地，先推送到 GitHub

### 3. 配置项目
- **Framework Preset**: Next.js
- **Root Directory**: `./` (默认)
- **Build Command**: `npm run build` (默认)
- **Output Directory**: `.next` (默认)

### 4. 设置环境变量
在项目设置中添加：
```
OPENROUTER_API_KEY = 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
```

### 5. 部署
点击 "Deploy" 按钮，等待部署完成

## 方法二：本地 Vercel CLI

```bash
# 1. 登录
npx vercel login

# 2. 部署
npx vercel --yes

# 3. 设置环境变量
npx vercel env add OPENROUTER_API_KEY
# 输入：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

# 4. 重新部署
npx vercel --prod
```

## 方法三：GitHub 自动部署

### 1. 推送代码到 GitHub
```bash
# 如果还没有 GitHub 仓库
git remote add origin https://github.com/你的用户名/土味情话生成器.git
git push -u origin main
```

### 2. 在 Vercel 中连接 GitHub
- 选择 "Import Git Repository"
- 选择你的仓库
- 自动检测 Next.js 配置

### 3. 设置环境变量并部署

## 部署后测试

1. **访问部署的URL**
2. **测试功能**：
   - 输入消息测试AI生成
   - 调节暧昧程度滑块
   - 测试移动端适配
3. **分享给朋友**：
   - 发送部署URL
   - 可以添加到手机桌面使用

## 注意事项

- ✅ 项目已配置好所有必要文件
- ✅ 支持PWA，可安装到手机桌面
- ✅ 移动端和桌面端完美适配
- ✅ 包含备用情话库，API失败时自动切换
- ✅ 微信风格界面，用户友好

## 部署URL示例
部署完成后，你会得到一个类似这样的URL：
`https://土味情话生成器-xxx.vercel.app`

把这个URL分享给朋友们就可以使用了！🎉
