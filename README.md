# postman-combine
Using to combine many postman collections to one (ex: for running newman + jenkins with one result)

### Install:
  npm install postman-combine -g
  
### How to use
  ##### Combine many files to one
    *postman-combine* -dest output.json -f a.json b.json
  
  ##### Combine all files inside folder to one
    *postman-combine* -dest output.json -d input
  
  ##### Help
    *postman-combine* -h or postman-combine --help
