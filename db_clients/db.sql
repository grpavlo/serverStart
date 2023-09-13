drop table all_clients;
drop table all_name_system;

create TABLE admins(
    id SERIAL PRIMARY KEY,
    login  VARCHAR(255) UNIQUE,
    password  VARCHAR(255),
);

create TABLE contact(
    id SERIAL PRIMARY KEY,
    pib  VARCHAR(255),
    tel  VARCHAR(255),
    email  VARCHAR(255),
    question VARCHAR(255),
    data VARCHAR(255),
    done boolean,
);

create TABLE contactInfo(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255),
    text1 VARCHAR(255),
    text2 VARCHAR(255),
    text3 VARCHAR(255),
    text4 VARCHAR(255),
    text5 VARCHAR(255),
    text6 VARCHAR(255),
    text7 VARCHAR(255),
    text8 VARCHAR(255),
    text9 VARCHAR(255)
);
create TABLE book(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255),
    text1 VARCHAR(255),
    text2 VARCHAR(255),
    text3 VARCHAR(255),
    text4 VARCHAR(255)
);

create TABLE carousel(
    id SERIAL PRIMARY KEY,
    namePhoto  VARCHAR(255),
    title  VARCHAR(255),
    subTitle  VARCHAR(255),
    mainText VARCHAR(255),
    url VARCHAR(255)
    Activated boolean,
);
create TABLE partner(
    id SERIAL PRIMARY KEY,
    namePhoto  VARCHAR(255),
    url VARCHAR(255),
    Activated boolean
);
create TABLE video(
    id SERIAL PRIMARY KEY,
    namePhoto  VARCHAR(255),
    url VARCHAR(255),
    Activated boolean
);
create TABLE calendar(
    id SERIAL PRIMARY KEY,
    namePhoto  VARCHAR(255),
    Activated boolean
);

create TABLE response(
    id SERIAL PRIMARY KEY,
    pib  VARCHAR(255),
    name  VARCHAR(255),
    response  VARCHAR(10000000),
    data  VARCHAR(255),
    Activated boolean
);

create TABLE service(
    id SERIAL PRIMARY KEY,
    namePhoto  VARCHAR(255),
    text VARCHAR(10000000),
    url VARCHAR(10000000),
    Activated boolean
);


create TABLE bookBy(
    id SERIAL PRIMARY KEY,
    pib VARCHAR(1000),
    tel VARCHAR(1000),
    count VARCHAR(1000),
    city VARCHAR(1000),
    email VARCHAR(1000),
    name VARCHAR(1000),
    cod VARCHAR(1000),
    promoCod VARCHAR(1000),
    data VARCHAR(255),
    done boolean
);
create TABLE webinarBy(
    id SERIAL PRIMARY KEY,
    pib VARCHAR(1000),
    tel VARCHAR(1000),
    city VARCHAR(1000),
    email VARCHAR(1000),
    name VARCHAR(1000),
    promoCod VARCHAR(1000),
    position VARCHAR(1000),
    question VARCHAR(1000),
    online boolean,
    offline boolean,
    data VARCHAR(255),
    done boolean,
    url VARCHAR(1000)
);

create TABLE webinarOldBy(
    id SERIAL PRIMARY KEY,
    pib VARCHAR(1000),
    tel VARCHAR(1000),
    city VARCHAR(1000),
    email VARCHAR(1000),
    name VARCHAR(1000),
    promoCod VARCHAR(1000),
    position VARCHAR(1000),
    question VARCHAR(1000),
    submit VARCHAR(1000),
    data VARCHAR(255),
    done boolean,
    url VARCHAR(1000)
);

create TABLE application(
    id SERIAL PRIMARY KEY,
    pib VARCHAR(1000),
    tel VARCHAR(1000),
    email VARCHAR(1000),
    name VARCHAR(1000),
    position VARCHAR(1000),
    question VARCHAR(1000),
    promoCod VARCHAR(1000),
    data VARCHAR(255),
    done boolean,
    url VARCHAR(1000)
);

create TABLE webinar(
    id SERIAL PRIMARY KEY,
    namePhoto VARCHAR(1000),
    title VARCHAR(1000),
    url VARCHAR(1000),
    activated boolean
);

create TABLE articles(
    id SERIAL PRIMARY KEY,
    namePhoto VARCHAR(1000),
    title VARCHAR(1000),
    point VARCHAR(10000000),
    activated boolean
);

create TABLE articlesId(
    id SERIAL PRIMARY KEY,
    namePhoto VARCHAR(1000),
    title VARCHAR(1000),
    subtitle VARCHAR(1000),
    titlePhoto VARCHAR(1000),
    subtitlePhoto VARCHAR(1000),
    point VARCHAR(10000000),
    url VARCHAR(10000000)
);

create TABLE oldallwebinar(
    id SERIAL PRIMARY KEY,
    namePhoto VARCHAR(1000),
    nameEvent VARCHAR(1000),
    title VARCHAR(1000),
    lecturer VARCHAR(1000),
    url VARCHAR(1000),
    activated boolean
);

create TABLE webinars(
    id SERIAL PRIMARY KEY,
    namePhoto VARCHAR(1000),
    title VARCHAR(1000),
    points1 VARCHAR(1000),
    points2 VARCHAR(1000),
    points3 VARCHAR(1000),
    points4 VARCHAR(1000),
    lecturerAndText VARCHAR(1000),
    urlToOldBy VARCHAR(1000),
    data VARCHAR(11),
    time VARCHAR(255),
    price VARCHAR(255),
    location VARCHAR(255),
    pointsText VARCHAR(10000000),
    lecturers VARCHAR(10000000),
    program VARCHAR(10000000),
    urlRegister VARCHAR(1000),
    oldOrNow boolean,
    activated boolean
);
create TABLE values(
    id SERIAL PRIMARY KEY,
    namePhoto VARCHAR(10000000),
    title VARCHAR(10000000),
    subTitle VARCHAR(10000000),
    titleBlock1 VARCHAR(10000000),
    textBlock1 VARCHAR(10000000),
    textBlock2Bold VARCHAR(10000000),
    textBlock2 VARCHAR(10000000),
    titlePoint VARCHAR(10000000),
    subtitlePoint VARCHAR(10000000),
    point1 VARCHAR(10000000),
    point2 VARCHAR(10000000),
    point3 VARCHAR(10000000),
    point4 VARCHAR(10000000),
    point5 VARCHAR(10000000),
    point6 VARCHAR(10000000),
    point7 VARCHAR(1000),
    point8 VARCHAR(10000000),
    textBlock3 VARCHAR(10000000),
    credo VARCHAR(10000000),
    titleBlock3 VARCHAR(10000000)
);

create TABLE clients(
    id SERIAL PRIMARY KEY,
    namePhoto VARCHAR(10000000),
    title VARCHAR(10000000),
    subTitle VARCHAR(10000000),
    titleBlock1 VARCHAR(10000000),
    textBlock1 VARCHAR(10000000),
    textBlock2Bold VARCHAR(10000000),
    textBlock2 VARCHAR(10000000),
    titlePoint VARCHAR(10000000),
    subtitlePoint VARCHAR(10000000),
    point1 VARCHAR(10000000),
    point2 VARCHAR(10000000),
    point3 VARCHAR(10000000),
    point4 VARCHAR(10000000),
    point5 VARCHAR(10000000),
    point6 VARCHAR(10000000),
    point7 VARCHAR(1000),
    point8 VARCHAR(10000000),
    blockTitle1 VARCHAR(10000000),
    blockText1 VARCHAR(10000000),
    blockTitle2 VARCHAR(10000000),
    blockText2 VARCHAR(10000000),
    blockTitle3 VARCHAR(10000000),
    blockText3 VARCHAR(10000000),
    blockTitle4 VARCHAR(10000000),
    blockText4 VARCHAR(10000000),
    blockTitle5 VARCHAR(10000000),
    blockText5 VARCHAR(10000000),
    blockTitle6 VARCHAR(10000000),
    blockText6 VARCHAR(10000000),
    credo VARCHAR(10000000),
);

CREATE TABLE collective (
    id SERIAL PRIMARY KEY,
    title VARCHAR(10000000),
    titlePoint VARCHAR(10000000),
    point1 VARCHAR(10000000),
    point2 VARCHAR(10000000),
    point3 VARCHAR(10000000),
    namePhoto VARCHAR(10000000),
    textBlock2 VARCHAR(10000000),
    titleBlock3 VARCHAR(10000000),
    namePhoto1 VARCHAR(10000000),
    pib1 VARCHAR(10000000),
    position1 VARCHAR(10000000),
    text1 VARCHAR(10000000),
    namePhoto2 VARCHAR(10000000),
    pib2 VARCHAR(10000000),
    position2 VARCHAR(10000000),
    text2 VARCHAR(10000000),
    namePhoto3 VARCHAR(10000000),
    pib3 VARCHAR(10000000),
    position3 VARCHAR(10000000),
    text3 VARCHAR(10000000),
    namePhoto4 VARCHAR(10000000),
    pib4 VARCHAR(10000000),
    position4 VARCHAR(10000000),
    text4 VARCHAR(10000000),
    titleBlock4 VARCHAR(10000000),
    titleBlock5 VARCHAR(10000000),
    namePhoto5 VARCHAR(10000000),
    pib5 VARCHAR(10000000),
    position5 VARCHAR(10000000),
    text5 VARCHAR(10000000),
    namePhoto6 VARCHAR(10000000),
    pib6 VARCHAR(10000000),
    position6 VARCHAR(10000000),
    text6 VARCHAR(10000000),
    titleBlock6 VARCHAR(10000000),
    namePhoto7 VARCHAR(10000000),
    pib7 VARCHAR(10000000),
    position7 VARCHAR(10000000),
    text7 VARCHAR(10000000),
    namePhoto8 VARCHAR(10000000),
    pib8 VARCHAR(10000000),
    position8 VARCHAR(10000000),
    text8 VARCHAR(10000000)
);

CREATE TABLE head (
    id SERIAL PRIMARY KEY,
    namePhoto VARCHAR(10000000),
    subTitle VARCHAR(10000000),
    title VARCHAR(10000000),
    subtitlePoint VARCHAR(10000000),
    point1 VARCHAR(10000000),
    point2 VARCHAR(10000000),
    point3 VARCHAR(10000000),
    point4 VARCHAR(10000000),
    point5 VARCHAR(10000000),
    point6 VARCHAR(10000000),
    point7 VARCHAR(10000000),
    point8 VARCHAR(10000000),
    point9 VARCHAR(10000000),
    point10 VARCHAR(10000000),
    point11 VARCHAR(10000000),
    titleBlock1 VARCHAR(10000000),
    textBlock1 VARCHAR(10000000),
    textBlock12 VARCHAR(10000000),
    textBlock13 VARCHAR(10000000),
    textBlock14 VARCHAR(10000000),
    textBlock15 VARCHAR(10000000),
    textBlock15D VARCHAR(10000000),
    textBlock16 VARCHAR(10000000),
    textBlock16D VARCHAR(10000000),
    textBlock17 VARCHAR(10000000),
    textBlock17D VARCHAR(10000000),
    textBlock18 VARCHAR(10000000),
    textBlock19 VARCHAR(10000000),
    textBlock110 VARCHAR(10000000),
    titleBlock2 VARCHAR(10000000),
    textBlock2 VARCHAR(10000000),
    placeholder1 VARCHAR(10000000),
    placeholder2 VARCHAR(10000000),
    placeholder3 VARCHAR(10000000),
    placeholder4 VARCHAR(10000000),
    placeholder5 VARCHAR(10000000),
    placeholder6 VARCHAR(10000000),
    titleBlock3 VARCHAR(10000000),
    textBlock3 VARCHAR(10000000),
    textBlock32 VARCHAR(10000000),
    placeholder7 VARCHAR(10000000),
    placeholder8 VARCHAR(10000000),
    credo VARCHAR(10000000)
);

create TABLE serviceNew(
    id SERIAL PRIMARY KEY,
    title VARCHAR(1000),
    subTitle VARCHAR(1000),
    pointAll VARCHAR(10000000),
    title1 VARCHAR(1000),
    text1 VARCHAR(1000),
    text2 VARCHAR(1000),
    text3 VARCHAR(1000),
    text4 VARCHAR(11),
    text5 VARCHAR(255),
    text6 VARCHAR(255),
    text VARCHAR(255),
    tobeornottobe boolean,
    url VARCHAR(255),
    activated boolean
);


let namePhotoArticles
const randomNumber = generateRandomNumber(100, 10000);
id = Number(id) + Number(randomNumber)
namePhotoArticles = id+ path.extname(file.originalname)

TRUNCATE all_clients;
ALTER TABLE  ADD ;
drop table all_clients;
drop table all_name_system;
