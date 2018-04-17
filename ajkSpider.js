const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
const http = require('http');

var i = 0;
var url = 'http://www.ss.pku.edu.cn/index.php/newscenter/news/2391';

function fetchPage(x){
    startRequest(x)
}

function startRequest(x){
    http.get(x,function(res){
        var html = '';
        var titles = [];
        res.setEncoding('utf-8');
        res.on('data',function (chunk) {
            html += chunk
        });

        res.on('end',function () {
            var $ = cheerio.load(html)
            var time = $('.article-info a:first-child').next().text().trim();
            var news_item = {
                title: $('div.article-title a').text().trim(),
                time: time,
                link: 'http://www.ss.pku.edu.cn' + $('div.article-title a').attr('href'),
                author: $('[title=供稿]').text().trim(),
                i: i= i + 1     //判断文章数量
            }

            console.log(news_item)
            var news_title = $('div.article-title a').text().trim();

            //TODO 存储图片和内容
            saveContent($, news_title)
            saveImg($, news_title)

            var nextLink="http://www.ss.pku.edu.cn" + $("li.next a").attr('href');
            str1 = nextLink.split('-');  //去除掉url后面的中文
            str = encodeURI(str1[0]);

            if(i<10){
                //避免访问过快被封IP
                setTimeout(function(){
                    fetchPage(str)
                },5000)
            }
        });
    }).on('error',function(err){
       console.log(err)
    });
}

function saveContent($, news_title){
    $('.article-content p').each(function(index, item){
        var x = $(this).text()
        var y = x.substring(0, 2).trim()
        if(y==''){
            // 将段落一段段添加到文件名为新闻标题的文件下
            x += '\n' //换行
            fs.appendFile('./data/'+news_title+ '.txt',x,'utf-8',function(err){
                if(err){
                    console.log(err)
                }
            })
        }
    })
}

function saveImg($, news_title){
    $('.article-content img').each(function(index, item){
        var img_title = $(this).parent().next().text().trim()
        if(img_title.length>35 || img_title==''){
            img_title = 'Null'
        }
        var file_name = img_title + '.jpg'
        var src = 'http://www.ss.pku.edu.cn'+$(this).attr('src')

        //使用request 模块获取图片资源
        request.head(src, function(err,res,body){
            if(err){
                console.log(err)
            }
        })
        request(src).pipe(fs.createWriteStream('./img/'+news_title+'---'+file_name))
    })
}

fetchPage(url)