FROM postgres:15-alpine
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=db

CMD [ "postgres", "-c", "logging_collector=on", "-c", "log_statement=all" ]

