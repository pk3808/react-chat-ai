# Publishing Instructions for react-chat-ai

To publish the updated version of the react-chat-ai library to npm, follow these steps:

## Prerequisites
1. You need to have an npm account
2. You need to be logged in to npm from your command line
3. You need to have publish rights for the `react-chat-ai` package

## Steps to Publish

1. **Login to npm** (if not already logged in):
   ```bash
   npm login
   ```

2. **Verify your changes**:
   - Make sure you've built the project: `npm run build`
   - Check that the version in package.json is correct (currently 1.0.5)

3. **Test the package locally** (optional but recommended):
   ```bash
   npm pack
   ```
   This creates a .tgz file that you can install in a test project to verify everything works.

4. **Publish to npm**:
   ```bash
   npm publish
   ```

## Alternative: Using npm publish command directly
If you're already logged in, you can run:
```bash
npm publish
```

## Verification
After publishing, you can verify the new version is available by visiting:
https://www.npmjs.com/package/react-chat-ai

## Note
The current version is 1.0.5 with the following fixes and improvements:
- Fixed issue where chat container height was increasing instead of becoming scrollable
- Fixed issue where widget positioning was not working correctly
- Added support for all positioning options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
- Increased widget button size from 56px to 80px (w-14 to w-20) and icon size from 24 to 32 for better visibility
