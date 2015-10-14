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

CREATE TABLE INVITES
(
	sid int references USERINFO(id),
	rid int references USERINFO(id)
);

CREATE TABLE FRIENDS
(
	fid int references USERINFO(id),
	fid2 int references USERINFO(id)
);