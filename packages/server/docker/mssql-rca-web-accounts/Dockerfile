FROM mcr.microsoft.com/mssql/server:2017-latest

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=1Strong@Password
 
COPY ./dba-rca-web-accounts.bak /opt/mssql/backup/

RUN (/opt/mssql/bin/sqlservr --accept-eula & ) | grep -q "Service Broker manager has started." && \
sleep 1 && \
/opt/mssql-tools/bin/sqlcmd \
  -U sa \
  -P $SA_PASSWORD \
  -Q "RESTORE FILELISTONLY FROM DISK = '/opt/mssql/backup/dba-rca-web-accounts.bak';" && \
/opt/mssql-tools/bin/sqlcmd \
  -U sa \
  -P $SA_PASSWORD \
  -Q "RESTORE DATABASE dbRCAWebAccounts FROM DISK = '/opt/mssql/backup/dba-rca-web-accounts.bak' WITH MOVE 'dbRCAAccounts' TO '/var/opt/mssql/data/dbRCAWebAccounts_slim2.mdf', MOVE 'ftrow_dbRCAWebAccountCatalog' TO '/var/opt/mssql/data/dbRCAWebAccounts_slim2_1.ndf', MOVE 'dbRCAAccounts_log' TO '/var/opt/mssql/data/dbRCAWebAccounts_slim2_2.ldf';" 
