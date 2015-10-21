var Note = require('../models/Note');
var User = require('../models/User');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

module.exports = function(app, express) {
	var apiRouter = express.Router();

	apiRouter.post('/authenticate', function(req, res) {
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user) {
			if (err) throw err;

			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password'
					});
				} else {
					var token = jwt.sign({
						username: user.username
					}, secret, {
						expiresIn: 86400 // expires in 24 hours
					});

					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}
			}
		});
	});

	apiRouter.post('/signup', function(req, res) {
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code === 11000) {
					return res.json({
						success: false,
						message: 'A user with that username already exists'
					});
				} else {
					return res.json({
						success: false,
						message: err
					});
				}
			}

			res.json({
				success: true,
				message: 'User created!'
			});
		});
	});

	apiRouter.use(function(req, res, next){
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		if(token){
			jwt.verify(token, secret, function(err, decoded){
				if(err){
					res.status(403).send({
						success : false,
						message : 'Failed to authenticate token'
					});
				} else {
					req.decoded = decoded;
					next();
				}
			})
		} else {
			res.status(403).send({
				success : false,
				message : 'No token provided'
			});
		}
	});

	apiRouter.route('/users/:user_id')
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.json(err);

				res.json(user);
			});
		});


	apiRouter.route('/note')
		.get(function(req, res) {
			Note.find({}, function(err, data) {
				if (err) throw err;
				res.json(data);
			})
		})
		.post(function(req, res) {
			var time = moment();

			var note = new Note({
				title: req.body.title,
				description: req.body.description,
				timestamp: time
			});

			note.save(function(err, resp) {
				if (err) throw err;
				res.send(resp);
			});
		})
		.put(function(req, res) {
			Note.findById(req.body.note_id, function(err, note) {
				if (err) throw err;

				if (req.body.title) note.title = req.body.title;
				if (req.body.description) note.description = req.body.description;
				note.timestamp = moment();

				note.save((err, resp) => {
					if (err) throw err;
					res.send(resp);
				});
			})
		})
		.delete(function(req, res) {
			console.log(req.body.note_id)
			Note.remove({
				_id: req.body.note_id
			}, function(err, resp) {
				if (err) throw err;
				res.send(resp);
			});
		});

	return apiRouter;
};
