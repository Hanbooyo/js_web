// const puppeteer =require('puppeteer-core') ==> common js
import puppeteer from "puppeteer-core";
import os from 'os'; 

const macUrl = '/Applications/Google Chrome.app/Contents/MacOs/Google Chrome'
const winUrl = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const currentOs = os.type()
// 실행전 기본 세팅
const launchConfig = {
    headless : false,  
    defaultViewport : null,
    ignoreDefaultArgs: ['--disable-extensions'],
    args : ['--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-notifications',
        '--disable-extensions'],
    executablePath : currentOs == 'Darwin' ? macUrl : winUrl
}

//전역변수 설정
let browser
let page
let pageNum

const launch = async () => {
    browser = await puppeteer.launch(launchConfig)
    const pages = await browser.pages()
    page = pages[0]
    console.log(pages.length)
}

const goto = async () => {
    await page.goto('https://www.pharm114.or.kr/main.asp')
}

const checkPopup = async () =>  {
    const pages = await browser.pages()
    console.log(pages.length, '닫기 전')
    await pages.at(-1).close() // 팝업 닫기
    console.log(pages.length, '닫은 후')
}

const evalCode = async (sido) => {
    await page.evaluate((sido) => {
        const selector = `#continents > li.${sido} > a`
        document.querySelector(selector).click()
    }, sido) // 받은 매개변수 넘겨줌
}

const evalSigungu = async sigungu => {
    const selector = `#continents > li.${sigungu} > a`   
    
    // DOM에 해당 엘리멘트가 로딩되기를 기다리는 메소드
    await page.waitForSelector(selector)

    await page.evaluate((selector) => {     
        document.querySelector(selector).click()
    }, selector)
}

const closeAlert = async () => {
    await page.on('dialog', async function(dialog) {
        await dialog.accept()
    }) // callback
}

const getPageLength = async () => {
    const pagingSelector = 'body > table:nth-child(2) > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table:nth-child(5) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(3)'

    // DOM에 해당 엘리멘트가 로딩되기를 기다리는 메소드
    await page.waitForSelector(pagingSelector)

    pageNum = await page.evaluate((pagingSelector) => {
        const pageLength = document.querySelector(pagingSelector).children.length
        return pageLength
    }, pagingSelector)

    console.log('pageNum', pageNum)
}



export {
    launch,
    goto,
    checkPopup,
    evalCode,
    evalSigungu,
    closeAlert,
    getPageLength
}