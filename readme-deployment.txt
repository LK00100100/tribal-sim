Things seemed to have changed a bit.
These are firebase deployment instruments:

# Go to your project root folder (has firebase.json).

# Make sure you're logged in
firebase login

# you may need to update
npm i -g firebase-tools

# you should be able to get a list of your projects
firebase list

# if you have a "certificate problem," you may be using an old version of firebase.
firebase logout
firebase login

# look at the package.json for the production 'build' command.
# build the app so that it goes into the dist folder.
# you should be able to use our command
npm run deploy

----------

# alternative steps. Although you shouldn't need this.

# try to get the token
# log into google, get the token.
firebase login:ci

# deploy
firebase deploy --token "large-token-here"
