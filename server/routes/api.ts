import express from 'express'
import * as authController from '../controllers/authController'
import * as userController from '../controllers/userController'
import * as exerciseController from '../controllers/exerciseController'
import * as activityController from '../controllers/activityController'
import { requireAuth } from '../middleware/auth'

const router = express.Router()

// Auth
router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)
router.get('/auth/me', requireAuth, authController.me)

// User
router.get('/users/me', requireAuth, userController.getProfile)
router.put('/users/me', requireAuth, userController.updateProfile)
router.delete('/users/me', requireAuth, userController.deleteAccount)

// Exercises
router.get('/exercises', exerciseController.list)
router.post('/exercises', requireAuth, exerciseController.create)
router.put('/exercises/:id', requireAuth, exerciseController.update)
router.delete('/exercises/:id', requireAuth, exerciseController.remove)

// Activities
router.get('/activities', requireAuth, activityController.listByUser)
router.post('/activities', requireAuth, activityController.create)
router.put('/activities/:id', requireAuth, activityController.update)
router.delete('/activities/:id', requireAuth, activityController.remove)
router.get('/activities/summary', requireAuth, activityController.summary)

export default router
