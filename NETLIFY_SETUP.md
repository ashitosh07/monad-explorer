# 🌐 Netlify Deployment Setup

## Environment Variable Configuration

Your Netlify deployment is missing the required environment variable. Follow these steps:

### 1. Go to Netlify Dashboard
- Visit: https://app.netlify.com/
- Select your `monad-explorer` site

### 2. Add Environment Variable
- Go to **Site Settings** → **Environment Variables**
- Click **Add a variable**
- Set:
  - **Key**: `MONAD_RPC_URL`
  - **Value**: `https://monad-testnet.g.alchemy.com/v2/YOUR_ACTUAL_API_KEY`

### 3. Redeploy
- Go to **Deploys** tab
- Click **Trigger deploy** → **Deploy site**

## Alternative: Quick Fix via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variable
netlify env:set MONAD_RPC_URL "https://monad-testnet.g.alchemy.com/v2/YOUR_API_KEY"

# Redeploy
netlify deploy --prod
```

## Verify Setup
After setting the environment variable, test:
- https://monad-explorer.netlify.app/api/stats
- https://monad-explorer.netlify.app/api/search/0x703183b1654125b1E5d6CeE97ff34c4B7Fadd056

Both should return data instead of the environment variable error.