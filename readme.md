# NHS-vaccine-age-crawler

##  Requirements
- Node js installed, at least version `v10.22.1`

## Installation
Install node js on you machine, then run in the root of the repo:
```bash
npm install
```
to install dependencies.

## Setup
Change initial settings on the `settings.js` file.
Default options:
```js
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
```

## Usage
Just run in the root of the repo:
```bash
node index.js
```
