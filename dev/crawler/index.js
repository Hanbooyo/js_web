import {
	launch,
	goto,
	checkPopup,
	evalCode,
	evalSigungu,
	closeAlert,
	getPageLength,
	getData,
	writeFile

} from './module/crawler.js'

async function main() {
	console.log('start')

	// 실행
	await launch()

	// 페이지 이동
	await goto()

	// 팝업 체크
	await checkPopup()

	// 시 이동
	await evalCode('jeju')

	// 구 이동
	await evalSigungu('jeju')

	// alert 닫기
	await closeAlert()

	await getPageLength()

	await getData()

	await writeFile()

	console.log('done')

	process.exit(1)
}

main()