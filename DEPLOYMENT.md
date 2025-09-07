# 🚀 Vercel Deployment Guide

## Quick Deployment Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Visit Vercel**: Go to https://vercel.com
2. **Sign Up/Login**: Use your GitHub account
3. **Import Project**: Click "New Project" → "Import Git Repository"
4. **Select Repository**: Choose `yogesh35/mental-health-support-system`
5. **Configure Environment Variables** (Very Important):
   ```
   REACT_APP_DESCOPE_PROJECT_ID = P320pek6bTCR9UDC2zhl4bIC9LJg
   REACT_APP_DESCOPE_MANAGEMENT_KEY = K32Hw3B0kR3hKy60Ur7pIYlGHei5WrlQAEoUOo10xopgNybOXHhOoulSqbt4RPV7wJ3kJgC
   REACT_APP_DESCOPE_FLOW_ID = sign-up-or-in
   REACT_APP_GEMINI_API_KEY = AIzaSyDcDFpqb-m-vkbocJmaLQZgNdmSUC7kZbc
   ```
6. **Deploy**: Click "Deploy" and wait for completion

### Method 2: Vercel CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Set environment variables
vercel env add REACT_APP_DESCOPE_PROJECT_ID
vercel env add REACT_APP_DESCOPE_MANAGEMENT_KEY  
vercel env add REACT_APP_DESCOPE_FLOW_ID
vercel env add REACT_APP_GEMINI_API_KEY

# Deploy to production
vercel --prod
```

## Environment Variables Setup

**⚠️ CRITICAL: You MUST set these environment variables in Vercel:**

| Variable | Value |
|----------|-------|
| `REACT_APP_DESCOPE_PROJECT_ID` | `P320pek6bTCR9UDC2zhl4bIC9LJg` |
| `REACT_APP_DESCOPE_MANAGEMENT_KEY` | `K32Hw3B0kR3hKy60Ur7pIYlGHei5WrlQAEoUOo10xopgNybOXHhOoulSqbt4RPV7wJ3kJgC` |
| `REACT_APP_DESCOPE_FLOW_ID` | `sign-up-or-in` |
| `REACT_APP_GEMINI_API_KEY` | `AIzaSyDcDFpqb-m-vkbocJmaLQZgNdmSUC7kZbc` |

### How to add Environment Variables in Vercel:

1. Go to your project dashboard in Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable one by one:
   - Click "Add New"
   - Enter the variable name
   - Enter the value
   - Select "Production", "Preview", and "Development"
   - Click "Save"

## Deployment Configuration

The project includes:
- ✅ `vercel.json` - Optimized Vercel configuration
- ✅ `package.json` - Proper build scripts
- ✅ Route handling for Single Page Application
- ✅ Static asset caching optimization

## Post-Deployment Steps

### 1. Custom Domain (Optional)
- In Vercel dashboard, go to "Domains"
- Add your custom domain
- Follow DNS configuration instructions

### 2. SSL Certificate
- Automatically provided by Vercel
- HTTPS enabled by default

### 3. Performance Monitoring
- Vercel Analytics automatically tracks performance
- View metrics in the "Analytics" tab

## Troubleshooting

### Build Errors
- Check environment variables are set correctly
- Ensure all dependencies are in package.json
- Review build logs in Vercel dashboard

### Runtime Errors
- Check browser console for JavaScript errors
- Verify API keys are working
- Test authentication flow

### Environment Variables Not Working
- Ensure variables start with `REACT_APP_`
- Redeploy after adding environment variables
- Check variable names match exactly

## Expected URLs

After successful deployment:
- **Production URL**: `https://mental-health-support-system.vercel.app`
- **Custom Domain**: Configure in Vercel settings

## Security Notes

- Environment variables are secure in Vercel
- HTTPS is enforced automatically
- API keys are only exposed to your application

## Performance Optimizations

The deployment includes:
- Bundle splitting and code optimization
- Static asset caching (1 year cache)
- Gzip compression
- CDN distribution worldwide

---

**Ready to deploy! Follow the steps above to get your Mental Health Support System live on Vercel! 🎉**
