const dbClients = require('../db_clients/db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require("path");
const multer = require("multer");
const nodemailer = require('nodemailer');
const fs = require('fs');
const fsextra = require('fs-extra');
const {rows} = require("pg/lib/defaults");

const encryptionKey = 'myencryptionkey';

const emailAdminStart = "paha__gr@ukr.net"

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



const signIn = async (body) => {

    return new Promise(async function (resolve, reject) {
        const { login, password } = body;

        // Ключ для шифрования и дешифрования (в реальных сценариях необходимо обеспечить безопасное хранение ключа)
        /*
        // Функция для кодирования пароля
            function encryptPassword(password) {
                const cipher = crypto.createCipher('aes-256-ctr', encryptionKey);
                let encryptedPassword = cipher.update(password, 'utf-8', 'hex');
                encryptedPassword += ci pher.final('hex');
                return encryptedPassword;
            }

            const originalPassword = 'mysecretpassword';
            // Кодирование пароля
            const encryptedPassword = encryptPassword(originalPassword);
            console.log('Encrypted Password:', encryptedPassword);


         */


        await  dbClients.query(`SELECT EXISTS (SELECT * FROM admins WHERE login = '${login}')`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            }else {
                if (results.rows[0].exists) {
                    await  dbClients.query(`SELECT * FROM admins WHERE login = '${login}'`, async (error, results) => {
                        if(error){
                            reject(error)
                            console.log(error)
                            resolve("error")
                        }else {

                            // Функция для декодирования пароля
                            function decryptPassword(encryptedPassword) {
                                const decipher = crypto.createCipher('aes-256-ctr', encryptionKey);
                                let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf-8');
                                decryptedPassword += decipher.final('utf-8');
                                return decryptedPassword;
                            }
                            // Декодирование пароля
                            const decryptedPassword = decryptPassword(results.rows[0].password);
                            console.log('Decrypted Password:', decryptedPassword);

                            if(decryptedPassword===password){
                                const token = jwt.sign({ login }, encryptionKey);
                                resolve({token})
                            }else{
                                resolve("Невірнй пароль")
                            }
                        }
                    })
                }else  if (!results.rows[0].exists) {
                    resolve("Невірний номер телефону")
                }
            }
        })
    })

};

const testToken = async (body) => {

    return new Promise(async function (resolve, reject) {
        const { token} = body;

        console.log(token)
        jwt.verify(token, encryptionKey, (err, decoded) => {
            if (err) {
                resolve('Error' );
            } else {
                resolve('Good' );
            }
        });
    })

};


let namePhotoArticlesCarousel

const uploadDirectory = path.join(__dirname, '../../frontend/public/carousel');
const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, cb) => {
        dbClients.query(`SELECT MAX(id) FROM carousel;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const randomNumber = generateRandomNumber(100, 10000);

                id = Number(id) + Number(randomNumber)
                namePhotoArticlesCarousel = id+ path.extname(file.originalname)

                cb(null, namePhotoArticlesCarousel);
            }
        })

    }
});

const upload = multer({ storage: storage });

const uploadPhotoCarousel = (req) => {
    return new Promise((resolve, reject) => {


        upload.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newCarousel = (body)=>{
    return new Promise((resolve, reject) => {
        const {namePhoto,title,subTitle,text,url,value} = body;
        dbClients.query(`SELECT MAX(id) FROM carousel;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                await dbClients.query(`INSERT INTO carousel (namePhoto,title,subTitle,mainText,url,Activated) VALUES ($1, $2,$3,$4,$5,true) RETURNING *`, [namePhotoArticlesCarousel,title,subTitle,text,url] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })

    })
}

function dateNow(){
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;
}

const clientContact = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {pib, tel, email, question} = body;

        const data =  dateNow();

        await dbClients.query(`INSERT INTO contact (pib, tel, email, question,data,done) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *`, [pib, tel, email, question,data,false] , (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {

                const transporter = nodemailer.createTransport({
                    host: 'mail.adm.tools',
                    port: 465 ,
                    secure: true,
                    auth: {
                        user: 'start@bagroup.pro',
                        pass: '8S6ExmU6r5'
                    }
                });

                const mailOptions = {
                    from: "start@bagroup.pro",
                    to: "paha__gr@ukr.net",
                    subject: "Клієнт хоче зв'язатися",
                    html: `
                    <html>
                    <head>
                    <style>
                    #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: 100%;
                    }
                    
                    #customers td, #customers th {
                      border: 1px solid #ddd;
                      padding: 8px;
                    }
                    
                    #customers tr:nth-child(even){background-color: #f2f2f2;}
                    
                    #customers tr:hover {background-color: #ddd;}
                    
                    #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: left;
                      background-color: #04AA6D;
                      color: white;
                    }
                    </style>
                    </head>
                    <body>
                    <table id="customers">
                      <tr>
                        <th>ПІБ</th>
                        <th>Телефон</th>
                        <th>email</th>
                        <th>Питання</th>
                        <th>Дата</th>
                      </tr>
                      <tr>
                        <td>` + pib + `</td>
                        <td>` + tel + `</td>
                        <td>` + email + `</td>
                        <td>` + question + `</td>
                        <td>` + data + `</td>
                      </tr>
                    </table>
                    
                    </body>
                    </html>`};

                transporter.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }
                });
                resolve('good');
            }
        })
    })
}

const getClientContact = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM contact`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const doneClientContact = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE contact SET  done = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const deleteClientContact = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body;
        await  dbClients.query(`DELETE FROM contact WHERE id = $1`,[id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getCarousel = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM carousel`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const doneCarousel = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE carousel SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const deleteCarousel = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectory+"/"+name;

        fs.unlink(filePath, async (err) => {
            if (!err) {
                await dbClients.query(`DELETE FROM carousel WHERE id = $1`, [id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    })
}

const updateCarousel = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id, namePhoto, title, subTitle, text, url, newPhoto,oldPhoto} = body;

        dbClients.query(`SELECT MAX(id) FROM carousel;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(newPhoto){
                    const filePath = uploadDirectory+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }


                await  dbClients.query(`UPDATE carousel SET namePhoto = $1, title = $2, subTitle = $3, mainText = $4, url = $5 where id=$6`,[namePhotoArticlesCarousel, title, subTitle, text, url,id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })


            }
        })

    })
}

let namePhotoPartner

const uploadDirectoryPartner = path.join(__dirname, '../../frontend/public/Partner');
const storagePartner = multer.diskStorage({
    destination: uploadDirectoryPartner,
    filename: (req, file, cb) => {
        dbClients.query(`SELECT MAX(id) FROM partner;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }
                const randomNumber = generateRandomNumber(100, 10000);
                id = Number(id) + Number(randomNumber)
                namePhotoPartner = id+ path.extname(file.originalname)
                cb(null, namePhotoPartner)
            }
        })
    }
});

const uploadPartnerMulter = multer({ storage: storagePartner });

const uploadPartner = (req) => {
    return new Promise((resolve, reject) => {


        uploadPartnerMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newPartner = (body)=>{
    return new Promise((resolve, reject) => {
        const {namePhoto,url} = body;
        dbClients.query(`SELECT MAX(id) FROM partner;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                await dbClients.query(`INSERT INTO partner (namePhoto,url,Activated) VALUES ($1, $2,true) RETURNING *`, [namePhotoPartner,url] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const donePartner = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE partner SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getPartner = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM partner`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deletePartner = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectoryPartner+"/"+name;

        fs.unlink(filePath, async (err) => {
            if (!err) {
                await dbClients.query(`DELETE FROM partner WHERE id = $1`, [id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    })
}

const updatePartner = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id, namePhoto, url, newPhoto,oldPhoto} = body;

        dbClients.query(`SELECT MAX(id) FROM partner;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(newPhoto){
                    const filePath = uploadDirectoryPartner+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }


                await  dbClients.query(`UPDATE partner SET namePhoto = $1, url = $2 where id=$3`,[namePhotoPartner, url,id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })


            }
        })

    })
}

const saveContactInfo = (body)=>{
    return new Promise((resolve, reject) => {
        const {text,text1,text2,text3,text4,text5,text6,text7,text8,text9} = body;
        dbClients.query(`SELECT * FROM contactInfo;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(results.rows.length === 0){
                    await dbClients.query(`INSERT INTO contactInfo (text,text1,text2,text3,text4,text5,text6,text7,text8,text9) VALUES ($1, $2,$3,$4,$5, $6,$7,$8,$9,$10) RETURNING *`, [text,text1,text2,text3,text4,text5,text6,text7,text8,text9] , (error, results) => {
                        if (error) {
                            reject(error)
                            console.log(error)
                            resolve("error")
                        } else {
                            resolve("ok")
                        }
                    })
                }else {
                    await  dbClients.query(`UPDATE contactInfo SET text=$1,text1=$2,text2=$3,text3=$4,text4=$5,text5=$6,text6=$7,text7=$8,text8=$9,text9=$10 where id=$11`,[text,text1,text2,text3,text4,text5,text6,text7,text8,text9,results.rows[0].id], async (error, results) => {
                        if (error) {
                            reject(error)
                            console.log(error)
                            resolve("error")
                        } else {
                            resolve('ok');
                        }
                    })
                }
            }
        })
    })
}

const getClientContactInfo = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM contactInfo`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                if(results.rows.length === 0){
                    resolve({})
                }else {
                    resolve(results.rows[0]);
                }
            }
        })
    })
}

const saveBook = (body)=>{
    return new Promise((resolve, reject) => {
        const {text,text1,text2,text3,text4} = body;
        dbClients.query(`SELECT * FROM book;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(results.rows.length === 0){
                    await dbClients.query(`INSERT INTO book (text,text1,text2,text3,text4) VALUES ($1, $2,$3,$4,$5) RETURNING *`, [text,text1,text2,text3,text4] , (error, results) => {
                        if (error) {
                            reject(error)
                            console.log(error)
                            resolve("error")
                        } else {
                            resolve("ok")
                        }
                    })
                }else {
                    await  dbClients.query(`UPDATE book SET text=$1,text1=$2,text2=$3,text3=$4,text4=$5 where id=$6`,[text,text1,text2,text3,text4,results.rows[0].id], async (error, results) => {
                        if (error) {
                            reject(error)
                            console.log(error)
                            resolve("error")
                        } else {
                            resolve('ok');
                        }
                    })
                }
            }
        })
    })
}

const getBook = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM book`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                if(results.rows.length === 0){
                    resolve({})
                }else {
                    resolve(results.rows[0]);
                }
            }
        })
    })
}

const byBook = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {pib,tel,count,city,email,name,cod,promoCod} = body;

        const data =  dateNow();

        await dbClients.query(`INSERT INTO bookBy (pib,tel,count,city,email,name,cod,promoCod,data,done) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [pib,tel,count,city,email,name,cod,promoCod,data,false] , (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {

                const transporter = nodemailer.createTransport({
                    host: 'mail.adm.tools',
                    port: 465 ,
                    secure: true,
                    auth: {
                        user: 'start@bagroup.pro',
                        pass: '8S6ExmU6r5'
                    }
                });

                const mailOptions = {
                    from: "start@bagroup.pro",
                    to: emailAdminStart,
                    subject: "Нове замовлення книги",
                    html: `
                    <html>
                    <head>
                    <style>
                    #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: 100%;
                    }
                    
                    #customers td, #customers th {
                      border: 1px solid #ddd;
                      padding: 8px;
                    }
                    
                    #customers tr:nth-child(even){background-color: #f2f2f2;}
                    
                    #customers tr:hover {background-color: #ddd;}
                    
                    #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: left;
                      background-color: #04AA6D;
                      color: white;
                    }
                    </style>
                    </head>
                    <body>
                    <table id="customers">
                      <tr>
                        <th>ПІБ</th>
                        <th>Телефон</th>
                        <th>Кількість</th>
                        <th>Місто,№</th>
                        <th>email</th>    
                        <th>Підприємство</th>
                        <th>ЄДРПОУ</th>
                        <th>Промокод</th>
                        <th>Дата</th>
                      </tr>
                      <tr>
                        <td>` + pib + `</td>
                        <td>` + tel + `</td>
                        <td>` + count + `</td>
                        <td>` + city + `</td>
                        <td>` + email + `</td>
                        <td>` + name + `</td>
                        <td>` + cod + `</td>
                        <td>` + promoCod + `</td>
                        <td>` + data + `</td>
                      </tr>
                    </table>
                    
                    </body>
                    </html>`};

                transporter.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }
                });
                resolve('good');
            }
        })
    })
}

const getByBook = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM bookBy`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deleteBookBy = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body;
        await  dbClients.query(`DELETE FROM bookBy WHERE id = $1`,[id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const doneByBook = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE bookBy SET  done = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

let namePhotoWebinar

const uploadDirectoryWebinar = path.join(__dirname, '../../frontend/public/Webinar');
const storageWebinar = multer.diskStorage({
    destination: uploadDirectoryWebinar,
    filename: (req, file, cb) => {
        dbClients.query(`SELECT MAX(id) FROM webinar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                console.log(file)
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }
                const randomNumber = generateRandomNumber(100, 10000);
                id = Number(id) + Number(randomNumber)
                namePhotoWebinar = id+ path.extname(file.originalname)

                cb(null, namePhotoWebinar);
            }
        })
    }
});

const uploadWebinarMulter = multer({ storage: storageWebinar });

const uploadWebinar = (req) => {
    return new Promise((resolve, reject) => {
        uploadWebinarMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newWebinar = (body)=>{
    return new Promise((resolve, reject) => {
        const {namePhoto,title,url} = body;
        dbClients.query(`SELECT MAX(id) FROM webinar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                await dbClients.query(`INSERT INTO webinar (namePhoto,title,url,activated) VALUES ($1, $2,$3,true) RETURNING *`, [namePhotoWebinar,title,url] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const doneWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE webinar SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getWebinar = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM webinar`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deleteWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectoryWebinar+"/"+name;

        fs.unlink(filePath, async (err) => {
            if (!err) {
                await dbClients.query(`DELETE FROM webinar WHERE id = $1`, [id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    })
}

const updateWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id, namePhoto,title, url, newPhoto,oldPhoto} = body;

        dbClients.query(`SELECT MAX(id) FROM webinar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(newPhoto){
                    const filePath = uploadDirectoryWebinar+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }


                await  dbClients.query(`UPDATE webinar SET namePhoto = $1,title= $2, url = $3 where id=$4`,[namePhotoWebinar,title, url,id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })


            }
        })

    })
}

let namePhotoOldAllWebinar

const uploadDirectoryOldAllWebinar = path.join(__dirname, '../../frontend/public/OldAllWebinar');
const storageOldAllWebinar = multer.diskStorage({
    destination: uploadDirectoryOldAllWebinar,
    filename: (req, file, cb) => {
        dbClients.query(`SELECT MAX(id) FROM oldallwebinar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }
                const randomNumber = generateRandomNumber(100, 10000);
                id = Number(id) + Number(randomNumber)
                namePhotoOldAllWebinar = id+ path.extname(file.originalname)

                cb(null, namePhotoOldAllWebinar);
            }
        })
    }
});

const uploadOldAllWebinarMulter = multer({ storage: storageOldAllWebinar });

const uploadOldAllWebinar = (req) => {
    return new Promise((resolve, reject) => {
        uploadOldAllWebinarMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newOldAllWebinar = (body)=>{
    return new Promise((resolve, reject) => {
        const {namePhoto,nameEvent,title,lecturer,url} = body;
        dbClients.query(`SELECT MAX(id) FROM oldallwebinar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                await dbClients.query(`INSERT INTO oldallwebinar (namePhoto,nameEvent,title,lecturer,url,activated) VALUES ($1, $2,$3,$4,$5,true) RETURNING *`, [namePhotoOldAllWebinar,nameEvent,title,lecturer,url] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const doneOldAllWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE oldallwebinar SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getOldAllWebinar = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM oldallwebinar`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deleteOldAllWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectoryOldAllWebinar+"/"+name;

        fs.unlink(filePath, async (err) => {
            await dbClients.query(`DELETE FROM oldallwebinar WHERE id = $1`, [id], async (error, results) => {
                if (error) {
                    reject(error)
                    console.log(error)
                    resolve("error")
                } else {
                    resolve('ok');
                }
            })
        })
    })
}

const updateOldAllWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id, namePhoto,nameEvent ,title, lecturer, url, newPhoto,oldPhoto} = body;

        dbClients.query(`SELECT MAX(id) FROM oldallwebinar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(newPhoto){
                    const filePath = uploadDirectoryOldAllWebinar+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }


                await  dbClients.query(`UPDATE oldallwebinar SET namePhoto = $1,nameEvent = $2 ,title= $3,lecturer=$4, url = $5 where id=$6`,[namePhotoOldAllWebinar,nameEvent ,title, lecturer, url,id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })


            }
        })

    })
}

let uploadDirectoryNewWebinar = path.join(__dirname, '../../frontend/public/OneWebinar/');

const storageNewWebinar = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            if(req.query.id === "0"){
                dbClients.query('SELECT MAX(id) FROM webinars;', async (error, results) => {
                    if (error) {
                        console.log(error);
                        return cb(error, null);
                    } else {
                        let id = results.rows[0].max+1 || 1;

                        const uploadDirectory = path.join(uploadDirectoryNewWebinar, id.toString());

                        if (!fs.existsSync(uploadDirectory)) {
                            fs.mkdirSync(uploadDirectory, { recursive: true });
                        }
                        cb(null, uploadDirectory);
                    }
                });
            }else {
                let id = req.query.id;

                const uploadDirectory = path.join(uploadDirectoryNewWebinar, id.toString());

                if (!fs.existsSync(uploadDirectory)) {
                    fs.mkdirSync(uploadDirectory, { recursive: true });
                }
                cb(null, uploadDirectory);
            }

        },
        filename: (req, file, cb) => {
            console.log(req.query.id)
            const namePhoto = req.query.name || 'defaultName';
            cb(null, namePhoto + path.extname(file.originalname));
        }
    }
);

const uploadNewWebinarMulter = multer({ storage: storageNewWebinar });

const uploadNewWebinar = (req) => {
    return new Promise((resolve, reject) => {
        uploadNewWebinarMulter.single('file')(req, null, (err) => {
            if (err) {
                console.log(err)
                return reject(err);
            }else{
                console.log(req.query.name)

                resolve('File uploaded successfully');
            }
        });

    });
};

const newNewWebinar = (body)=>{
    return new Promise((resolve, reject) => {
        const {namePhoto,nameEvent,point1,point2,point3,point4,lecturer,data,time,price,location,pointsTextDB,lecturers,text,pib,tel,city,email,name,edrpo,hb,promoCod,position,question} = body;
        dbClients.query(`SELECT MAX(id) FROM webinars;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max+1 || 1;

                let arrNew = []

                for(let i = 0;i<lecturers.length;i++){
                    arrNew = arrNew.concat({
                        lecturersPhoto:String(i+2+path.extname(lecturers[i]['lecturersPhoto'])),
                        lecturersName:String(lecturers[i]["lecturersName"]),
                        lecturersText:String(lecturers[i]["lecturersText"])
                    })
                }
                arrNew = JSON.stringify(arrNew)

                await dbClients.query(`INSERT INTO webinars (namePhoto,title,points1,points2,points3,points4,lecturerAndText,data,time,price,location,pointsText,lecturers,program,activated,oldOrNow,urlToOldBy,pib,tel,city,email,name,edrpo,hb,promoCod,position,question) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,true,true,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25) RETURNING *`, [1+path.extname(namePhoto),nameEvent,point1,point2,point3,point4,lecturer,data,time,price,location,pointsTextDB,arrNew,text,'/webinar?id='+id.toString(),pib,tel,city,email,name,edrpo,hb,promoCod,position,question] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const getNowWebinar = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM webinars WHERE oldOrNow = TRUE`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const getOldWebinar = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM webinars WHERE oldOrNow = FALSE`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const updateNewWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        let { id,namePhoto,nameEvent,point1,point2,point3,point4,lecturer,data,time,price,location,pointsTextDB,lecturers,text,pib,tel,city,email,nameC,edrpo,hb,promoCod,position,question} = body;

        let arrNew = []

        for(let i = 0;i<lecturers.length;i++){
            arrNew = arrNew.concat({
                lecturersPhoto:String(i+2+path.extname(lecturers[i]['lecturersPhoto'])),
                lecturersName:String(lecturers[i]["lecturersName"]),
                lecturersText:String(lecturers[i]["lecturersText"])
            })
        }
        arrNew = JSON.stringify(arrNew)
        console.log(pib,tel,city,email,nameC,edrpo,hb,promoCod,position,question)

        await  dbClients.query(`UPDATE webinars SET  namePhoto = $1, title = $2, points1 = $3, points2 = $4, points3 = $5, points4 = $6, lecturerAndText = $7, data = $8, time = $9, price = $10, location = $11, pointsText = $12, lecturers = $13, program = $14,pib=$16,tel=$17,city=$18,email=$19,name=$20,edrpo=$21,hb=$22,promoCod=$23,position=$24,question=$25 where id=$15`,[1+path.extname(namePhoto),nameEvent,point1,point2,point3,point4,lecturer,data,time,price,location,pointsTextDB,arrNew,text,id,pib,tel,city,email,nameC,edrpo,hb,promoCod,position,question], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })

    })
}

const doneNewWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE webinars SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const oldOrNowNewWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done,idUrl} = body;
        let url
        if(done){
            url = "/webinar?id="+idUrl+""
        }else {
            url = "/webinarOld?id="+idUrl+""
        }
        await  dbClients.query(`UPDATE webinars SET oldOrNow = $1 , urlToOldBy = $3 where id=$2`,[done,id,url], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const deleteNewWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,idFS} = body;

        const filePath = `${uploadDirectoryNewWebinar}${idFS}`;
        fsextra.removeSync(filePath);

        console.log(filePath)
        await dbClients.query(`DELETE FROM webinars WHERE id = $1`, [id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })

    })
}

const postNowWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body
        const url = "/webinar?id="+id+""
        console.log(url)
        await  dbClients.query(`SELECT * FROM webinars WHERE oldOrNow = TRUE AND activated = TRUE AND urltooldby='${url}'`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                if(results.rows[0] != null){
                    resolve(results.rows[0]);
                }else {
                    resolve([]);
                }
            }
        })
    })
}

const byWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {pib,tel,city,email,name,promoCod,position,question,online,offline,url,edrpo,hb,permission} = body;

        const data =  dateNow();

        await dbClients.query(`INSERT INTO webinarBy (pib,tel,city,email,name,promoCod,position,question,online,offline,data,done,url,edrpo,hb,permission) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`, [pib,tel,city,email,name,promoCod,position,question,online,offline,data,false,url,edrpo,hb,permission] , (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {

                const transporter = nodemailer.createTransport({
                    host: 'mail.adm.tools',
                    port: 465 ,
                    secure: true,
                    auth: {
                        user: 'start@bagroup.pro',
                        pass: '8S6ExmU6r5'
                    }
                });

                const mailOptions = {
                    from: "start@bagroup.pro",
                    to: emailAdminStart,
                    subject: "Реєстрація на вебінар",
                    html: `
                    <html>
                    <head>
                    <style>
                    #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: 100%;
                    }
                    
                    #customers td, #customers th {
                      border: 1px solid #ddd;
                      padding: 8px;
                    }
                    
                    #customers tr:nth-child(even){background-color: #f2f2f2;}
                    
                    #customers tr:hover {background-color: #ddd;}
                    
                    #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: left;
                      background-color: #04AA6D;
                      color: white;
                    }
                    </style>
                    </head>
                    <body>
                    <a href='${url}'>Посилання на вебінар</a>
                    <table id="customers">
                      <tr>
                        <th>ПІБ</th>
                        <th>Телефон</th>
                        <th>Місто,№</th>
                        <th>email</th>    
                        <th>Підприємство</th>
                        <th>Промокод</th>
                        <th>Посада</th>
                        <th>Питання</th>
                        <th>Онлайн чи офлайн</th>
                        <th>Дата</th>
                      </tr>
                      <tr>
                        <td>` + pib + `</td>
                        <td>` + tel + `</td>
                        <td>` + city + `</td>
                        <td>` + email + `</td>
                        <td>` + name + `</td>
                        <td>` + promoCod + `</td>
                        <td>` + position + `</td>
                        <td>` + question + `</td>
                        <td>` + (online ? "Онлайн":"")+" "+(offline ? "Офлайн":"")  + `</td>
                        <td>` + data + `</td>
                      </tr>
                    </table>
                    
                    </body>
                    </html>`};

                transporter.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }
                });
                resolve('good');
            }
        })
    })
}

const postOldWebinar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body
        const url = "/webinarOld?id="+id+""
        console.log(url)
        await  dbClients.query(`SELECT * FROM webinars WHERE oldOrNow = FALSE AND activated = TRUE AND urltooldby='${url}'`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                if(results.rows[0] != null){
                    resolve(results.rows[0]);
                }else {
                    resolve([]);
                }
            }
        })
    })
}

const byWebinarOld = (body)=>{
    return new Promise(async (resolve, reject) => {
        const { pib,tel,city,email,name,promoCod,position,question,value,url} = body;

        const data =  dateNow();

        await dbClients.query(`INSERT INTO webinarOldBy ( pib,tel,city,email,name,promoCod,position,question,submit,data,done,url) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`, [pib,tel,city,email,name,promoCod,position,question,value,data,false,url] , (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {

                const transporter = nodemailer.createTransport({
                    host: 'mail.adm.tools',
                    port: 465 ,
                    secure: true,
                    auth: {
                        user: 'start@bagroup.pro',
                        pass: '8S6ExmU6r5'
                    }
                });

                const mailOptions = {
                    from: "start@bagroup.pro",
                    to: emailAdminStart,
                    subject: "Замовленя вебінару",
                    html: `
                    <html>
                    <head>
                    <style>
                    #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: 100%;
                    }
                    
                    #customers td, #customers th {
                      border: 1px solid #ddd;
                      padding: 8px;
                    }
                    
                    #customers tr:nth-child(even){background-color: #f2f2f2;}
                    
                    #customers tr:hover {background-color: #ddd;}
                    
                    #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: left;
                      background-color: #04AA6D;
                      color: white;
                    }
                    </style>
                    </head>
                    <body>
                    <a href='${url}'>Посилання на вебінар</a>
                    <table id="customers">
                      <tr>
                        <th>ПІБ</th>
                        <th>Телефон</th>
                        <th>Адреса</th>
                        <th>email</th>    
                        <th>Підприємство</th>
                        <th>Промокод</th>
                        <th>Посада</th>
                        <th>Питання</th>
                        <th>Куди</th>
                        <th>Дата</th>
                      </tr>
                      <tr>
                        <td>` + pib + `</td>
                        <td>` + tel + `</td>
                        <td>` + city + `</td>
                        <td>` + email + `</td>
                        <td>` + name + `</td>
                        <td>` + promoCod + `</td>
                        <td>` + position + `</td>
                        <td>` + question + `</td>
                        <td>` + value  + `</td>
                        <td>` + data + `</td>
                      </tr>
                    </table>
                    
                    </body>
                    </html>`};

                transporter.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }
                });
                resolve('good');
            }
        })
    })
}

const getWebinarOldBy = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM webinarOldBy `, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const doneWebinarOldBy = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE webinarOldBy SET  done = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const deleteWebinarOldBy = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body;
        await  dbClients.query(`DELETE FROM webinarOldBy WHERE id = $1`,[id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getWebinarBy = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM webinarBy `, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const doneWebinarBy = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE webinarBy SET  done = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const deleteWebinarByy = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body;
        await  dbClients.query(`DELETE FROM webinarBy WHERE id = $1`,[id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

let namePhotoService

const uploadDirectoryService = path.join(__dirname, '../../frontend/public/Service');
const storageService = multer.diskStorage({
    destination: uploadDirectoryService,
    filename: (req, file, cb) => {
        console.log(file)
        dbClients.query(`SELECT MAX(id) FROM service;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                const randomNumber = generateRandomNumber(100, 10000);
                id = Number(id) + Number(randomNumber)
                namePhotoService = id+ path.extname(file.originalname)


                cb(null, namePhotoService);
            }
        })
    }
});

const uploadServiceMulter = multer({ storage: storageService });

const uploadService = (req) => {
    return new Promise((resolve, reject) => {


        uploadServiceMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newService = (body)=>{
    return new Promise((resolve, reject) => {
        const {namePhoto,text,url} = body;
        dbClients.query(`SELECT MAX(id) FROM service;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                await dbClients.query(`INSERT INTO service (namePhoto,url,Activated,text) VALUES ($1, $2,true,$3) RETURNING *`, [namePhotoService,url,text] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const doneService = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE service SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getService = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM service`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deleteService = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectoryService+"/"+name;

        fs.unlink(filePath, async (err) => {
            if (!err) {
                await dbClients.query(`DELETE FROM service WHERE id = $1`, [id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    })
}

const updateService = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id, namePhoto,text, url, newPhoto,oldPhoto} = body;

        dbClients.query(`SELECT MAX(id) FROM service;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                console.log(text)
                if(newPhoto){
                    const filePath = uploadDirectoryService+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }

                await  dbClients.query(`UPDATE service SET namePhoto = $1, url = $2, text = $4 where id=$3`,[namePhotoService, url,id,text], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })

    })
}

const newApplication = (body)=>{
    return new Promise(async (resolve, reject) => {
        const { pib,tel,email,name,position,question,promoCod,url} = body;

        const data =  dateNow();

        await dbClients.query(`INSERT INTO application (pib,tel,email,name,position,question,promoCod,data,done,url) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [pib,tel,email,name,position,question,promoCod,data,false,url] , (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {

                const transporter = nodemailer.createTransport({
                    host: 'mail.adm.tools',
                    port: 465 ,
                    secure: true,
                    auth: {
                        user: 'start@bagroup.pro',
                        pass: '8S6ExmU6r5'
                    }
                });

                const mailOptions = {
                    from: "start@bagroup.pro",
                    to: emailAdminStart,
                    subject: "Нова заявка на консультацію",
                    html: `
                    <html>
                    <head>
                    <style>
                    #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: 100%;
                    }
                    
                    #customers td, #customers th {
                      border: 1px solid #ddd;
                      padding: 8px;
                    }
                    
                    #customers tr:nth-child(even){background-color: #f2f2f2;}
                    
                    #customers tr:hover {background-color: #ddd;}
                    
                    #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: left;
                      background-color: #04AA6D;
                      color: white;
                    }
                    </style>
                    </head>
                    <body>
                    <a href='${url}'>Посилання на послугу</a>
                    <table id="customers">
                      <tr>
                        <th>ПІБ</th>
                        <th>Телефон</th>
                        <th>email</th>    
                        <th>Підприємство</th>
                        <th>Посада</th>
                        <th>Питання</th>
                        <th>Промокод</th>
                        <th>Дата</th>
                      </tr>
                      <tr>
                        <td>` + pib + `</td>
                        <td>` + tel + `</td>
                        <td>` + email + `</td>
                        <td>` + name + `</td>
                        <td>` + position + `</td>
                        <td>` + question + `</td>
                        <td>` + promoCod + `</td>
                        <td>` + data + `</td>
                      </tr>
                    </table>
                    
                    </body>
                    </html>`};

                transporter.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }
                });
                resolve('good');
            }
        })
    })
}

const getApplication = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM application`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const doneApplication = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE application SET done = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const deleteApplication = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body;

        await dbClients.query(`DELETE FROM application WHERE id = $1`, [id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const newServiceNew = (body)=>{
    return new Promise((resolve, reject) => {
        let {title,subTitle,pointAll,title1,text1,text2,text3,text4,text5,text6,text,value} = body;
        dbClients.query(`SELECT MAX(id) FROM serviceNew;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }
                let url = "/service?id="+id
                pointAll = JSON.stringify(pointAll)
                await dbClients.query(`INSERT INTO servicenew (title,subTitle,pointAll,title1,text1,text2,text3,text4,text5,text6,text,tobeornottobe,url,activated) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,true) RETURNING *`, [title,subTitle,pointAll,title1,text1,text2,text3,text4,text5,text6,text,value,url] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const getServiceNew = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM serviceNew`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const doneServiceNew = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE serviceNew SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const updateServiceNew = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {title,subTitle,pointAll,title1,text1,text2,text3,text4,text5,text6,text,value,id} = body;

        pointAll = JSON.stringify(pointAll)

        await  dbClients.query(`UPDATE serviceNew  SET title = $1, subTitle = $2, pointAll = $3, title1 = $4, text1 = $5, text2 = $6, text3 = $7, text4 = $8, text5 = $9, text6 = $10,text = $11, tobeornottobe = $12
                                WHERE id= $13`,[title,subTitle,pointAll,title1,text1,text2,text3,text4,text5,text6,text,value,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })

    })
}

const deleteServiceNew = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body;

        await dbClients.query(`DELETE FROM serviceNew WHERE id = $1`, [id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const postServiceNew = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body
        const url = "/service?id="+id+""
        await  dbClients.query(`SELECT * FROM serviceNew WHERE activated = TRUE AND url='${url}'`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                if(results.rows[0] != null){
                    resolve(results.rows[0]);
                }else {
                    resolve([]);
                }
            }
        })
    })
}

let namePhotoArticles
const uploadDirectoryArticles= path.join(__dirname, '../../frontend/public/Articles');
const storageArticles = multer.diskStorage({
    destination: uploadDirectoryArticles,
    filename: (req, file, cb) => {
        dbClients.query(`SELECT MAX(id) FROM articles;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                const randomNumber = generateRandomNumber(100, 10000);
                id = Number(id) + Number(randomNumber)
                namePhotoArticles = id+ path.extname(file.originalname)
                cb(null, namePhotoArticles);
            }
        })
    }
});

const uploadArticlesMulter = multer({ storage: storageArticles });

const uploadArticles = (req) => {
    return new Promise((resolve, reject) => {
        uploadArticlesMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newArticles = (body)=>{
    return new Promise((resolve, reject) => {
        let {namePhoto,title,pointDB} = body;
        dbClients.query(`SELECT MAX(id) FROM articles;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                pointDB= JSON.stringify(pointDB)

                await dbClients.query(`INSERT INTO articles (namePhoto,title,point,activated) VALUES ($1, $2,$3,true) RETURNING *`, [namePhotoArticles,title,pointDB] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const doneArticles = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE articles SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getArticles = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM articles`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deleteArticles = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectoryArticles+"/"+name;

        fs.unlink(filePath, async (err) => {
            if (!err) {
                await dbClients.query(`DELETE FROM articles WHERE id = $1`, [id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    })
}

const updateArticles = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id, namePhoto,title, newPhoto,oldPhoto,pointDB} = body;

        dbClients.query(`SELECT MAX(id) FROM articles;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(newPhoto){
                    const filePath = uploadDirectoryArticles+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }

                pointDB = JSON.stringify(pointDB)

                await  dbClients.query(`UPDATE articles SET namePhoto = $1, title = $2, point = $4 where id=$3`,[namePhotoArticles, title,id,pointDB], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })

    })
}

let namePhotoArticlesid
const uploadDirectoryArticlesId= path.join(__dirname, '../../frontend/public/Articlesid');
const storageArticlesId = multer.diskStorage({
    destination: uploadDirectoryArticlesId,
    filename: (req, file, cb) => {
        dbClients.query(`SELECT MAX(id) FROM articlesid;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }
                const randomNumber = generateRandomNumber(100, 10000);
                id = Number(id) + Number(randomNumber)
                namePhotoArticlesid = id+ path.extname(file.originalname)

                cb(null, namePhotoArticlesid);
            }
        })
    }
});

const uploadArticlesArticlesId = multer({ storage: storageArticlesId });

const uploadArticlesId = (req) => {
    return new Promise((resolve, reject) => {
        uploadArticlesArticlesId.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newArticlesId = (body)=>{
    return new Promise((resolve, reject) => {
        let {namePhoto,title,subtitle,titlePhoto,subtitlePhoto,pointDB} = body;
        dbClients.query(`SELECT MAX(id) FROM articlesid;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                pointDB= JSON.stringify(pointDB)

                let url = "/articlesid?id="+id

                await dbClients.query(`INSERT INTO articlesid (namePhoto,title,subtitle,titlePhoto,subtitlePhoto,point,url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [namePhotoArticlesid,title,subtitle,titlePhoto,subtitlePhoto,pointDB,url] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const getArticlesId = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM articlesid`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deleteArticlesId = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectoryArticlesId+"/"+name;

        fs.unlink(filePath, async (err) => {
            if (!err) {
                await dbClients.query(`DELETE FROM articlesid WHERE id = $1`, [id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    })
}

const updateArticlesId = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id,newPhoto, namePhoto,title,subtitle,titlePhoto,subtitlePhoto,pointDB,oldPhoto} = body;

        dbClients.query(`SELECT MAX(id) FROM articlesid;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(newPhoto){
                    const filePath = uploadDirectoryArticlesId+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }

                pointDB = JSON.stringify(pointDB)

                await  dbClients.query(`UPDATE articlesid SET namePhoto = $1, title = $2, point = $4 , subtitle = $5, titlePhoto = $6, subtitlePhoto = $7 where id=$3`,[namePhotoArticlesid, title,id,pointDB,subtitle,titlePhoto,subtitlePhoto], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })

    })
}


const postArticlesId = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body
        console.log(id)
        const url = "/articlesid?id="+id+""
        await  dbClients.query(`SELECT * FROM articlesid WHERE  url='${url}'`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                if(results.rows[0] != null){
                    resolve(results.rows[0]);
                }else {
                    resolve([]);
                }
            }
        })
    })
}


let namePhotoCalendar

const uploadDirectoryCalendar = path.join(__dirname, '../../frontend/public/Calendar');
const storageCalendar = multer.diskStorage({
    destination: uploadDirectoryCalendar,
    filename: (req, file, cb) => {
        dbClients.query(`SELECT MAX(id) FROM calendar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }
                const randomNumber = generateRandomNumber(100, 10000);
                id = Number(id) + Number(randomNumber)
                namePhotoCalendar = id+ path.extname(file.originalname)
                cb(null, namePhotoCalendar)
            }
        })
    }
});

const uploadCalendarMulter = multer({ storage: storageCalendar });

const uploadCalendar = (req) => {
    return new Promise((resolve, reject) => {


        uploadCalendarMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newCalendar = (body)=>{
    return new Promise((resolve, reject) => {
        const {namePhoto,url} = body;
        dbClients.query(`SELECT MAX(id) FROM calendar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                await dbClients.query(`INSERT INTO calendar (namePhoto,Activated) VALUES ($1,true) RETURNING *`, [namePhotoCalendar] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const doneCalendar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE calendar SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getCalendar = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM calendar`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deleteCalendar = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectoryCalendar+"/"+name;

        fs.unlink(filePath, async (err) => {
            if (!err) {
                await dbClients.query(`DELETE FROM calendar WHERE id = $1`, [id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    })
}

const updateCalendar = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id, namePhoto, url, newPhoto,oldPhoto} = body;

        dbClients.query(`SELECT MAX(id) FROM calendar;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(newPhoto){
                    const filePath = uploadDirectoryCalendar+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }


                await  dbClients.query(`UPDATE calendar SET namePhoto = $1 where id=$2`,[namePhotoCalendar,id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })


            }
        })

    })
}

let namePhotoVideo

const uploadDirectoryVideo = path.join(__dirname, '../../frontend/public/Video');
const storageVideo = multer.diskStorage({
    destination: uploadDirectoryVideo,
    filename: (req, file, cb) => {
        dbClients.query(`SELECT MAX(id) FROM video;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }
                const randomNumber = generateRandomNumber(100, 10000);
                id = Number(id) + Number(randomNumber)
                namePhotoVideo = id+ path.extname(file.originalname)
                cb(null, namePhotoVideo)
            }
        })
    }
});

const uploadVideoMulter = multer({ storage: storageVideo });

const uploadVideo = (req) => {
    return new Promise((resolve, reject) => {


        uploadVideoMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newVideo = (body)=>{
    return new Promise((resolve, reject) => {
        const {namePhoto,url} = body;
        dbClients.query(`SELECT MAX(id) FROM video;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                let id = results.rows[0].max
                if(id == null){
                    id = 1
                }

                await dbClients.query(`INSERT INTO video (namePhoto,url,Activated) VALUES ($1, $2,true) RETURNING *`, [namePhotoVideo,url] , (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve("ok")
                    }
                })
            }
        })
    })
}

const doneVideo = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        await  dbClients.query(`UPDATE video SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getVideo = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM video`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

const deleteVideo = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,name} = body;

        const filePath = uploadDirectoryVideo+"/"+name;

        fs.unlink(filePath, async (err) => {
            if (!err) {
                await dbClients.query(`DELETE FROM video WHERE id = $1`, [id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    })
}

const updateVideo = (body)=>{
    return new Promise(async (resolve, reject) => {
        let {id, namePhoto, url, newPhoto,oldPhoto} = body;

        dbClients.query(`SELECT MAX(id) FROM video;`, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(newPhoto){
                    const filePath = uploadDirectoryVideo+"/"+oldPhoto;

                    fs.unlink(filePath, async (err) => {

                    })
                    let idPhoto = results.rows[0].max
                    if(id == null){
                        idPhoto = 1
                    }
                    namePhoto = idPhoto+path.extname(namePhoto)
                }


                await  dbClients.query(`UPDATE video SET namePhoto = $1, url = $2 where id=$3`,[namePhotoVideo, url,id], async (error, results) => {
                    if (error) {
                        reject(error)
                        console.log(error)
                        resolve("error")
                    } else {
                        resolve('ok');
                    }
                })


            }
        })

    })
}

const nowResponse = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {pib, name, response} = body;
        const data =  dateNow();
        await dbClients.query(`INSERT INTO response (pib, name,response, Activated,data)
                               VALUES ($1, $2,$3, false,$4) RETURNING *`, [pib, name, response,data], (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                const transporter = nodemailer.createTransport({
                    host: 'mail.adm.tools',
                    port: 465 ,
                    secure: true,
                    auth: {
                        user: 'start@bagroup.pro',
                        pass: '8S6ExmU6r5'
                    }
                });

                const mailOptions = {
                    from: "start@bagroup.pro",
                    to: emailAdminStart,
                    subject: "Новий відгук",
                    html: `
                    <html>
                    <head>
                    <style>
                    #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: 100%;
                    }
                    
                    #customers td, #customers th {
                      border: 1px solid #ddd;
                      padding: 8px;
                    }
                    
                    #customers tr:nth-child(even){background-color: #f2f2f2;}
                    
                    #customers tr:hover {background-color: #ddd;}
                    
                    #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: left;
                      background-color: #04AA6D;
                      color: white;
                    }
                    </style>
                    </head>
                    <body>
                    <table id="customers">
                      <tr>
                        <th>ПІБ</th>
                        <th>Назва вібінвру</th>
                        <th>Відгук</th>
                        <th>Дата</th>
                      </tr>
                      <tr>
                        <td>` + pib + `</td>
                        <td>` + name + `</td>
                        <td>` + response + `</td>
                        <td>` + data + `</td>
                      </tr>
                    </table>
                    
                    </body>
                    </html>`};

                transporter.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }
                });
                resolve("ok")
            }
        })
    })
}

const doneResponse = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id,done} = body;
        console.log(1)
        await  dbClients.query(`UPDATE response SET activated = $1 where id=$2`,[done,id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const deleteResponse = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {id} = body;

        await dbClients.query(`DELETE FROM response WHERE id = $1`, [id], async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve('ok');
            }
        })
    })
}

const getResponse = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM response`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

let namePhotoValues = 1

const uploadDirectoryValues = path.join(__dirname, '../../frontend/public/Values');
const storageValues = multer.diskStorage({
    destination: uploadDirectoryValues,
    filename: (req, file, cb) => {
        namePhotoValues = "1" + path.extname(file.originalname)
        cb(null, namePhotoValues)
    }
});

const uploadValuesMulter = multer({ storage: storageValues });

const uploadValues = (req) => {
    return new Promise((resolve, reject) => {


        uploadValuesMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newValues = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {namePhoto,title,subTitle,titleBlock1,textBlock1,textBlock2Bold,textBlock2,titlePoint,subtitlePoint,point1,point2,point3,point4,point5,point6,point7,point8,titleBlock3,textBlock3,credo} = body;

        await  dbClients.query(`SELECT * FROM values`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
                if(results.rows.length === 0){
                    await dbClients.query(`INSERT INTO values (namePhoto,title,subTitle,titleBlock1,textBlock1,textBlock2Bold,textBlock2,titlePoint,subtitlePoint,point1,point2,point3,point4,point5,point6,point7,point8,titleBlock3,textBlock3,credo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,$20) RETURNING *`, [namePhotoValues,title,subTitle,titleBlock1,textBlock1,textBlock2Bold,textBlock2,titlePoint,subtitlePoint,point1,point2,point3,point4,point5,point6,point7,point8,titleBlock3,textBlock3,credo] , (error, results) => {
                        if (error) {
                            reject(error)
                            console.log(error)
                            resolve("error")
                        } else {
                            resolve("ok")
                        }
                    })
                }else {
                    await dbClients.query(
                        `UPDATE values 
   SET namePhoto = $1, title = $2, subTitle = $3, titleBlock1 = $4, textBlock1 = $5, 
       textBlock2Bold = $6, textBlock2 = $7, titlePoint = $8, subtitlePoint = $9, 
       point1 = $10, point2 = $11, point3 = $12, point4 = $13, point5 = $14, 
       point6 = $15, point7 = $16, point8 = $17, titleBlock3 = $18, 
       textBlock3 = $19, credo = $20 
   WHERE id = $21
   RETURNING *`,
                        [namePhotoValues, title, subTitle, titleBlock1, textBlock1, textBlock2Bold, textBlock2, titlePoint, subtitlePoint, point1, point2, point3, point4, point5, point6, point7, point8, titleBlock3, textBlock3, credo,results.rows[0].id],
                        (error, results) => {
                            if (error) {
                                reject(error);
                                console.log(error);
                                resolve("error");
                            } else {
                                resolve("ok");
                            }
                        }
                    );

                }
            }
        })

    })
}

const getValues = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM values`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}


let uploadDirectoryCollective = path.join(__dirname, '../../frontend/public/Collective');

const storageCollective = multer.diskStorage(
    {
        destination:uploadDirectoryCollective,
        filename: (req, file, cb) => {
            console.log(req.query.id)
            cb(null, req.query.id + path.extname(file.originalname));
        }
    }
);

const uploadCollectiveMulter = multer({ storage: storageCollective });

const uploadCollective = (req) => {
    return new Promise((resolve, reject) => {
        uploadCollectiveMulter.single('file')(req, null, (err) => {
            if (err) {
                console.log(err)
                return reject(err);
            }else{
                console.log(req.query.name)

                resolve('File uploaded successfully');
            }
        });

    });
};

const newCollective = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {title,titlePoint,point1,point2,point3,namePhoto0,textBlock2,titleBlock3,namePhoto1,pib1,position1,text1,namePhoto2,pib2,position2,text2,namePhoto3,pib3,position3,text3,namePhoto4,pib4,position4,text4,titleBlock5,namePhoto5,pib5,position5,text5,namePhoto6,pib6,position6,text6,titleBlock6,namePhoto7,pib7,position7,text7,namePhoto8,pib8,position8,text8,titleBlock4} = body;

        await  dbClients.query(`SELECT * FROM collective`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
                if(results.rows.length === 0){
                    await dbClients.query(`INSERT INTO collective (titlePoint,point1,point2,point3,namePhoto,textBlock2,titleBlock3,namePhoto1,pib1,position1,text1,namePhoto2,pib2,position2,text2,namePhoto3,pib3,position3,text3,namePhoto4,pib4,position4,text4,titleBlock5,namePhoto5,pib5,position5,text5,namePhoto6,pib6,position6,text6,titleBlock6,namePhoto7,pib7,position7,text7,namePhoto8,pib8,position8,text8,titleBlock4,title) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                                                                                                                                                                                                                                                                                                                                                                                                                                   $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39,
                                                                                                                                                                                                                                                                                                                                                                                                                                   $40, $41, $42,$43) RETURNING *`, [titlePoint,point1,point2,point3,"0" + path.extname(namePhoto0),textBlock2,titleBlock3,"1" + path.extname(namePhoto1),pib1,position1,text1,"2" + path.extname(namePhoto2),pib2,position2,text2,"3" + path.extname(namePhoto3),pib3,position3,text3,"4" + path.extname(namePhoto4),pib4,position4,text4,titleBlock5,"5" + path.extname(namePhoto5),pib5,position5,text5,"6" + path.extname(namePhoto6),pib6,position6,text6,titleBlock6,"7" + path.extname(namePhoto7),pib7,position7,text7,"8" + path.extname(namePhoto8),pib8,position8,text8,titleBlock4,title] , (error, results) => {
                        if (error) {
                            reject(error)
                            console.log(error)
                            resolve("error")
                        } else {
                            resolve("ok")
                        }
                    })
                }else {
                    await dbClients.query(
                        `UPDATE collective
                         SET
                             titlePoint = $1,
                             point1 = $2,
                             point2 = $3,
                             point3 = $4,
                             namePhoto = $5,
                             textBlock2 = $6,
                             titleBlock3 = $7,
                             namePhoto1 = $8,
                             pib1 = $9,
                             position1 = $10,
                             text1 = $11,
                             namePhoto2 = $12,
                             pib2 = $13,
                             position2 = $14,
                             text2 = $15,
                             namePhoto3 = $16,
                             pib3 = $17,
                             position3 = $18,
                             text3 = $19,
                             namePhoto4 = $20,
                             pib4 = $21,
                             position4 = $22,
                             text4 = $23,
                             titleBlock5 = $24,
                             namePhoto5 = $25,
                             pib5 = $26,
                             position5 = $27,
                             text5 = $28,
                             namePhoto6 = $29,
                             pib6 = $30,
                             position6 = $31,
                             text6 = $32,
                             titleBlock6 = $33,
                             namePhoto7 = $34,
                             pib7 = $35,
                             position7 = $36,
                             text7 = $37,
                             namePhoto8 = $38,
                             pib8 = $39,
                             position8 = $40,
                             text8 = $41,
                             titleBlock4 = $43,
                             title = $44
                         WHERE id = $42
                             RETURNING *`,
                        [
                            titlePoint, point1, point2, point3, "0" + path.extname(namePhoto0), textBlock2, titleBlock3,
                            "1" + path.extname(namePhoto1), pib1, position1, text1, "2" + path.extname(namePhoto2), pib2, position2, text2,
                            "3" + path.extname(namePhoto3), pib3, position3, text3, "4" + path.extname(namePhoto4), pib4, position4, text4,titleBlock5,
                            "5" + path.extname(namePhoto5), pib5, position5, text5, "6" + path.extname(namePhoto6), pib6,
                            position6, text6, titleBlock6, "7" + path.extname(namePhoto7), pib7, position7, text7,
                            "8" + path.extname(namePhoto8), pib8, position8, text8, results.rows[0].id,titleBlock4,title
                        ],
                        (error, results) => {
                            if (error) {
                                reject(error);
                                console.log(error);
                                resolve("error");
                            } else {
                                resolve("ok");
                            }
                        }
                    );

                }
            }
        })

    })
}

const getCollective = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM collective`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}

let uploadDirectoryHead  = path.join(__dirname, '../../frontend/public/Head');

const storageHead  = multer.diskStorage(
    {
        destination:uploadDirectoryHead ,
        filename: (req, file, cb) => {
            console.log(req.query.id)
            cb(null, req.query.id + path.extname(file.originalname));
        }
    }
);

const uploadHeadMulter = multer({ storage: storageHead  });

const uploadHead = (req) => {
    return new Promise((resolve, reject) => {
        uploadHeadMulter.single('file')(req, null, (err) => {
            if (err) {
                console.log(err)
                return reject(err);
            }else{
                console.log(req.query.name)

                resolve('File uploaded successfully');
            }
        });

    });
};

const newHead = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {placeholder,subTitle,title,subtitlePoint,point1,point2,point3,point4,point5,point6,point7,point8,point9,point10,point11,titleBlock1,textBlock1,textBlock12,textBlock13,textBlock14,textBlock15,textBlock15D,textBlock16,textBlock16D,textBlock17,textBlock17D,textBlock18,textBlock19,textBlock110,titleBlock2,textBlock2,placeholder1,placeholder2,placeholder3,placeholder4,placeholder5,placeholder6,titleBlock3,textBlock3,textBlock32,placeholder7,placeholder8,credo} = body;
        //"0" + path.extname(namePhoto0)
        await  dbClients.query(`SELECT * FROM head`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
                if(results.rows.length === 0){
                    await dbClients.query(`INSERT INTO head (namePhoto,subTitle,title,subtitlePoint,point1,point2,point3,point4,point5,point6,point7,point8,point9,point10,point11,titleBlock1,textBlock1,textBlock12,textBlock13,textBlock14,textBlock15,textBlock15D,textBlock16,textBlock16D,textBlock17,textBlock17D,textBlock18,textBlock19,textBlock110,titleBlock2,textBlock2,placeholder1,placeholder2,placeholder3,placeholder4,placeholder5,placeholder6,titleBlock3,textBlock3,textBlock32,placeholder7,placeholder8,credo) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                                                                                                                                                                                                                                                                                                                                                                                                                                   $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39,
                                                                                                                                                                                                                                                                                                                                                                                                                                   $40, $41, $42,$43) RETURNING *`, ["0" + path.extname(placeholder),subTitle,title,subtitlePoint,point1,point2,point3,point4,point5,point6,point7,point8,point9,point10,point11,titleBlock1,textBlock1,textBlock12,textBlock13,textBlock14,textBlock15,textBlock15D,textBlock16,textBlock16D,textBlock17,textBlock17D,textBlock18,textBlock19,textBlock110,titleBlock2,textBlock2,"1" + path.extname(placeholder1),"2" + path.extname(placeholder2),"3" + path.extname(placeholder3),"4" + path.extname(placeholder4),"5" + path.extname(placeholder5),"6" + path.extname(placeholder6),titleBlock3,textBlock3,textBlock32,"7" + path.extname(placeholder7),"8" + path.extname(placeholder8),credo] , (error, results) => {
                        if (error) {
                            reject(error)
                            console.log(error)
                            resolve("error")
                        } else {
                            resolve("ok")
                        }
                    })
                }else {
                    await dbClients.query(
                        `UPDATE head
                         SET
                             subTitle = $1,
                             title = $2,
                             subtitlePoint = $3,
                             point1 = $4,
                             point2 = $5,
                             point3 = $6,
                             point4 = $7,
                             point5 = $8,
                             point6 = $9,
                             point7 = $10,
                             point8 = $11,
                             point9 = $12,
                             point10 = $13,
                             point11 = $14,
                             titleBlock1 = $15,
                             textBlock1 = $16,
                             textBlock12 = $17,
                             textBlock13 = $18,
                             textBlock14 = $19,
                             textBlock15 = $20,
                             textBlock15D = $21,
                             textBlock16 = $22,
                             textBlock16D = $23,
                             textBlock17 = $24,
                             textBlock17D = $25,
                             textBlock18 = $26,
                             textBlock19 = $27,
                             textBlock110 = $28,
                             titleBlock2 = $29,
                             textBlock2 = $30,
                             placeholder1 = $31,
                             placeholder2 = $32,
                             placeholder3 = $33,
                             placeholder4 = $34,
                             placeholder5 = $35,
                             placeholder6 = $36,
                             titleBlock3 = $37,
                             textBlock3 = $38,
                             textBlock32 = $39,
                             placeholder7 = $40,
                             placeholder8 = $41,
                             credo = $42
                         WHERE
                             id = $43
                             RETURNING *`,
                        [subTitle, title, subtitlePoint, point1, point2, point3, point4, point5, point6, point7, point8, point9, point10, point11, titleBlock1, textBlock1, textBlock12, textBlock13, textBlock14, textBlock15, textBlock15D, textBlock16, textBlock16D, textBlock17, textBlock17D, textBlock18, textBlock19, textBlock110, titleBlock2, textBlock2, "1" + path.extname(placeholder1), "2" + path.extname(placeholder2), "3" + path.extname(placeholder3), "4" + path.extname(placeholder4), "5" + path.extname(placeholder5), "6" + path.extname(placeholder6), titleBlock3, textBlock3, textBlock32, "7" + path.extname(placeholder7), "8" + path.extname(placeholder8), credo, results.rows[0].id],
                        (error, results) => {
                            if (error) {
                                reject(error);
                                console.log(error);
                                resolve("error");
                            } else {
                                resolve("ok");
                            }
                        }
                    );

                }
            }
        })

    })
}

const getHead = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM head`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}


let namePhotoClients = 1

const uploadDirectoryClients = path.join(__dirname, '../../frontend/public/Clients');
const storageClients = multer.diskStorage({
    destination: uploadDirectoryClients,
    filename: (req, file, cb) => {
        namePhotoClients = "1" + path.extname(file.originalname)
        cb(null, namePhotoClients)
    }
});

const uploadClientsMulter = multer({ storage: storageClients });

const uploadClients = (req) => {
    return new Promise((resolve, reject) => {


        uploadClientsMulter.single('file')(req, null, (err) => {
            if (err) {
                return reject(err);
            }else{
                resolve('File uploaded successfully');
            }
        });
    });
};

const newClients = (body)=>{
    return new Promise(async (resolve, reject) => {
        const {namePhoto,title,subTitle,titleBlock1,textBlock1,textBlock2Bold,textBlock2,titlePoint,subtitlePoint,point1,point2,point3,point4,point5,point6,point7,point8,blockTitle1,blockText1,blockTitle2,blockText2,blockTitle3,blockText3,blockTitle4,blockText4,blockTitle5,blockText5,blockTitle6,blockText6,credo} = body;

        await  dbClients.query(`SELECT * FROM clients`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
                if(results.rows.length === 0){
                    await dbClients.query(
                        `INSERT INTO clients (
                            namePhoto,title,subTitle,titleBlock1,textBlock1,textBlock2Bold,textBlock2,titlePoint,subtitlePoint,point1,point2,point3,point4,point5,point6,point7,point8,
                            blockTitle1,blockText1,blockTitle2,blockText2,blockTitle3,blockText3,blockTitle4,blockText4,blockTitle5,blockText5,blockTitle6,blockText6,credo
                        ) VALUES (
                                     $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
                                     $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
                                 ) RETURNING *`,
                        [
                            "1" + path.extname(namePhoto), title, subTitle, titleBlock1, textBlock1, textBlock2Bold, textBlock2, titlePoint, subtitlePoint, point1,
                            point2, point3, point4, point5, point6, point7, point8, blockTitle1, blockText1, blockTitle2, blockText2, blockTitle3,
                            blockText3, blockTitle4, blockText4, blockTitle5, blockText5, blockTitle6, blockText6, credo
                        ],
                        (error, results) => {
                            if (error) {
                                reject(error);
                                console.log(error);
                                resolve("error");
                            } else {
                                resolve("ok");
                            }
                        }
                    );
                }else {
                    await dbClients.query(
                        `UPDATE clients SET
                                            namePhoto = $1, title = $2, subTitle = $3, titleBlock1 = $4, textBlock1 = $5, textBlock2Bold = $6, textBlock2 = $7,
                                            titlePoint = $8, subtitlePoint = $9, point1 = $10, point2 = $11, point3 = $12, point4 = $13, point5 = $14, point6 = $15,
                                            point7 = $16, point8 = $17, blockTitle1 = $18, blockText1 = $19, blockTitle2 = $20, blockText2 = $21, blockTitle3 = $22,
                                            blockText3 = $23, blockTitle4 = $24, blockText4 = $25, blockTitle5 = $26, blockText5 = $27, blockTitle6 = $28, blockText6 = $29,
                                            credo = $30
                         WHERE id = $31`,
                        [
                            "1" + path.extname(namePhoto), title, subTitle, titleBlock1, textBlock1, textBlock2Bold, textBlock2, titlePoint, subtitlePoint, point1,
                            point2, point3, point4, point5, point6, point7, point8, blockTitle1, blockText1, blockTitle2, blockText2, blockTitle3,
                            blockText3, blockTitle4, blockText4, blockTitle5, blockText5, blockTitle6, blockText6, credo, results.rows[0].id
                        ],
                        (error, results) => {
                            if (error) {
                                reject(error);
                                console.log(error);
                                resolve("error");
                            } else {
                                resolve("ok");
                            }
                        }
                    );


                }
            }
        })

    })
}

const getClients = ()=>{
    return new Promise(async (resolve, reject) => {
        await  dbClients.query(`SELECT * FROM clients`, async (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
                resolve("error")
            } else {
                resolve(results.rows);
            }
        })
    })
}



module.exports = {
    signIn,
    testToken,
    uploadPhotoCarousel,
    newCarousel,
    clientContact,
    getClientContact,
    doneClientContact,
    deleteClientContact,
    getCarousel,
    doneCarousel,
    deleteCarousel,
    updateCarousel,

    saveContactInfo,
    getClientContactInfo,
    saveBook,
    getBook,
    byBook,
    getByBook,
    deleteBookBy,
    doneByBook,

    uploadWebinar,
    newWebinar,
    doneWebinar,
    getWebinar,
    deleteWebinar,
    updateWebinar,

    uploadOldAllWebinar,
    newOldAllWebinar,
    doneOldAllWebinar,
    getOldAllWebinar,
    deleteOldAllWebinar,
    updateOldAllWebinar,

    uploadNewWebinar,
    newNewWebinar,
    getNowWebinar,
    updateNewWebinar,
    doneNewWebinar,
    oldOrNowNewWebinar,
    deleteNewWebinar,
    postNowWebinar,
    byWebinar,
    postOldWebinar,
    byWebinarOld,
    getOldWebinar,
    getWebinarOldBy,
    doneWebinarOldBy,
    deleteWebinarOldBy,
    getWebinarBy,
    doneWebinarBy,
    deleteWebinarByy,

    newApplication,
    getApplication,
    doneApplication,
    deleteApplication,
    newServiceNew,
    getServiceNew,
    doneServiceNew,
    updateServiceNew,
    deleteServiceNew,
    postServiceNew,

    uploadService,
    newService,
    doneService,
    getService,
    deleteService,
    updateService,

    uploadArticles,
    newArticles,
    doneArticles,
    getArticles,
    deleteArticles,
    updateArticles,

    uploadArticlesId,
    newArticlesId,
    getArticlesId,
    deleteArticlesId,
    updateArticlesId,
    postArticlesId,

    uploadPartner,
    newPartner,
    donePartner,
    getPartner,
    deletePartner,
    updatePartner,

    uploadVideo,
    newVideo,
    doneVideo,
    getVideo,
    deleteVideo,
    updateVideo,

    uploadCalendar,
    newCalendar,
    doneCalendar,
    getCalendar,
    deleteCalendar,
    updateCalendar,

    nowResponse,
    doneResponse,
    deleteResponse,
    getResponse,

    uploadValues,
    newValues,
    getValues,

    uploadCollective,
    newCollective,
    getCollective,

    uploadHead,
    newHead,
    getHead,

    uploadClients,
    newClients,
    getClients
};
