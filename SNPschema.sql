CREATE DATABASE SNP;

CREATE TABLE USERINFO
(
	id SERIAL PRIMARY KEY,
	uname varchar(50),
	password varchar(150),
	dateCreated varchar(100)
);

CREATE TABLE PKEYS
(
	id int references USERINFO(id),
	key varchar(150)
);

CREATE TABLE SESSIONS
(
	id int references USERINFO(id),
	session varchar(150)
);