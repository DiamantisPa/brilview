# BrilviewClient

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.26.

## Setup

```
npm install
```

## Development server
Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Development with backend:

1. Start brilview server (from project root directory) `python brilview-run.py --config brilview/data/brilview_dev.yaml`. Make sure you have brilconda in path and `brilview_dev.yaml` has correct paths (e.g. to brilcalc).
2. Run `npm run serve` (server ports must match on `proxy.config.json` with `brilview_dev.yaml`)

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Note: node v>10 introduces node-sass error. Keep node version v10 for compilation. 
