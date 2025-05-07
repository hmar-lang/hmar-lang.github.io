
# Deployment Guide for Hmar Word Haven

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

## Setup

1. Go to your GitHub repository settings.
2. Navigate to "Secrets and variables" > "Actions".
3. Add the following repository secrets:
   - `SUPABASE_URL`: Your Supabase project URL (e.g., "https://abcdefghijklm.supabase.co")
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous/public API key

## GitHub Pages Configuration

1. Go to your repository settings.
2. Navigate to "Pages".
3. Under "Build and deployment", select:
   - Source: "GitHub Actions"
4. If using a custom domain:
   - Add your domain in the "Custom domain" section
   - Create a CNAME file in your repository if needed

## How Deployment Works

- When you push to the `main` branch, the GitHub Actions workflow automatically:
  1. Builds your React application
  2. Configures GitHub Pages
  3. Deploys the built files to GitHub Pages

- You can also manually trigger a deployment from the "Actions" tab in your repository.

## Troubleshooting

If deployment fails:
1. Check the GitHub Actions logs for error messages
2. Verify that all required secrets are properly set
3. Ensure your repository has the correct permissions for GitHub Pages
4. Check if your package.json has the correct build script
