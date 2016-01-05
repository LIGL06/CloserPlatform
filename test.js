'use strict'
const express = require('express')
const sqlite = require('sqlite3').verbose()
const app = express()
const db = new sqlite.Database('finaldb')
const port = 9000

db.serialize(function(){
  db.run('CREATE TABLE IF NOT EXISTS final (key TEXT, value INTEGER)')
  db.run('INSERT INTO final (key,value) VALUES (?,?)','contador',0)
})

app.get('/data',function(req,res){
  db.get('SELECT value FROM final',function(error,row){
    res.json({ 'count': row.value })
  })
})
app.post('/data',function(req,res){
  db.run('UPDATE final SET value = value + 1 WHERE key = ?','contador', function(error,row){
    if (error) {
      console.error(error)
      res.status(500)
    }
    else res.status(202)
    res.end()
  })
})

app.listen(port)
console.log('Server running at %s',port)
