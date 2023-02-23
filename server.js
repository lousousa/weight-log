require('dotenv').config()

/*
// Alternate server method by setting just the port:

const cli = require('next/dist/cli/next-start')
cli.nextStart(['-p', process.env.SERVER_PORT || 3000])
*/

const express = require('express')
const session = require('express-session')
const Next = require('next')

const app = Next({ dev: false })
const handle = app.getRequestHandler()

const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
passport.use(new BasicStrategy(
  function (username, password, done) {
    return done(null, (
      username === process.env.BASIC_AUTH_USER &&
      password === process.env.BASIC_AUTH_PASSWORD
    ))
  }
))

passport.serializeUser((user, done) => {
  process.nextTick(function() {
    return done(null, user)
  })
})

passport.deserializeUser((user, done) => {
  process.nextTick(function() {
    return done(null, user)
  });
})

app
  .prepare()
  .then(() => {
    const server = express()

    server
      .use(session({
        secret: process.env.BASIC_AUTH_PASSWORD,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: true }
      }))
      .use(passport.initialize())
      .use(passport.session())
      .use(passport.authenticate('basic', { session: true }), (_, res, next) => next())
      .get('*', (req, res) => handle(req, res))
      .post('*', (req, res) => handle(req, res))
      .listen(process.env.SERVER_PORT || 3000, (err) => {
        if (err) throw err
        console.log(`Listen 'weight-log' at http://localhost:${ process.env.SERVER_PORT || 3000 } 🔥`)
      })
  })