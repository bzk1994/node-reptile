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

        });
    }).on('error',function(err){
       console.log(err)
    });
}

fetchPage(url)