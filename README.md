# repos-chaincode

This is a graduation project with the topic of building an application that integrates the blockchain platform to store data.
Composer: SinJunior(KhacTuan1506)

## Environment requirement

OS: Linux (Ubuntu 18.04)

Docker version 18.03 or later.

Docker Composer.

NodeJS version 12.22.8 and npm v6.14.15.

## How to build network

Firstly, you need clone this source into your Linux local.

```bash
git clone https://github.com/SinJunior/repos-chaincode.git
```

And then, create a new folder same level with source code folder. Copy bash file **startnetwork.sh** into new folder and run script.

```bash
sudo ./startnetwork.sh
```

Waiting to the blockchain network up.

## How to run web application

Let into folder: ./vars/app/app-node and run below script to install node package:

```bash
npm install
```

To run app, using script:

```bash
npm start
```
