# Authorization Server

A learning project to design and implement an Authorization Server from scratch, exploring the internal mechanisms behind modern authentication systems such as OAuth2 and OpenID Connect.

The goal of this project is to understand how identity providers like Auth0, Okta, and Cognito work internally by implementing the core components ourselves.

## Project Structure

This repository contains two separate applications:

- **Authorization Server:** Modern authentication server implementing OAuth2 concepts and issuing JWT tokens
- **UI Application:** Frontend client used to authenticate users and interact with the authorization server

## Running the Project

Install the dependencies:

```
pnpm install
```

### Authorization Server

Setup the database:

```
cp apps/auth-server/db.sample.json apps/auth-server/db.json
```

Run the service:

```
cd apps/auth-server
pnpm run dev
```

### Web UI

Run the service:

```
cd apps/web-ui
pnpm run dev
```

Navigate to http://localhost:3000
