import axios from "axios";

async function addressParser(data) {
    const res = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
        params: {
            query : data.address
        },
        headers : {
            Authorization : 'KakaoAK b9a280f33d2ad5d270d2e40e67ce3dc4'
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