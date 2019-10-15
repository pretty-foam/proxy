const cheerio = require('cheerio')
const Promise = require('bluebird')
const fs = require('fs')
const request = Promise.promisifyAll(require('request'))

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

        return storage

    } catch (err) {
        console.log(err)
    }
}


//筛选有效IP  data：数据链接
async function check(data) {
    console.log('获取页面链接数量：' + data.length)
    console.log('开始验证数据')
    try {
        let valid = [] //有效数据
        //对每一个请求进行Promise包装,验证网页内容,获取网页
        const bodys = await Promise.map(data, value => new Promise((resolve, reject) => {
            const options = {
                url: "http://www.baidu.com",
                proxy: value,
                timeout: 5000
            }
            request.get(options, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    return resolve(body)
                } else {
                    return resolve(false)
                }
            })

        }))
        //筛选有效代理
        bodys.forEach((val, index) => {
            if (val) {
                const $ = cheerio.load(val)
                const title = $('title').text()
                if (title === "百度一下，你就知道") {
                    valid.push(data[index])
                }
            }
        })
        console.log('currentVaild:' + valid.length)
        return valid
    } catch (err) {
        console.log(err)
    }
}

//保存数据
function saveData(data) {
    const currentPath = process.cwd()+'/proxy.json'
    fs.writeFileSync(currentPath, JSON.stringify(data));
    console.log("Save Success At:"+currentPath);
}

/**
 * 获取高匿 http代理
 * @param {Number} num 获取的有效proxy数量
 * @param {Boolean} isSave 是否保存本地Json格式数据
 * @returns {Array} 高匿代理IP数组
 */
async function start(num,isSave=false) {
    
    let storage = [] //存储有效链接
    let page = 1 //当前所在页面
    let data = [] //获取链接总数
    while (storage.length < num) {
        //控制并发，高于300易拒绝访问
        while (data.length < 155) {
            let currentData = await get(page++) //当前链接
            data = data.concat(currentData)
        }
        data = await check(data) //获取有效链接
        storage = storage.concat(data)
        console.log('vaildProxyTotal:' + storage.length)
    }
    isSave?saveData(storage):null
    return data
}
//获取proxy
module.exports= start