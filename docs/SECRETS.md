# SECRETS

This repository must not contain production credentials or real platform identifiers.

## WeChat

- Commit `touristappid` in shared project config.
- Keep the real WeChat AppID in local WeChat DevTools private settings.
- Never commit AppSecret.
- If GitHub reports an AppID alert, replace the value, rewrite the affected public history if needed, and rotate any paired AppSecret in the WeChat console.

## Local Files

Ignored local files:

- `project.private.config.json`
- `*.private.config.json`
- `.env`
- `.env.*`

If a local config is needed for development, create it locally and keep it ignored.
