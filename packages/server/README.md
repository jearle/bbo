# server/

# Publishing Docker Builds

## Prerequisites

- You must be added to https://hub.docker.com/orgs/rcanalytics and have push permissions.

## MSSQL RCA Web Accounts

- Connect to VPN
- Mount the network drive
  - MacOS
    - osascript -e 'mount volume "smb://rca-file-server/RCA/product-api"'
- Run
  - MacOS/Linux
    - `./docker/mssql-rca-web-accounts/build.sh /Volumes/product-api dbRCAWebAccounts_min.bak`
