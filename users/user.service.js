const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

/** Login with username and password
 * @param {string} username - The username of system.
 * @param {string} password - The password of system.
 * @param {string} firstName - The firstName of user.
 * @param {string} lastName - The lastName of user.
 * @returns {{user: Object, token: string}} returns an object with user and user token.
 */
async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    
    if (user) {
        const bcryptUser = bcrypt.compareSync(password, user.hash);
        if (bcryptUser) {
            const { hash, ...userWithoutHash } = user.toObject();
            const token = jwt.sign({ sub: user.id }, config.secret);
            return {
                ...userWithoutHash,
                token
            };
        }
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

/** Create user with username and password
 * @param {Object} userParam - username and password object.
 * @param {string} userParam.username - add username.
 * @param {string} userParam.password - add password.
 * @returns {Promise|string} returns string error message if error occered and returns object if success.
 */
async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}
/** Update user with username and password
 * @param {Object} userParam - username and password object.
 * @param {string} userParam.username - add username.
 * @param {string} userParam.password - add password.
 * @returns {Promise|string} returns string error message if error occered and returns object if success.
 */
async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}
/** Delete user with username and password
 * @param {string} id - param with user id.
 * @returns {Promise} returns promis.
 */
async function _delete(id) {
    await User.findByIdAndRemove(id);
}