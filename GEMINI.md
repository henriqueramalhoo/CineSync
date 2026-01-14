# GEMINI.md: Project Overview

## Project Overview

This is a **React** web application project initialized using the **Vite** build tool. It appears to be a minimal setup, likely at the beginning of its development lifecycle.

The key technologies used are:
- **React:** The core JavaScript library for building the user interface.
- **Vite:** A modern frontend build tool that provides a faster and leaner development experience.
- **Tailwind CSS:** A utility-first CSS framework for styling the application, as indicated by the presence of `tailwind.config.js` and `postcss.config.js`.
- **ESLint:** A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, ensuring code quality.
- **JSON Server (Inferred):** The presence of an empty `db.json` file strongly suggests that the project is intended to use `json-server` to create a mock REST API for development.

The main application entry point is `src/main.jsx`, which renders the root `App` component located in `src/App.jsx`. Currently, the `App` component contains the default Vite + React template content.

## Building and Running

### Prerequisites
- Node.js and npm (or a compatible package manager) must be installed.

### Installation
To install project dependencies, run:
```bash
npm install
```

### Development
To run the application in development mode with hot-reloading:
```bash
npm run dev
```

### Mock API Server
If the project uses `json-server` as inferred, you will likely need to run it in a separate terminal to provide API endpoints. The command is typically:
```bash
# TODO: Verify if json-server is the intended tool and if this is the correct command.
npx json-server --watch db.json --port 3001
```

### Building for Production
To create a production-ready build of the application:
```bash
npm run build
```
The output will be in the `dist` directory.

### Previewing the Production Build
To serve the production build locally for testing:
```bash
npm run preview
```

## Development Conventions

### Linting
The project is configured with ESLint. To check the code for linting errors, run:
```bash
npm run lint
```

### Styling
Styling should be done using **Tailwind CSS** utility classes. Customizations to the default Tailwind configuration can be made in the `tailwind.config.js` file. Global styles are located in `src/index.css`.
