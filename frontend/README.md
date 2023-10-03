# PeerPrep Frontend

This is currently running on `http://localhost:3000`

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

After cloning, cd into `frontend`.

```
npm install
npm run dev
```

## Usage

Current features involve CRUD operations for questions connected to MongoDB atlas server, logging in and out using Google OAuth.

## Developer Notes

This project uses Next.js app router.

Next.js Route Handlers is used only for NextAuth.

Traditional API routing is used and divided into the type of service under `src/api/<serviceName>Service.js`

Tailwind CSS is used.

Remember to modify `.env` to add config for running in production environment, currently everything is for development environment.
