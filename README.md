# Home Library Service

## Prerequisites

:warning: Before begin make that you i have installed following tools:

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js _(v18 LTS)_ - [Download & Install Node.js and the npm package manager](https://nodejs.org/en/download/).
- Docker - [Download & Install Docker](https://www.docker.com/).
- PostgreSQL\* - [Download & Install PostgreSQL](https://www.postgresql.org/download/).

_\* only if you are going to run in a local machine_

---

# Local installation

### Clone repository

```
git clone git@github.com:oryngalikarimzhan/nodejs2023Q2-service.git
```

### Install NPM modules

```
npm i --legacy-peer-deps
```

### Run application

```
npm start
```

---

# Database migration

### Generate migration

- only if _PostgreSQL_ is installed in your local machine

```
npm run migration:generate -- db/migrations/{migration_file_name}
```

### Run migration

- only if _PostgreSQL_ is installed in your local machine

```
npm run migration:run
```

---

# Docker containerization

### Development mode

```
npm run docker:dev
```

### Production mode

- in _production_ mode migration all migrations inside the folder 'db/migrations' will be automatically executed

```
npm run docker:prod
```

### Generating migration with docker

- if you did not install _PostgreSQL_ in your local machine, you can generate the migration after running the server with docker in [_development_](#development-mode) mode

```
npm run docker:migration:gen
```

### Stop and clear docker containers

```
npm run docker:down
```

### Scan docker image

```
docker scout quickview {username}/{image_name}:{tag} | {image_name}:{tag}
```

or use npm script that scans main images

```
npm run docker:scan
```

---

# OpenApi Specification explorer

After starting the app you can open in your browser OpenAPI documentation by typing

- default port 4000

```
http://localhost:4000/doc
```

---

## Testing

After application running open new terminal and enter.

```
npm run test
```

## Auto-fix and format

```
npm run lint
```

```
npm run format
```
