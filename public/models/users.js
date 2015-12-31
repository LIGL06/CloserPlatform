'use strict'
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'emails'
})
const userModel={}
userModel.getUsers=function(callback){
  if (connection) {
    connection.query('SELECT * FROM users ORDER BY id',function(error,rows){
      if (error) throw error
      else callback(null,rows)
    })
  }
}
userModel.getUser=function(id,callback){
  if (connection) {
    const sql = 'SELECT * FROM users WHERE id=' + connection.escape(id)
    connection.query(sql,function(error,row){
      if (error) throw error
      else callback(null,row)
    })
  }
}
userModel.getUser=function(userData,callback){
  if (connection) {
    connection.query('INSERT INTO users SET ?',userData,function(error,result){
      if (error) throw error
      else callback(null,{"insertId":result.insertId})
    })
  }
}
userModel.updateUser=function(userData,callback){
  if (connection) {
    const sql = 'UPDATE users SET username =' +
    connection.escape(userData.username) + ',' + 'email =' +
    connection.escape(userData.email) + 'WHERE id =' + userData.id
    connection.query(sql,function(error,result){
      if (error) throw error
      else callback(null,{"msg":"success"})
    })
  }
}
userModel.deleteUser=function(id,callback){
  if (connection) {
    const sqlExists = 'SELECT * FROM users WHERE id =' + connection.escape(id)
    connection.query(sqlExists,function(error,row){
      if (row) {
        const sql = 'DELETE FROM users WHERE id =' + connection.escape(id)
        connection.query(sql,function(error,result){
          if (error) throw error
          else callback(null,{"msg":"deleted"})
        })
      }
      else callback(null,{"msg":"notExist"})
    })
  }
}

module.exports = userModel
