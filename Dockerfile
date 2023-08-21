FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json .
RUN npm install --legacy-peer-deps
COPY . .

# 
# Development Stage
# 

FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

# 
# Migration generating stage
# 

FROM base AS migration-gen
CMD ["npm", "run", "migration:generate", "--", "db/migrations/migration"]


# 
# Migration running Stage
# 

FROM base AS migration
CMD ["npm", "run", "migration:run"]


# 
# Production Stage
# 

FROM base AS production
RUN npm run build
CMD ["npm", "run", "start:prod"]


