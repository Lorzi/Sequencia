# SEQUENCIA

Sequencia is a web framework for visualizing and learning sequence alignments developed by BOIVIN Lorentz, student at the University of Mons (UMons) and supervised by Mr. Tom Mens.
It was developed to allow anyone with any interest in this subject or in bioinformatics to understand how it works.
This comes in the form of a web application running directly in a web browser that is easy to install and use.

The framework exist in English and in French. Choose the right version in the releases section.
## Installation

Download the last release of this framework.\
First make sure, Node.js is installed on your computer.\
If not, you can install it at this address : https://nodejs.org/en

Extract the build file and open a console in the location of the directory.

Install serve on your machine, you can type this in a console :
```
npm install serve
```
Start the framework in local :
```
serve -s build
```
Then you can now enjoy the app by opening http://localhost:3000 in your browser.

## Usage

Once you are on http://localhost:3000, you will arrive on a main menu.
You can choose between 4 differents options :
- Normal Mode (Mode Normal)
- Game mode (Mode jeu)
- BLOSUM Mode (Mode BLOSUM)
- Help and infos (Aide et informations)

In the Normal mode, you can visualise the alignement of sequences and try differents others algorithms and variants.\
In the game mode, you can choose between 2 differents game mode that will help you to understand how the alignment are made and how we compute the optimal paths.\
In the BLOSUM mode, you can upload your own custom matrix of score. In the release, you will find a template with bunch of ZERO and letters. It's a .JSON file, you juste have to put the value you want. Otherwise ti use the BLOSUM62 matrix and apply the algorithm of NeedlemanWunsch.
In Help and info you can find a documentation but the language is only available in French for the moment.

## Opening without build file
There is a way to open it in development mode but it require the whole source code. \
Note : this is the by default generated instruction when you start a project in React.
If you want you can try to start the project with npm :
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
