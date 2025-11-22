# Setting Up GitHub Personal Access Token with Workflow Scope

## Why You Need This

GitHub requires the `workflow` scope to create or update GitHub Actions workflow files (`.github/workflows/*.yml`). Your current token doesn't have this permission.

## Steps to Create a New Token

1. **Go to GitHub Token Settings**:
   - Visit: https://github.com/settings/tokens/new
   - Or: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token

2. **Configure the Token**:
   - **Note**: Give it a descriptive name like "Secret Santa Repo - Full Access"
   - **Expiration**: Choose your preferred expiration (90 days recommended)
   - **Scopes**: Check the following boxes:
     - ✅ `repo` (Full control of private repositories)
       - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (optional, if you use packages)
     - ✅ `delete:packages` (optional, if you use packages)

3. **Generate Token**:
   - Click "Generate token" at the bottom
   - **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

4. **Update Your Git Credentials**:
   ```bash
   # Clear old credentials
   git credential-osxkeychain erase <<EOF
   host=github.com
   protocol=https
   EOF
   
   # Push again (will prompt for new credentials)
   git push
   ```
   When prompted:
   - Username: `chewbaucke`
   - Password: Paste your NEW token (not your GitHub password)

## Alternative: Use GitHub CLI

If you prefer, you can use GitHub CLI which handles authentication automatically:

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Login
gh auth login

# This will handle token creation automatically with correct scopes
```

## Required Scopes Summary

For this project, you need:
- ✅ **`repo`** - Full repository access
- ✅ **`workflow`** - GitHub Actions workflow access

## Troubleshooting

If you still get errors:
1. Make sure you copied the entire token (it's long!)
2. Verify the token hasn't expired
3. Check that both `repo` and `workflow` scopes are selected
4. Try clearing credentials and re-entering them

