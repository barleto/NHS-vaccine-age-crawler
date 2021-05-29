
const initialSettings = {
    crawlUrl: "https://www.nhs.uk/conditions/coronavirus-covid-19/coronavirus-vaccination/who-can-get-the-vaccine/",
    termToChange : "People aged 30 and over",
    crawlingInterval: 10 * 60 * 1000, //10 seconds interval to crawl
    terminalModeEnabled: false, //if enabled, you can change the search term while the crawler is running
    port: 7734,
    pushBulletToken: "" //push bullet token string if you want push bullet integration
}
module.exports = initialSettings;