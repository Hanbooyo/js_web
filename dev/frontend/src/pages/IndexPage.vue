<template>
  <q-page class="main-layout">
    <q-table v-model:selected="selected" title="약국정보" :rows="mapData" :columns="columns" row-key="name"
      :pagination="initialPagination" dense @update:pagination="pagingHandler" @row-click="rowClick" />
    <div ref="mapContainer" class="map-layout"></div>
    <!-- <pre>{{ mapData }}</pre> -->
  </q-page> <!-- : 은 바인딩,-->
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import mapData from 'src/json/mapData';


const columns = [
  {
    name: 'name',
    required: true,
    label: '약국이름',
    align: 'center',
    field: 'name'
  },
  {
    name: 'address',
    required: true,
    label: '주소',
    align: 'center',
    field: 'address'
  },
  {
    name: 'tel',
    required: true,
    label: '전화번호',
    align: 'center',
    field: 'tel'
  },
  {
    name: 'run_time',
    required: true,
    label: '운영시간',
    align: 'center',
    field: 'run_time'
  },
]


export default defineComponent({
  name: 'IndexPage',
  //DOM을 그리기 전 시점에 SETUP()
  setup() {
    const initialPagination = ref({
      page: 1,
      rowsPerPage: 10
    })

    const mapContainer = ref() // 바인딩이되면 특이한게, 값을가져오려면 .value를 해야함
    const selected = ref()
    let map
    let markers = []
    let mapInit = false

    //Mount 된 이후 (DOM이 다 그려지고 난 다음)
    onMounted(() => {
      // var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
      const mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 9 // 지도의 확대 레벨
      };

      map = new kakao.maps.Map(mapContainer.value, mapOption); // 지도를 생성합니다
      mapInit = true
    })

    const pagingHandler = (newPagination) => {

      initialPagination.value = newPagination
      const { page, rowsPerPage } = newPagination // object 내부의 값을 추출
      //  const page = newPagination.page
      //  const rowsPerPage = newPagination.rowsPerPage

      const start = (page - 1) * rowsPerPage
      const end = page * rowsPerPage

      const currentData = mapData.slice(start, end) // 가져온 정보 가공 (slice => 배열의 start부터 end까지 자르겠다는 뜻)

      const positions = currentData.map(data => {
        return {
          title: data.name,
          latlng: new kakao.maps.LatLng(data.lat, data.lng)
        }
      })

      markers.forEach(marker => marker.setMap(null))
      const timeoutTime = !mapInit ? 500 : 0 // 3항연산자를 이용 0.5초 or 0초, mapInit true일때 실행

      // 마커 이미지의 이미지 주소입니다
      var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

      console.log(positions)

      setTimeout(() => {
        markers = positions.map(position => {
          // 마커 이미지의 이미지 크기 입니다
          var imageSize = new kakao.maps.Size(24, 35);

          // 마커 이미지를 생성합니다    
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

          // 마커를 생성합니다
          var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: position.latlng, // 마커를 표시할 위치
            title: position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지 
          });

          return marker
        })
      }, timeoutTime)
    }
    const rowClick = (evt, row, index) => {
      selected.value = row
      const { lat, lng } = row

      // 이동할 위도 경도 위치를 생성합니다 
      const moveLatLon = new kakao.maps.LatLng(Number(lat), Number(lng));

      // 지도 중심을 부드럽게 이동시킵니다
      // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
      map.panTo(moveLatLon);
      // 현재 지도의 레벨을 얻어옵니다
      var level = map.getLevel();
      // 지도 레벨 변경
      map.setLevel(level - 3);
    }

    
    return {
      mapData,
      columns,
      initialPagination,
      mapContainer,
      pagingHandler,
      rowClick,
      selected
    }
  }
})
</script>

<style lang="scss" scoped>
.main-layout {
  padding: 16px;
}

.map-layout {
  width: 100%;
  height: 40vh;
}
</style>

