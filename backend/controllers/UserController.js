import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { notFoundError, internalServerError } from '../utils/index.js';

const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    internalServerError('Failed to register, user already exists');
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    notFoundError(user, 'User not found');

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    notFoundError(isValidPass, 'Incorrect login or password');

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    internalServerError('Failed to login');
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    notFoundError(user, 'User not found');

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    return console.log(err);
  }
};

const setBalance = async (req, res) => {
  try {
    const userId = req.params.id;

    await User.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          balance: req.body.balance,
        },
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    return console.log(err);
  }
};

const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    notFoundError(user, 'User not found');

    const balance = user._doc.balance;
    notFoundError(balance, 'Balance not determined');

    res.json(user._doc.balance);
  } catch (err) {
    return console.log(err);
  }
};

export { register, login, getMe, setBalance, getBalance };
