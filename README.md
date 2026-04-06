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

Setup the certificates:

```
openssl genpkey -algorithm RSA -out apps/auth-server/certs/jwt-private.pem -pkeyopt rsa_keygen_bits:2048
penssl rsa -pubout -in apps/auth-server/certs/jwt-private.pem -out apps/auth-server/certs/jwt-public.pem
```

Setup the database:

```
cp apps/auth-server/db.sample.json apps/auth-server/db.json
```

Run the services:

```
pnpm run dev
```

Navigate to http://localhost:3000
