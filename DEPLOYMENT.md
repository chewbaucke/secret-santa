# Deploying to Vercel

This guide will help you deploy your Secret Santa app to Vercel.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account (recommended)
- Or use Vercel CLI for direct deployment

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add Next.js Secret Santa app"
   git push origin master
   ```

2. **Go to [Vercel](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your Git repository**:
   - Select your repository
   - Vercel will auto-detect Next.js

5. **Configure the project**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

6. **Click "Deploy"**

7. **Wait for deployment** - Your app will be live in ~2 minutes!

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? (select your account)
   - Link to existing project? **No** (first time)
   - Project name? (press enter for default)
   - Directory? `./` (press enter)
   - Override settings? **No** (press enter)

5. **Your app is deployed!** You'll get a URL like `https://secret-santa-xxx.vercel.app`

## Post-Deployment

- **Automatic deployments**: Every push to your main branch will trigger a new deployment
- **Preview deployments**: Pull requests get preview URLs automatically
- **Custom domain**: Add your own domain in the Vercel dashboard under "Domains"

## Environment Variables

No environment variables are needed - the app uses browser localStorage only.

## Troubleshooting

### Build fails
- Make sure all dependencies are in `package.json`
- Check that `npm run build` works locally
- Review build logs in Vercel dashboard

### App doesn't work
- Check browser console for errors
- Verify localStorage is enabled in browser
- Check Vercel function logs

## Updating Your Deployment

Just push to your main branch:
```bash
git add .
git commit -m "Update app"
git push origin master
```

Vercel will automatically deploy the changes!

