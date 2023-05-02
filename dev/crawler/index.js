import {
	launch,
	goto,
	checkPopup,
	evalCode,
	evalSigungu,
	closeAlert,
	getPageLength
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
		await evalCode('seoul')

		// 구 이동
		await evalSigungu('songpa_gu')

		// alert 닫기
		await closeAlert()

		await getPageLength()



		console.log('end')

		// process.exit(1)
}

main()