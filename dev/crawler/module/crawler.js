// const puppeteer =require('puppeteer-core') ==> common js
import puppeteer from "puppeteer-core";
import os from 'os';
import fs from 'fs';

const macUrl = '/Applications/Google Chrome.app/Contents/MacOs/Google Chrome'
const winUrl = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const currentOs = os.type()
// 실행전 기본 세팅
const launchConfig = {
    headless: false,
    defaultViewport: null,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-notifications',
        '--disable-extensions'],
    executablePath: currentOs == 'Darwin' ? macUrl : winUrl
}

//전역변수 설정

const pagingSelector = "body > table:nth-child(2) > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table:nth-child(5) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(3)"

let browser
let page
let pageNum
let sido
let sigungu
let finalData = []



const launch = async () => {
    browser = await puppeteer.launch(launchConfig)
    const pages = await browser.pages()
    page = pages[0]
    console.log(pages.length)
}

const goto = async () => {
    await page.goto('https://www.pharm114.or.kr/main.asp')
}

const checkPopup = async () => {
    const pages = await browser.pages()
    console.log(pages.length, '닫기 전')
    await pages.at(-1).close() // 팝업 닫기
    console.log(pages.length, '닫은 후')
}

const evalCode = async sidoCode => {
    sido = sidoCode
    await page.evaluate((sido) => {
        const selector = `#continents > li.${sido} > a`
        document.querySelector(selector).click()
    }, sido) // 받은 매개변수 넘겨줌
}

const evalSigungu = async sigunguCode => {
    sigungu = sigunguCode
    console.log('evalSigungu')
    const selector = `#continents > li.${sigungu} > a`

    // DOM에 해당 엘리멘트가 로딩되기를 기다리는 메소드
    await page.waitForSelector(selector)

    await page.evaluate((selector) => {
        document.querySelector(selector).click()
    }, selector)
}

const closeAlert = async () => {
    await page.on('dialog', async function (dialog) {
        await dialog.accept()
    }) // callback
}

const getPageLength = async () => {
    console.log('getPageLength')
    // DOM에 해당 엘리멘트가 로딩되기를 기다리는 메소드
    await page.waitForSelector(pagingSelector)

    pageNum = await page.evaluate((pagingSelector) => {
        const pageLength = document.querySelector(pagingSelector).children.length
        return pageLength
    }, pagingSelector)

    console.log('pageNum', pageNum)
}

const writeFile = async () => {
    const dirPath = `./json/${sido}` // 파일 디렉토리 위치
    const filePath = `${dirPath}/${sigungu}.json` // 파일
    const exist = fs.existsSync(dirPath)

    if(!exist) {
        fs.mkdir(dirPath, {recursive : true}, err => {
            console.log(err)
        })
    }

    await fs.writeFileSync(filePath, JSON.stringify(finalData))
}

// 데이터 크롤링
const getData = async () => {
    for (let i = 0; i < pageNum; i++) {
        await page.waitForSelector(pagingSelector)
        const info = await page.evaluate(() => {
            var trArr = Array.from(document.querySelectorAll("#printZone > table:nth-child(2) > tbody tr"));
            var data = trArr
                .map(el => {
                    console.log(el)
                    return {
                        name : el.querySelectorAll('td')[0]?.innerText,
                        address: el.querySelector('.class_addr')?.innerText.
                        replaceAll('\t','').replaceAll('\n',''),
                        tel: el.querySelectorAll('td')[3]?.innerText,
                        run_time : el.querySelectorAll('td')[4]?.innerText,
                    };
                })
                .filter(val => val.address != undefined)

            return data
        })
        finalData = finalData.concat(info)

        console.log('finalData.length : ', finalData)

        if (pageNum != i) {

            await page.evaluate((pagingSelector, i) => {
                document.querySelector(pagingSelector).children[i].click()
            }, pagingSelector, i)

            await page.waitForSelector('#printZone')
        }
    }
    browser.close()
}

export {
    launch,
    goto,
    checkPopup,
    evalCode,
    evalSigungu,
    closeAlert,
    getPageLength,
    getData,
    writeFile
}   