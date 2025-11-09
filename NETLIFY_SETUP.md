# Quick Netlify Setup Guide

Follow these steps to deploy your app to Netlify with automatic deployments.

## Step-by-Step Setup (5 minutes)

### 1. Go to Netlify
Visit: **https://app.netlify.com**

### 2. Sign Up / Log In
- Click "Sign up" or "Log in"
- Choose "Continue with GitHub"

### 3. Import Your Project
1. Click **"Add new site"**
2. Select **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify (if first time)
5. Search for and select: **`community-docs-navigation`**

### 4. Configure Build Settings
Netlify should auto-detect these (verify they're correct):

```
Repository: zikrulihsan/community-docs-navigation
Branch to deploy: main
Base directory: (leave empty)
Build command: npm run build
Publish directory: .next
```

### 5. Deploy!
1. Click **"Deploy community-docs-navigation"**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at: `https://random-name-123456.netlify.app`

### 6. (Optional) Custom Domain
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your domain

## ✅ Automatic Deployments Configured!

From now on:
- Every push to `main` branch = Automatic deployment to production
- Every pull request = Deploy preview with unique URL
- Build failures = Email notification

## View Your Deployment
Once deployed, you can:
- Click on the deployment in Netlify dashboard
- View build logs
- See deploy history
- Configure custom domain
- Set up environment variables

## Troubleshooting

**Build fails?**
- Check the build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
- Run `npm run build` locally to test

**Site not updating?**
- Check if deployment succeeded (green checkmark)
- Clear browser cache
- Manually trigger redeploy from Netlify dashboard

**Need help?**
- See full guide: `DEPLOYMENT.md`
- Netlify docs: https://docs.netlify.com

---

Your repository is already configured with:
- ✅ `netlify.toml` - Build configuration
- ✅ `.env.example` - Environment variable template
- ✅ `DEPLOYMENT.md` - Comprehensive deployment guide

Ready to deploy! 🚀
