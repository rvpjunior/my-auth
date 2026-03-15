# Authorization Server

A learning project to design and implement an Authorization Server from scratch, exploring the internal mechanisms behind modern authentication systems such as OAuth2 and OpenID Connect.

The goal of this project is to understand how identity providers like Auth0, Okta, and Cognito work internally by implementing the core components ourselves.

## Project Structure

This repository contains three separate applications that together simulate the evolution of an authentication system.

- **Authorization Server:** Modern authentication server implementing OAuth2 concepts and issuing JWT tokens
- **Legacy Auth API:** Example of a traditional monolithic authentication system using session cookies
- **UI Application:** Frontend client used to authenticate users and interact with the authorization server

## Running the Project

Install the dependencies:

```
pnpm install
```

### Legacy Auth

Setup the database:

```
docker compose up legacy-auth-postgres
pnpm -C apps/legacy-auth-api run prisma:migrate
```

Run the service and the UI:

```
docker compose up legacy-auth-api
```

Navigate to http://localhost:3000/legacy

### Authorization Server

Setup the database:

```
cp apps/auth-server/db.sample.json apps/auth-server/db.json
```

Run the service and the UI:

```
docker compose up auth-server
```

Navigate to http://localhost:3000
