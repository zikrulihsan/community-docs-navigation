# Deployment Guide - Netlify

This guide will help you deploy your Community Docs Navigation app to Netlify with automatic deployments on every commit to main.

## Prerequisites

- GitHub account
- Netlify account (free tier is sufficient)
- Your code pushed to a GitHub repository

## Quick Deploy to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "feat: prepare for Netlify deployment"
   git push origin main
   ```

2. **Go to Netlify**:
   - Visit [https://app.netlify.com](https://app.netlify.com)
   - Sign up or log in with your GitHub account

3. **Import your project**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub repositories
   - Select your `community-docs-navigation` repository

4. **Configure build settings**:
   Netlify should auto-detect these settings, but verify:
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: .next
   ```

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - You'll get a random URL like `random-name-123456.netlify.app`

6. **Custom domain (optional)**:
   - Go to Site settings → Domain management
   - Click "Add custom domain" to use your own domain

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize Netlify in your project**:
   ```bash
   netlify init
   ```

4. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Automatic Deployments

Once connected to GitHub, Netlify will automatically:

- ✅ Deploy every commit to `main` branch to production
- ✅ Create deploy previews for pull requests
- ✅ Run build checks before deploying
- ✅ Rollback to previous deployments if needed

### Configure Branch Deployments

1. Go to Site settings → Build & deploy → Continuous deployment
2. Under "Deploy contexts":
   - **Production branch**: `main` (already set)
   - **Branch deploys**: Enable for specific branches if needed
   - **Deploy previews**: Enabled by default for PRs

## Environment Variables

If you need environment variables:

1. Go to Site settings → Build & deploy → Environment
2. Click "Add variable"
3. Add your variables (e.g., API keys, database URLs)
4. Redeploy your site

Example variables from `.env.example`:
```
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

## Build Configuration

The `netlify.toml` file in the root directory contains:

- Build command and publish directory
- Node.js version (20)
- Next.js plugin configuration
- Security headers
- Cache headers for static assets
- Redirect rules

## Monitoring Your Deployments

### Deploy Logs
- Click on any deployment in the Netlify dashboard
- View real-time build logs
- Check for errors or warnings

### Deploy Notifications
Set up notifications in Site settings → Build & deploy → Deploy notifications:
- Email notifications
- Slack notifications
- Webhook notifications

## Troubleshooting

### Build Fails

1. **Check build logs** in Netlify dashboard
2. **Common issues**:
   - Missing dependencies: Run `npm install` locally
   - TypeScript errors: Run `npm run build` locally to catch them
   - Environment variables: Check if all required vars are set

### Deploy Previews Not Working

1. Go to Site settings → Build & deploy → Deploy contexts
2. Enable "Deploy previews" for pull requests
3. Make sure the PR is from the same repository

### Site Not Updating

1. Check if the deployment succeeded in the Netlify dashboard
2. Clear your browser cache
3. Check if the correct branch is being deployed
4. Manually trigger a redeploy: Deploys → Trigger deploy → Deploy site

## Performance Optimization

Netlify automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ HTTP/2 & HTTP/3
- ✅ Asset optimization
- ✅ Automatic cache invalidation

## Useful Commands

```bash
# Check deployment status
netlify status

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# View deploy logs
netlify watch

# Manual deploy (production)
netlify deploy --prod

# Manual deploy (preview)
netlify deploy
```

## Cost

- **Free tier includes**:
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - Unlimited sites
  - Deploy previews
  - HTTPS
  - Continuous deployment

Perfect for this project! 🎉

## Next Steps

After deployment:

1. ✅ Test your live site
2. ✅ Set up custom domain (optional)
3. ✅ Configure analytics (optional)
4. ✅ Set up form handling (if needed)
5. ✅ Enable Netlify Functions (if needed)

## Support

- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Community](https://answers.netlify.com)
- [Next.js on Netlify Guide](https://docs.netlify.com/frameworks/next-js/overview/)
