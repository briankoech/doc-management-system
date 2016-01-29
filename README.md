### Document Management System - Checkpoint III

Create, edit and view documents.

The DMS helps you create Documents and view them based on priviledges the user has been given. There are 3 roles allowed: Admin, contributor and viewer.
Each document has an access level based on these 3 roles. Documents can be categorised by type.

### Installation
1. Clone this repo to you computer.
2. Run npm install to install dependencies
3. Ensure that Mongodb is installed. If not checkout this [link](https://docs.mongodb.org/manual/installation/) 
4. Edit the `server/config/config.js` file to suite your Mongodb configurations
5. Run by using the `nodemon` command in  the terminal/cmd

### Testing
Testing is done via Jasmine.
* Use the `jasmine` or `npm test` command to run the tests.

