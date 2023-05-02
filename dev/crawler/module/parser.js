import axios from "axios";

async function addressParser(data) {
    const res = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
        params: {
            query : data.address
        },
        headers : {
            Authorization : 'KakaoAK '
        }
    })

    let lng, lat = 0

    // 
    if(res.data.document.length > 0) {
        lng = res.data.document[0].address.x
        lat = res.data.document[0].address.y
    }
    
    data.lng = lng
    data.lat = lat

    return data
}

export { addressParser }