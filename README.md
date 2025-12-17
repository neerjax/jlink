# JLink

**Turning PROJ-1234 into something you can click.**

JLink is a simple web application that converts JIRA ticket numbers into clickable links. Perfect for quickly generating URLs for multiple JIRA tickets at once.

## Features

- Generate JIRA links from ticket numbers
- Support for multiple tickets (comma-separated)
- Export options:
  - Copy to clipboard
  - Download as CSV
  - Download as Markdown

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Enter your JIRA organization name (the part before `.atlassian.net`)
2. Enter your JIRA project name (e.g., "PROJ" in "PROJ-1234")
3. Enter comma-separated ticket numbers (e.g., "1234, 1235, 1236")
4. Click "Create Links"
5. Use the export buttons to copy or download your links

## Tech Stack

- React
- TypeScript
- Vite
