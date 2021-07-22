const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
/**
 * @swagger
 * /api/users/authenticate:
 *  post:
 *      summary: Retrieve a single user and token by username and password.
 *      description: Retrieve a single user by username and password.
 *      requestBody:
 *          description: user input
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: add username.
 *                              example: demo
 *                          password:
 *                              type: string
 *                              description: add password.
 *                              example: 123
 *      responses:
 *       200: 
 *          description: get user and token.
 *          content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      _id:
 *                       type: string
 *                       description: get Id.
 *                      username:
 *                       type: string
 *                       description: get username.
 *                      firstName:
 *                       type: string
 *                       description: get firstName.
 *                      lastName:
 *                       type: string
 *                       description: get lastName.
 *                      token:
 *                       type: string
 *                       description: get user token.
 *                       example: ""
 * 
 */
router.post('/authenticate', authenticate);
/**
 * @swagger
 * /api/users/register:
 *  post:
 *      summary: User registration.
 *      description: User registration.
 *      requestBody:
 *          description: user input
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: add username.
 *                              example: demo
 *                          password:
 *                              type: string
 *                              description: add password.
 *                              example: 123
 *                          firstName:
 *                              type: string
 *                              description: add password.
 *                              example: hello
 *                          lastName:
 *                              type: string
 *                              description: add password.
 *                              example: world
 *      responses:
 *       200: 
 *          description: get user short details without password.
 *          content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      username:
 *                       type: string
 *                       description: add username.
 *                       example: demo
 *                      firstName:
 *                       type: string
 *                       description: add firstName.
 *                       example: demo
 *                      lastName:
 *                       type: string
 *                       description: add lastName.
 *                       example: demo
 * 
 */
router.post('/register', register);
/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: Get all user list.
 *      description: Get all user information in array/list.
 *      responses:
 *           200:
 *              description: get user short details without password.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              properties:
 *                                id:
 *                                 type: string
 *                                 description: show id.
 *                                 example: 60f9cbc4d5358b337c2081c5
 *                                username:
 *                                 type: string
 *                                 description: show username.
 *                                 example: demo
 *                                firstName:
 *                                 type: string
 *                                 description: show firstName.
 *                                 example: hello
 *                                lastName:
 *                                 type: string
 *                                 description: show lastName.
 *                                 example: world
 *                                createdDate:
 *                                 type: string
 *                                 description: add createdDate.
 *                                 example: "2021-07-22T19:49:24.204Z"
 * 
 * 
 */
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => {
            next({message: err})
        });
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}