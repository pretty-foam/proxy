const cheerio = require('cheerio')
const promise = require('bluebird')
const fs = require('fs')
const request = promise.promisifyAll(require('request'))

//获取IP地址 page：当前所在页
async function get(page = 1) {
    try {
        const options = {
            url: `http://www.xicidaili.com/nn/${page}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
            }
        }
        const storage = [] //数据链接存储          
        const data = await request.getAsync(options) //当前页面数据
        const $ = cheerio.load(data.body) //数据载入类似于jquery
        const table = $('#ip_list tr') //获取表格
        for (let i = 1; i < table.length; i++) {
            const tr = table.eq(i).children('td') //行 tr
            const ip = tr.eq(1).text() //ip
            const port = tr.eq(2).text() //port
            const type = tr.eq(5).text() //http,https
            storage.push(type + '://' + ip + ':' + port)
        }
        console.log('获取数据总数：' + storage.length)
        return storage

    } catch (err) {
        console.log(err)
    }
}


//筛选有效IP  data：数据链接
async function check(data) {
    console.log('开始验证数据:')
    try {
        const valid = []  //有效数据
        await new Promise((res, rej) => {
            let length = data.length
            for (let i = 0; i < data.length; i++) {
                const options = {
                    url: "http://www/baidu.com",
                    proxy: data[i]
                }
                request.get(options, (err, req, body) => {
                    if (err) {
                        if ((--length) === 0) {
                            return res()
                        }
                    }else{
                        if(body&&req.statusCode===200){
                           valid.push(data[i])
                         }
                    }
                      
                    if ((--length) === 0) {
                        return res()
                    }
                })
            }
        })
        console.log('有效数据:' + valid.length)
        return valid
    } catch (err) {
        console.log(err)
    }
}

//保存数据
function saveData(data) {
    fs.writeFileSync("proxy.json", JSON.stringify(data));
    console.log("Save Success!");
}

//num 获取的有效proxy数量
async function start(num) {
    let storage = [] //存储有效链接
    let page = 1 //当前所在页面
    while (storage.length < num) {
        let data = await get(page++)   //获取链接总数
        data = await check(data) //获取有效链接
        storage = storage.concat(data)
    }
    console.log('vailProxyTotal:' + storage.length)
    saveData(storage)


}
//获取proxy
start(18)
