
const initialSettings = {
    crawlUrl: "https://www.nhs.uk/conditions/coronavirus-covid-19/coronavirus-vaccination/who-can-get-the-vaccine/",
    termToChange : "People aged 30 and over",
    crawlingInterval: 10 * 60 * 1000, //10 minutes interval to crawl.
    terminalModeEnabled: false, //if enabled, you can change the search term while the crawler is running.useful for testing.
    port: 7734,
    pushBulletToken: "", //push bullet token string if you want push bullet integration,
    notification:{
        title: 'NHS page updated',
        message: 'Click to go there!',
    }
}
module.exports = initialSettings;