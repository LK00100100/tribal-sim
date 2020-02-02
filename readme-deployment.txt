Things seemed to have changed a bit.
These are firebase deployment instruments:

# Go to your project root folder (has firebase.json).

# Make sure you're logged in
firebase login

# you may need to update
npm i -g firebase-tools

# you should be able to get a list of your projects
# otherwise your certificate may have expired
firebase list

# try to get the token
# log into google, get the token.
firebase login:ci

# deploy
firebase deploy --token "large-token-here"
