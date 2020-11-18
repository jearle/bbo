FROM mcr.microsoft.com/mssql/server:2017-latest

ENV BACKUP_URL=http://host.docker.internal:1337
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=1yourStrong(!)Password1
ENV MSSQL_PID=Developer
ENV MSSQL_TCP_PORT=1433 
        
EXPOSE 1433
 
ADD $BACKUP_URL /opt/mssql/backup/
        
RUN (/opt/mssql/bin/sqlservr --accept-eula & ) | grep -q "Service Broker manager has started" && /opt/mssql-tools/bin/sqlcmd -S127.0.0.1 -Usa -P $SA_PASSWORD -Q "RESTORE FILELISTONLY FROM DISK = '/opt/mssql/backup/dbrcawebaccounts_min.bak';"  &&  /opt/mssql-tools/bin/sqlcmd -S127.0.0.1 -Usa -P$SA_PASSWORD  -Q "RESTORE DATABASE dbRCAWebAccounts FROM DISK = '/opt/mssql/backup/dbrcawebaccounts_min.bak' WITH MOVE 'dbRCAAccounts' TO '/var/opt/mssql/data/dbRCAWebAccounts_slim2.mdf', MOVE 'ftrow_dbRCAWebAccountCatalog' TO '/var/opt/mssql/data/dbRCAWebAccounts_slim2_1.ndf', MOVE 'dbRCAAccounts_log' TO '/var/opt/mssql/data/dbRCAWebAccounts_slim2_2.ldf';" 