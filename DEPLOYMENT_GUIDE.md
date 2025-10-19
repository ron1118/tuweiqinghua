# 部署说明

## Vercel 部署（推荐）

### 方法一：通过 Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 设置环境变量
vercel env add OPENROUTER_API_KEY
# 输入值：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
```

### 方法二：通过 GitHub + Vercel
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置环境变量：
   - `OPENROUTER_API_KEY`: `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`
4. 自动部署

### 方法三：直接上传
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Upload" 上传项目文件夹
4. 设置环境变量
5. 部署

## 环境变量设置

在 Vercel 项目设置中添加以下环境变量：

```
OPENROUTER_API_KEY=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
```

## 其他部署平台

### Netlify
```bash
npm run build
# 上传 .next 文件夹到 Netlify
```

### 自托管
```bash
npm run build
npm start
```

## 部署后测试

1. 访问部署的URL
2. 测试API功能
3. 测试移动端适配
4. 测试PWA功能

## 注意事项

- 确保API密钥有效且有足够额度
- 生产环境建议使用自定义域名
- 可以配置CDN加速访问
- 建议设置监控和日志
