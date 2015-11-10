# Music-server

Music-server is a small project for the course angular.js programming project and node.js programming project at the University of Helsinki, Department of Computer Science. It provides 
* A small api for uploading and downloading songs, and getting infos from uploaded albums and songs  
* An angular HTML5 based music library and player.

### Table of Contents  
* [Requirements](#Requirements)    
* [Installation](#Installation)  
* [Start](#Start)  
 * [Development](#Development)  
 * [Production](#Production)
* [Testing](#Test)  
* [Worklog](#Worklog)  

<a name="Requirements"/>
## Requirements

* Node.js >= 5.x.x

<a name="Installation"/>
## Installation
To install the server clone the repository to folder and run
```
npm install
```
After npm and sails has finished with their dependencies, bower dependecies are needed. You can install all of the bower dependencies by running
```
bower install
```
If Bower isn't set to your path, you can use npm script instead
```
npm bower
```
<a name="Start"/>
## Start
<a name="Development"/>
### Development
BeforeTo start up a server run.
```
node app.js
```
A server will be available by default on port 1337. You can change this by changing config/env/development.js
<a name="Production"/>
### Production
To start up a production server with different configs, minimized scripts and styles and without watches on files, run 
```
node app.js --prod
```
You can modified production configs by changing config/env/production.js
<a name="Test"/>
## Testing
To test the code you need to run
```
npm test
```
This will run both clientside tests and node tests. Coverage report will be generated in the *coverage/* folder

<a name="Worklog" />
## Worklog
Hours are logged here
[Worklog.md](Worklog)
