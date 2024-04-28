# SafeSpace Extension

## Tech Stack

- Turbo repo
- Plasmo framework
- React
- Tailwind CSS
- Pangea
- Shadcn UI

## Local Development

### Prerequisites

- Node.js
- pnpm
- Pangea account

### Setup

1. Clone the repository

2. Install the dependencies

```bash
pnpm install
```

3. Move to the extension directory

```bash
cd apps/extension
```

4. Create a `.env` file in the root of the extension directory by copying the `.env.example` file

```bash
cp .env.example .env.development
```

5. Fill in the required environment variables in the `.env.development` file

> **_NOTE:_** Make sure the webapp server is running before starting the extension
> to avoid any kind of weird behaviours. Or you can move to the root directory of the project and run `pnpm dev` to start all the services at once.

6. Start the development server

```bash
pnpm dev
```

7. Open chrome and go to `chrome://extensions/`

8. Enable developer mode

9. Click on `Load unpacked` and select the `build/chrome-mv3-dev` folder in the extension directory

10. The extension will be loaded in the browser
