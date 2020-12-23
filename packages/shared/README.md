# server/

## Publishing Docker Builds

### Prerequisites

- You must be added to https://hub.docker.com/orgs/rcanalytics and have push permissions to the following repos:
  - `rcanalytics/product-api-mssql-rca-web-accounts:latest`
  - `rcanalytics/product-api-elasticsearch-transactions:latest`

### Build Elasticsearch and MSSQL Containers

- Connect to VPN
- Mount the network drive
  - MacOS
    - `osascript -e 'mount volume "smb://rca-file-server/RCA/product-api"'`
- The following scripts will build and publish the docker container to dockerhub
  - MacOS/Linux
    - `./docker/mssql-rca-web-accounts/build.sh /Volumes/product-api/dbRCAWebAccounts_min.bak`
    - `./docker/mssql-rca-web-accounts/build.sh /Volumes/product-api/transactions.ndjson`
