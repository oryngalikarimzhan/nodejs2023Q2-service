FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json .
RUN npm install --legacy-peer-deps && npm cache clean --force
COPY . .

# 
# Development Stage
# 

FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

# 
# Migration generating
# 

FROM base AS migration-gen
CMD ["npm", "run", "migration:generate", "--", "db/migrations/migration"]

# 
# Production Stage
# 

FROM base AS production
RUN npm run build
RUN npm run migration:run
CMD ["npm", "run", "start:prod"]


