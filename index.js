#! /usr/bin/env node 
const child_process = require('child_process')
const promise = require('bluebird')
const exec = promise.promisify(child_process.exec); 
const fs = require('fs')
const gat = require('./src/proxy')
const list = process.argv
const command ={
    start:async()=>{
        if(process.argv.length!==4)return command.error()
        let num = list[3]
        await gat(num,true)
    },
    error:()=>{
        console.log('Error:  Command Not Exsit')
    }
}
for(let i of list){
       if(command[i]) return  command[i]()
}
command.error()
