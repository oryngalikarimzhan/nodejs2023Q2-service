FROM postgres:15-alpine

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -d ${POSTGRES_DB} -p ${DB_PORT} -U ${POSTGRES_USER}

CMD [ "postgres", "-c", "logging_collector=on", "-c", "log_statement=all" ]

