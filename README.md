# postman-combine

[![npm](https://img.shields.io/npm/v/postman-combine.svg)](https://www.npmjs.com/package/postman-combine)

Using to combine many postman collections to one (ex: for running newman + jenkins with one result)  
```Note: support version 2.1```  
```Old versions will be updated soon```  
TODO Phan: update old version

### Install
  npm install postman-combine -g
  
### How to use
  ##### Combine many files to one
    postman-combine -dest output.json -f a.json b.json
  
  ##### Combine all files inside folder to one
    postman-combine -dest output.json -d input
  
  ##### Help
    postman-combine -h or postman-combine --help
