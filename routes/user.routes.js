const  Router = require('express')
const router = new Router()
//підключення контролеру для бази всіх кліентів
const controller_clients = require('../controller/controller_clients')
//створення унікального і'мя в системі
router.post('/signIn', (req, res) => {
    controller_clients.signIn(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.get('/test', (req, res) => {
    controller_clients.test(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/testToken', (req, res) => {
    controller_clients.testToken(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadCarousel', (req, res) => {
    controller_clients.uploadPhotoCarousel(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newCarousel', (req, res) => {
    controller_clients.newCarousel(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/clientContact', (req, res) => {
    controller_clients.clientContact(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getClientContact', (req, res) => {
    controller_clients.getClientContact(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getOldWebinar', (req, res) => {
    controller_clients.getOldWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneClientContact', (req, res) => {
    controller_clients.doneClientContact(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteClientContact', (req, res) => {
    controller_clients.deleteClientContact(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getCarousel', (req, res) => {
    controller_clients.getCarousel(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneCarousel', (req, res) => {
    controller_clients.doneCarousel(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteCarousel', (req, res) => {
    controller_clients.deleteCarousel(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateCarousel', (req, res) => {
    controller_clients.updateCarousel(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadPartner', (req, res) => {
    controller_clients.uploadPartner(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newPartner', (req, res) => {
    controller_clients.newPartner(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/donePartner', (req, res) => {
    controller_clients.donePartner(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getPartner', (req, res) => {
    controller_clients.getPartner(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deletePartner', (req, res) => {
    controller_clients.deletePartner(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updatePartner', (req, res) => {
    controller_clients.updatePartner(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/saveContactInfo', (req, res) => {
    controller_clients.saveContactInfo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getClientContactInfo', (req, res) => {
    controller_clients.getClientContactInfo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/saveBook', (req, res) => {
    controller_clients.saveBook(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getBook', (req, res) => {
    controller_clients.getBook(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/byBook', (req, res) => {
    controller_clients.byBook(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getByBook', (req, res) => {
    controller_clients.getByBook(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteBookBy', (req, res) => {
    controller_clients.deleteBookBy(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneByBook', (req, res) => {
    controller_clients.doneByBook(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadWebinar', (req, res) => {
    controller_clients.uploadWebinar(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newWebinar', (req, res) => {
    controller_clients.newWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneWebinar', (req, res) => {
    controller_clients.doneWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getWebinar', (req, res) => {
    controller_clients.getWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteWebinar', (req, res) => {
    controller_clients.deleteWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateWebinar', (req, res) => {
    controller_clients.updateWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadOldAllWebinar', (req, res) => {
    controller_clients.uploadOldAllWebinar(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newOldAllWebinar', (req, res) => {
    controller_clients.newOldAllWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneOldAllWebinar', (req, res) => {
    controller_clients.doneOldAllWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getOldAllWebinar', (req, res) => {
    controller_clients.getOldAllWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteOldAllWebinar', (req, res) => {
    controller_clients.deleteOldAllWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateOldAllWebinar', (req, res) => {
    controller_clients.updateOldAllWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadNewWebinar', (req, res) => {
    controller_clients.uploadNewWebinar(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newNewWebinar', (req, res) => {
    controller_clients.newNewWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getNowWebinar', (req, res) => {
    controller_clients.getNowWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/postNowWebinar', (req, res) => {
    controller_clients.postNowWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateNewWebinar', (req, res) => {
    controller_clients.updateNewWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneNewWebinar', (req, res) => {
    controller_clients.doneNewWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/oldOrNowNewWebinar', (req, res) => {
    controller_clients.oldOrNowNewWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteNewWebinar', (req, res) => {
    controller_clients.deleteNewWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/byWebinar', (req, res) => {
    controller_clients.byWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/postOldWebinar', (req, res) => {
    controller_clients.postOldWebinar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/byWebinarOld', (req, res) => {
    controller_clients.byWebinarOld(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getWebinarOldBy', (req, res) => {
    controller_clients.getWebinarOldBy(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneWebinarOldBy', (req, res) => {
    controller_clients.doneWebinarOldBy(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteWebinarOldBy', (req, res) => {
    controller_clients.deleteWebinarOldBy(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getWebinarBy', (req, res) => {
    controller_clients.getWebinarBy(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneWebinarBy', (req, res) => {
    controller_clients.doneWebinarBy(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteWebinarBy', (req, res) => {
    controller_clients.deleteWebinarByy(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadService', (req, res) => {
    controller_clients.uploadService(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newService', (req, res) => {
    controller_clients.newService(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneService', (req, res) => {
    controller_clients.doneService(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getService', (req, res) => {
    controller_clients.getService(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteService', (req, res) => {
    controller_clients.deleteService(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateService', (req, res) => {
    controller_clients.updateService(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newApplication', (req, res) => {
    controller_clients.newApplication(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getApplication', (req, res) => {
    controller_clients.getApplication(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneApplication', (req, res) => {
        controller_clients.doneApplication(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteApplication', (req, res) => {
        controller_clients.deleteApplication(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newServiceNew', (req, res) => {
    controller_clients.newServiceNew(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getServiceNew', (req, res) => {
    controller_clients.getServiceNew(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneServiceNew', (req, res) => {
    controller_clients.doneServiceNew(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateServiceNew', (req, res) => {
    controller_clients.updateServiceNew(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteServiceNew', (req, res) => {
    controller_clients.deleteServiceNew(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/postServiceNew', (req, res) => {
    controller_clients.postServiceNew(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadArticles', (req, res) => {
    controller_clients.uploadArticles(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newArticles', (req, res) => {
    controller_clients.newArticles(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneArticles', (req, res) => {
    controller_clients.doneArticles(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getArticles', (req, res) => {
    controller_clients.getArticles(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteArticles', (req, res) => {
    controller_clients.deleteArticles(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateArticles', (req, res) => {
    controller_clients.updateArticles(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadArticlesId', (req, res) => {
    controller_clients.uploadArticlesId(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newArticlesId', (req, res) => {
    controller_clients.newArticlesId(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getArticlesId', (req, res) => {
    controller_clients.getArticlesId(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteArticlesId', (req, res) => {
    controller_clients.deleteArticlesId(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateArticlesId', (req, res) => {
    controller_clients.updateArticlesId(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})


router.post('/postArticlesId', (req, res) => {
    controller_clients.postArticlesId(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadVideo', (req, res) => {
    controller_clients.uploadVideo(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newVideo', (req, res) => {
    controller_clients.newVideo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneVideo', (req, res) => {
    controller_clients.doneVideo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getVideo', (req, res) => {
    controller_clients.getVideo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteVideo', (req, res) => {
    controller_clients.deleteVideo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateVideo', (req, res) => {
    controller_clients.updateVideo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

/*---*/

router.post('/uploadCalendar', (req, res) => {
    controller_clients.uploadCalendar(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newCalendar', (req, res) => {
    controller_clients.newCalendar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/doneCalendar', (req, res) => {
    controller_clients.doneCalendar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getCalendar', (req, res) => {
    controller_clients.getCalendar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/deleteCalendar', (req, res) => {
    controller_clients.deleteCalendar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/updateCalendar', (req, res) => {
    controller_clients.updateCalendar(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/nowResponse', (req, res) => {
    controller_clients.nowResponse(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/doneResponse', (req, res) => {
    controller_clients.doneResponse(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/deleteResponse', (req, res) => {
    controller_clients.deleteResponse(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.get('/getResponse', (req, res) => {
    controller_clients.getResponse(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/uploadValues', (req, res) => {
    controller_clients.uploadValues(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newValues', (req, res) => {
    controller_clients.newValues(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.get('/getValues', (req, res) => {
    controller_clients.getValues(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadCollective', (req, res) => {
    controller_clients.uploadCollective(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/newCollective', (req, res) => {
    controller_clients.newCollective(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.get('/getCollective', (req, res) => {
    controller_clients.getCollective(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadHead', (req, res) => {
    controller_clients.uploadHead(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newHead', (req, res) => {
    controller_clients.newHead(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getHead', (req, res) => {
    controller_clients.getHead(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/uploadClients', (req, res) => {
    controller_clients.uploadClients(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newClients', (req, res) => {
    controller_clients.newClients(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getClients', (req, res) => {
    controller_clients.getClients(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/uploadServicePhoto', (req, res) => {
    controller_clients.uploadServicePhoto(req)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.post('/newServiceNewTwo', (req, res) => {
    controller_clients.newServiceNewTwo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

router.get('/getServiceNewTwo', (req, res) => {
    controller_clients.getServiceNewTwo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/deleteServiceNewTwo', (req, res) => {
    controller_clients.deleteServiceNewTwo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/doneServiceNewTwo', (req, res) => {
    controller_clients.doneServiceNewTwo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/updateServiceNewTwo', (req, res) => {
    controller_clients.updateServiceNewTwo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/updateServiceNewTwoNoPhoto', (req, res) => {
    controller_clients.updateServiceNewTwoNoPhoto(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
router.post('/postServiceNewTwo', (req, res) => {
    controller_clients.postServiceNewTwo(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

module.exports = router