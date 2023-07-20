const router = require('express').Router()

const {
  User,
  Blog
} = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog
      }
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
      include: {
        model: Blog
      }
    })
    if (!user) {
      throw Error('User not found!')
    }
    const updated = await user.update({
      name: req.body.name
    })
    const users = await User.findAll({
      include: {
        model: Blog
      }
    })
    res.json(updated)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    console.log(id)
    const user = await User.findByPk(id, {
      attributes: { exclude: [''] } ,
      include: [{
        model: Blog,
        as: 'readings',
        attributes: ['id', 'author', 'title', 'uri', 'likes', 'year'],
        through: {
          as: 'reading_list',
          attributes: ['id', 'read']
        }
      }],
    })
    if (!user) {
      throw Error('User not found!')
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.use((error, req, res, next) => {
  console.error(error.message)
  if (error.message === 'User not found!') {
    return res.status(404).json({
      error: error.message
    });
  } else {
    console.log(error.message)
    return res.status(500).json({
      error: 'Something went wrong. Please try again!'
    });
  }
})

module.exports = router