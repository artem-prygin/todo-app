# TODO List Application

This is a simple and responsive TODO List application built with Angular and Angular Material. The app allows users to manage their tasks by adding,
deleting, and marking tasks as favourite. Users can toggle their favorite tasks, set deadlines using date and time pickers, and enjoy smooth
interactions with debounced actions. The app is fully responsive, with a collapsible navigation bar that adapts to mobile devices.

## Features

- **Task Management**: Add, delete, and mark tasks as favourite.
- **Favorites**: Easily toggle favorite tasks with a click.
- **Date & Time Pickers**: Set task deadlines with Angular Material’s date and time pickers.
- **Debounced Actions**: Prevent excessive API calls and ensure smoother user interactions with debounced actions.
- **Responsive Design**: The app is mobile-friendly with a collapsible navigation bar.

## Installation

To get the project up and running locally, follow these steps:

### 1. Navigate into the project directory:

   ```bash
   cd todo-app
   ```

### 2. Install the required dependencies:

To install the necessary packages for the project, run the following command:

```bash
npm install
```

This will install all the dependencies listed in the package.json file.

### 3. Run the app in development mode

After the installation is complete, you can run the app in development mode by executing the following command:

```bash
npm start
```

This will start the Angular development server, and you can access the app by navigating to http://localhost:4200 in your browser.

### 4. Build the app for production

To build the app for production, run the following command:

```bash
npm run build
```

This will create a dist/ directory containing the optimized, minified, and production-ready files. You can deploy the contents of this directory to
your production server.
