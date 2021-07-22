const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
/**
 * @swagger
 * /api/users/authenticate:
 *  post:
 *      summary: Retrieve a single user user.
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
 *                      user:
 *                       type: object
 *                       description: user info in object.
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
 *          description: get user and token.
 *          content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      user:
 *                       type: object
 *                       description: user info in object.
 *                      token:
 *                       type: string
 *                       description: get user token.
 *                       example: ""
 * 
 */
router.post('/register', register);
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
        .then(() => res.json({}))
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