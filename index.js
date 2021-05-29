const notifier = require('node-notifier');
const open = require('open');
const axios = require('axios');
const http = require('http');
var colors = require('colors');
const PushBullet = require('pushbullet');
const { exit } = require('process');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

async function Program(){
    var {crawlUrl, termToChange, port, crawlingInterval, terminalModeEnabled, pushBulletToken, notification} = require("./settings");
    /**
     * @type {PushBullet}
     */
    var pusher = null;
    if(pushBulletToken && pushBulletToken !== ""){
        pusher = new PushBullet(pushBulletToken);
        const success = await new Promise((res, rej)=>{
            pusher.me(function(err, response) {
                if(err){
                    console.log(`PushBullet Error. ${err}`.red);
                    pusher = null;
                    res(false);
                }else{
                    console.log(`PushBullet connected to: ${response.email}`.green);
                    res(true);
                }
            });
        })
    }

    const timeoutMS = crawlingInterval;
    var crawlerTimeoutRef = null;

    notifier.on('click', (notifierObject, options, event) =>{
        // opens the url in the default browser 
        open(crawlUrl).then(()=>{
            setTimeout(() => {
                exit();
            }, 5000);
        });
    });

    notifier.on('timeout', (notifierObject, options, event) =>{
        // opens the url in the default browser 
        open(crawlUrl).then(()=>{
            setTimeout(() => {
                exit();
            }, 5000);
        });
    });

    const pageChangedNotification = {
        title: notification.title,
        subtitle: notification.title,
        message: notification.message,
        wait: true,
        sound: true,
        timeout: 10
    }

    function restartCrawlerTimeout() {
        clearCrawlerTimeout();
        crawlerTimeoutRef = setTimeout(() => {
            crawl();
        }, timeoutMS);
    }

    function clearCrawlerTimeout() {
        if (crawlerTimeoutRef) {
            clearTimeout(crawlerTimeoutRef);
        }
    }

    function crawl(){
        axios.get(crawlUrl).then((response)=>{
            const wasTermFound = response.data.includes(termToChange);
            console.log(`[${new Date().toLocaleString()}] Did '${termToChange}' changed in page? ${(wasTermFound? "NO" : "YES")}`);
            if(wasTermFound){
                restartCrawlerTimeout();
            }else{
                NotifyChangeOccurred();
            }
        });
    }

    async function NotifyChangeOccurred() {
        if(pusher){
            await new Promise((res, rej)=>{
                pusher.devices(function(err, response) {
                    if(err){
                        console.log(`PushBullet Error. ${err}`.red);
                        res(false);
                    }else{
                        var pushBulletDevices = [];
                        pushBulletDevices = response.devices.map(x => x.iden);
                        for(const deviceId of pushBulletDevices){
                            pusher.link(deviceId, pageChangedNotification.title, crawlUrl, pageChangedNotification.message, function(error, response) {})
                        }
                        res(true);
                    }
                });
            });
        }
        notifier.notify(pageChangedNotification);
    }

    const hostname = '127.0.0.1';

    const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('NHS-crawler is running\n');
    });

    server.listen(port, hostname, () => {
        console.log(`Crawler started listening to '${crawlUrl}'...`.green);
        crawl();
        console.log(`Searching for '${termToChange}'...\n`);
        if(terminalModeEnabled){
            readline.on('line', function(line){
                if(!line || line === ""){
                    return;
                }
                termToChange = line;
                console.log(`Term to search changed to '${termToChange}'...\n`);
                crawl();
            })
        }
    });
}
Program();