# Ultimate Authentication using GraphQL_NEXUS 

This example shows how to implement authentication using a **Nexus prisma v2 with typescript**

## Features
~~~
1. Signup User
2. Account Activation
3. Login User
4. Password Reset
5. Facebook Login
6. Google Login
7. Admin Role (Deleting Users, Get All Users)
8. Get Current User
9. Update User
~~~

## Install Packages
```
yarn install
```

## Set the environmental variables
Set .env for deployment

## Create database schema for both deployment and testing
```
yarn dev
```

## Start the postgres and prisma service
You have docker install to run it.

```
sudo docker-compose up -d
```

## Run test cases 
```
yarn dev-test
```

## Start the development server 
```
yarn dev
```