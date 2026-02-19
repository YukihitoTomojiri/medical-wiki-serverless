import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import auth from './routes/auth'
import users from './routes/users'
import facilities from './routes/facilities'
import departments from './routes/departments'
import manuals from './routes/manuals'
import upload from './routes/upload'
import announcements from './routes/announcements'
import leaves from './routes/leaves'
import admin from './routes/admin' // I might need to group admin routes

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Routes
app.route('/api/auth', auth)
app.route('/api/users', users)
app.route('/api/facilities', facilities)
app.route('/api/departments', departments)
app.route('/api/manuals', manuals)
app.route('/api/upload', upload) // Generic upload as requested
app.route('/api/announcements', announcements)
app.route('/api/leaves', leaves)
app.route('/api/admin', admin)

// Health Check
app.get('/', (c) => c.text('Medical Wiki LMS API is running'))

export default app
