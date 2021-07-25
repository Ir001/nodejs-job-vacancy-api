# [NodeJS] Job Vacancy API

Implementasi belajar Nodejs menggunakan package axios, cheerio, dan ExpressJS. Pada project ini saya mencoba men-scrape data dari salah satu situs penyedia lowongan kerja.

## Demo

[Demo API](https://job-vacancy-api.herokuapp.com/)

## Installation

```bash
git clone https://github.com/Ir001/nodejs-job-vacancy-api.git
cd nodejs-job-vacancy-api
npm install
npm start
```

## Usage

Run in Browser.

```
http://localhost:3000/?limit=10
```

Limit maximal 25.

## Preview

![Response](https://github.com/Ir001/nodejs-job-vacancy-api/blob/main/screenshot.png?raw=true)

## Change Log

4 Feb 2021

<ul>
<li>~ Clean response API</li>
<li>~ Add apply by Google</li>
<li>~ Add apply by Linkedin</li>
</ul>

30 April 2021

<ul>
<li>~ Add momentjs</li>
<li>~ Fix deadline & publshed_at to format YYYY-MM-DD</li>
<li>~ Remove secret GET parameter</li>
</ul>

20 July 2021

<ul>
<li>~ Add scape other site ( http://localhost:3000/top-karir)</li>
</ul>
25 July 2021

<ul>
<li>~ Add scape other site ( http://localhost:3000/joblum)</li>
</ul>
