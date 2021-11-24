<br />
<p align="center">
  <a href="/">
    <img src="https://github.com/cybalencar96/mywallet-front/blob/main/public/empty-wallet.png?raw=true" alt="Logo" width="200px" height="auto">
  </a>

<h3 align="center">My Wallet</h3>

  <p align="center">
    💸 A useful app if you have money to manage 💸
    <br />
    <a href="https://github.com/cybalencar96/mywallet-back"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://mywallet-front-five.vercel.app/">View Demo</a>
    <br />
  </p>
</p>

#

### **About the project**

<br />
<p align="center">
<img src="https://github.com/cybalencar96/mywallet-front/blob/main/public/gif1.gif?raw=true" width="300px">
<p>

An animated gif to introduce you to this simple, but very pleasant full-stack project I manage to accomplish!

<br />

### **Built with**

- [React JS](https://reactjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node JS](https://nodejs.org/en/)

 <br />

## **Getting Started**

- Want to simply try it? Access demo by [clicking here](https://mywallet-front-five.vercel.app/)!

- Want to run frontend in local environment whitout backend local? Learn how on README in frontend repository by [clicking here](https://github.com/cybalencar96/mywallet-front)!

- Want to run front and backend local? Keep reading then!
  
  <br />

### **Prerequisites**

- npm

<br />

### **Installation**

1.  Clone backend repo

```sh
git clone https://github.com/cybalencar96/mywallet-back.git
```

2. Install dependencies executing comand in root

```sh
npm i
```

3. Clone frontend repo **in a different folder**

```sh
git clone https://github.com/cybalencar96/mywallet-front.git
```

4. Install frontend dependencies executing command in root

```sh
npm i
```

5. Create a .env.development in frontend root folder with the variable below
```sh
REACT_APP_SERVER_URL=http://localhost:4000
```

6. Create a .env.dev file in backend root folder with following variables 
```sh
DB_USER
DB_HOST
DB_PASS
DB_PORT
DB_NAME
```

7. Create a postgres database and fill .env.dev with database credentials
```sh
DB_USER=postgres
DB_HOST=localhost
DB_PASS=123456
DB_PORT=5432
DB_NAME=mywallet
```

8. Run (copy & paste) the dump.sql statements in database
   <br />
   <br />

### **How to run**

1. Start backend server

```sh
npm run dev
```

2. Start frontend

```sh
npm start
```
