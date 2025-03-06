import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Map as KakaoMap,
  KakaoMapMarkerClustererContext,
  Map,
  MapMarker,
  MapTypeControl,
  MarkerClusterer,
  Toolbox,
  useMap,
} from 'react-kakao-maps-sdk';
import { getMapList } from '../../api/mapApi';
import useCustomMove from '../../hooks/useCustomMove';
const { kakao } = window;

function DetailMap({
  data,
  onButtonClick,
  handleMarkerClick,
  transFilterData,
  transCertData,
  transOpenData,
}) {
  const [serverData, setServerData] = useState([]); // 서버에서 받을 데이터
  const [isOpenData, setIsOpenData] = useState([]); // 서버데이터 중 open = true
  const [isCloseData, setIsCloseData] = useState([]); // 서버데이터 중 open = close
  const [renderingMarker, setRenderingMarker] = useState([]); // ...데이터 중 렌더링 할 것들
  const [selectedMarker, setSelectedMarker] = useState();
  const [cate, setCate] = useState('all'); // 카테고리, 기본 all
  // const [sw, setSw] = useState(''); // 지도 영역값 중 남서쪽
  // const [role, setRole] = useState(0); // user: 1(true), owner: 2(false), 기본값 0 ('구분 없음')
  const [open, setOpen] = useState(''); // true: 1, 기본값: 0(준비중 포함)
  const { moveToShop } = useCustomMove();

  // 버튼 노출 유무
  const [showButton, setShowButton] = useState(false);

  // 지도의 영역 (= 마커 렌더링 범위)
  const [mapLoc, setMapLoc] = useState({
    level: 0,
    position: { lat: '', lng: '' },
    bound: {
      northLat: '',
      eastlng: '',
      southLat: '',
      westlng: '',
    },
  });

  // 마커 렌더링 제한 여부
  const [rendering, setRendering] = useState(false);

  // 현재 위치
  const [curLoc, setCurLoc] = useState({
    // 지도의 초기 위치
    center: { lat: '', lng: '' },
    // 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
    isPanto: true,
  });

  // 현재 사용자 위치 받아오기 (geolocation)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 위치 상태값(state) 설정
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
          // 현재 위치 상태값(curLoc) 설정
          setCurLoc((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false,
      }));
    }
  }, []);

  // 카테고리별 조회
  useEffect(() => {
    getMapList(transFilterData).then((data) => {
      setCate(transFilterData); // 카테고리값
      // setRole(transCertData); // 인증값
      setOpen(transOpenData); // 영업값
      setServerData(data); // 점포 목록 데이터 (전체)
      // 렌더링할 마커 (조건: 화면 범위 내)
      setRenderingMarker(
        data.filter(
          (e) =>
            e.lat >= mapLoc.bound.southLat &&
            e.lat <= mapLoc.bound.northLat &&
            e.lng >= mapLoc.bound.westlng &&
            e.lat <= mapLoc.bound.eastlng
        )
      );
      // 렌더링할 마커 중에서 영업 중
      setIsOpenData(data.filter((e) => e.status == 'opened')); // (...영업 중)
      // 렌더링할 마커 중에서 준비 중
      setIsCloseData(data.filter((e) => e.status == 'closed')); // (...준비 중)

      console.log('serverData: ', serverData);
      console.log('isOpenData: ', isOpenData);
    });
  }, [transFilterData, cate, open, transOpenData, rendering]);

  const [state, setState] = useState({
    // 지도의 초기 위치
    center: { lat: 37.55518211651773, lng: 126.93729086731213 },
    // 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
    isPanto: true,
  });

  // 검색한 위치의 중심 좌표
  const [searchAddress, setSearchAddress] = useState({
    lat: '',
    lng: '',
  });

  // 주소에 해당하는 마커 표시
  useEffect(() => {
    // 주소를 좌표로 변환하는 함수
    const geocoder = new kakao.maps.services.Geocoder();

    // 장소를 좌표로 변환하는 함수
    const ps = new kakao.maps.services.Places();

    // 주소를 좌표로 변환하여 state에 저장
    let callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const newSearch = result[0];
        setState({
          center: { lat: newSearch.y, lng: newSearch.x },
        });
      }
    };
    geocoder.addressSearch(`${searchAddress}`, callback); // 주소 → 좌표
    ps.keywordSearch(`${searchAddress}`, callback); // 장소 → 좌표
    console.log(state.center.lat); // 위도
    console.log(state.center.lng); // 경도
  }, [searchAddress]); // 이거 없으면 안됨

  useEffect(() => {
    if (data) {
      setSearchAddress(data);
    }
  }, [data]);

  // 마커: 영업 중
  const OpenMarkerContainer = ({ position, content, onClick, isClicked }) => {
    const map = useMap();
    const [isVisible, setIsVisible] = useState(false);

    const handleMarkerClick = () => {
      onClick(); // 부모 컴포넌트에서 전달된 onClick 함수 호출
    };

    return (
      <>
        {/* 조건부 렌더링: status = opened */}
        {renderingMarker && isOpenData && rendering && (
          <MapMarker
            position={position}
            onClick={handleMarkerClick}
            onMouseOver={() => setIsVisible(true)}
            onMouseOut={() => setIsVisible(false)}
            image={{
              src: '../src/assets/icon/booth_active.png', // 마커이미지 주소
              size: {
                width: 50,
                height: 50,
              }, // 마커이미지의 크기입니다
            }}
          >
            {isVisible && content}
          </MapMarker>
        )}
      </>
    );
  };

  // 마커: 영업 준비 중
  const CloseMarkerContainer = ({ position, content, onClick, isClicked }) => {
    const map = useMap();
    const [isVisible, setIsVisible] = useState(false); // 마커 정보 노출 여부 (기본 false)

    const handleMarkerClick = () => {
      onClick(); // 부모 컴포넌트에서 전달된 onClick 함수 호출
    };

    return (
      <>
        {/* 조건부 렌더링: status = closed */}
        {/* 반드시 조건 뒤에 연산자를 붙여야 함, 그렇지 않으면 함수로 인식함 */}
        {/* 'opened'만 썼다가 함수로 인식(바로 뒤에 '(' 가 옴)해서 문제 생겼음 */}
        {renderingMarker &&
          isCloseData &&
          rendering &&
          transOpenData !== 'opened' && (
            <MapMarker
              position={position}
              onClick={handleMarkerClick}
              onMouseOver={() => setIsVisible(true)} // 마우스 올리면 노출
              onMouseOut={() => setIsVisible(false)} // 마커에서 마우스 벗어나면 숨김
              image={{
                src: '../src/assets/icon/booth_inactive.png', // 마커이미지 주소
                size: {
                  width: 40,
                  height: 40,
                }, // 마커이미지의 크기입니다
              }}
            >
              {isVisible && content}
            </MapMarker>
          )}
      </>
    );
  };

  // 마커: 붕어빵
  // const BreadMarkerContainer = ({ position, content, onClick, isClicked }) => {
  //   const map = useMap();
  //   const [isVisible, setIsVisible] = useState(false);

  //   const handleMarkerClick = () => {
  //     onClick(); // 부모 컴포넌트에서 전달된 onClick 함수 호출
  //   };

  //   return (
  //     <>
  //       {/* 조건부 렌더링(없어도 됨) */}
  //       {breadData && (
  //         <MapMarker
  //           position={position}
  //           onClick={handleMarkerClick}
  //           onMouseOver={() => setIsVisible(true)}
  //           onMouseOut={() => setIsVisible(false)}
  //           image={{
  //             src: '../src/assets/icon/bread.png', // 마커이미지 주소
  //             size: {
  //               width: 32,
  //               height: 32,
  //             }, // 마커이미지의 크기입니다
  //           }}
  //         >
  //           {isVisible && content}
  //         </MapMarker>
  //       )}
  //     </>
  //   );
  // };

  // // 마커: 분식
  // const SnackMarkerContainer = ({ position, content, onClick, isClicked }) => {
  //   const map = useMap();
  //   const [isVisible, setIsVisible] = useState(false);

  //   const handleMarkerClick = () => {
  //     onClick(); // 부모 컴포넌트에서 전달된 onClick 함수 호출
  //   };

  //   return (
  //     <>
  //       {/* 조건부 렌더링(없어도 됨) */}
  //       {breadData && (
  //         <MapMarker
  //           position={position}
  //           onClick={handleMarkerClick}
  //           onMouseOver={() => setIsVisible(true)}
  //           onMouseOut={() => setIsVisible(false)}
  //           image={{
  //             src: '../src/assets/icon/snack.png', // 마커이미지 주소
  //             size: {
  //               width: 32,
  //               height: 32,
  //             }, // 마커이미지의 크기입니다
  //           }}
  //         >
  //           {isVisible && content}
  //         </MapMarker>
  //       )}
  //     </>
  //   );
  // };

  // // 마커: 군고구마
  // const SweetMarkerContainer = ({ position, content, onClick, isClicked }) => {
  //   const map = useMap();
  //   const [isVisible, setIsVisible] = useState(false);

  //   const handleMarkerClick = () => {
  //     onClick(); // 부모 컴포넌트에서 전달된 onClick 함수 호출
  //   };

  //   return (
  //     <>
  //       {/* 조건부 렌더링(없어도 됨) */}
  //       {sweetData && (
  //         <MapMarker
  //           position={position}
  //           onClick={handleMarkerClick}
  //           onMouseOver={() => setIsVisible(true)}
  //           onMouseOut={() => setIsVisible(false)}
  //           image={{
  //             src: '../src/assets/icon/sweetPotato.png', // 마커이미지 주소
  //             size: {
  //               width: 32,
  //               height: 32,
  //             }, // 마커이미지의 크기입니다
  //           }}
  //         >
  //           {isVisible && content}
  //         </MapMarker>
  //       )}
  //     </>
  //   );
  // };

  // // 마커: 호떡
  // const HotMarkerContainer = ({ position, content, onClick, isClicked }) => {
  //   const map = useMap();
  //   const [isVisible, setIsVisible] = useState(false);

  //   const handleMarkerClick = () => {
  //     onClick(); // 부모 컴포넌트에서 전달된 onClick 함수 호출
  //   };

  //   return (
  //     <>
  //       {/* 조건부 렌더링(없어도 됨) */}
  //       {hotData && (
  //         <MapMarker
  //           position={position}
  //           onClick={handleMarkerClick}
  //           onMouseOver={() => setIsVisible(true)}
  //           onMouseOut={() => setIsVisible(false)}
  //           image={{
  //             src: '../src/assets/icon/hotteok.png', // 마커이미지 주소
  //             size: {
  //               width: 32,
  //               height: 32,
  //             }, // 마커이미지의 크기입니다
  //           }}
  //         >
  //           {isVisible && content}
  //         </MapMarker>
  //       )}
  //     </>
  //   );
  // };

  // 현위치로 이동 버튼 (좌상단)
  const EventButtonContainer = () => {
    const map = useMap();
    const mapCenter = map.getCenter();
    const mapLatLng = {
      lat: mapCenter.getLat(),
      lng: mapCenter.getLng(),
    };
    const goBack = () => {
      const newLatLng = new kakao.maps.LatLng(
        curLoc.center.lat,
        curLoc.center.lng
      );
      map.panTo(newLatLng);
      console.log(mapLatLng);
    };
    return (
      <button
        onClick={goBack}
        style={{
          position: 'absolute', // 지도 위에 버튼 깔기 위해 설정
          zIndex: '3', // 최소 지도 레이어(1)보다 높아야 함
          margin: '10px',
          width: '3%',
        }}
      >
        <img
          className=" bg-white/95 rounded-3xl"
          src="../src/assets/icon/curloc2.png"
          title="현재 위치로 이동"
        />
      </button>
    );
  };

  // 현 위치에서 재검색 이벤트
  const searchCurLoc = () => {
    // 재검색 버튼 false로 변경하여 숨기기
    setShowButton(false);
    setRendering(true);
    console.log(mapLoc);
    console.log(serverData);
  };

  // 현 위치에서 재검색 버튼 컨테이너
  const EventResearchContainer = () => {
    return (
      <>
        {showButton && (
          <button
            onClick={searchCurLoc}
            style={{
              position: 'absolute', // 지도 위에 버튼 깔기 위해 설정
              zIndex: '3', // 최소 지도 레이어(1)보다 높아야 함
              marginTop: '5px',
              marginLeft: '50px',
              objectFit: 'none',
              display: 'flex',
            }}
          >
            <img
              src="../src/assets/icon/researchCur.png"
              title="현 지도에서 재검색"
              style={{
                width: '45%',
                justifyItems: 'center',
              }}
            />
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <div id="mapwrap">
        {/* 카카오맵 */}
        <KakaoMap
          center={state.center} // state값에 따라 지도 중심 설정 (state: 페이지 로딩, 검색 시 변동)
          isPanto={state.isPanto}
          style={{
            width: '100%',
            height: '75vh',
            position: 'relative', // 지도 위에 버튼 깔기 위해 설정
            float: 'right', // 상동
          }}
          level={3}
          // 중심좌표 변경 시 발생하는 이벤트
          // onCenterChanged={(e) => {
          //   const level = e.getLevel();
          //   const latLng = e.getCenter();
          //   setMapLoc({
          //     level: level,
          //     position: {
          //       lat: latLng.getLat(),
          //       lng: latLng.getLng(),
          //     },
          //   });
          //   setShowButton(true);
          // }}
          // 지도 영역 변경 감지
          onBoundsChanged={(e) => {
            const level = e.getLevel();
            const bound = e.getBounds();
            const latLng = e.getCenter();
            setMapLoc({
              level: level,
              position: {
                lat: latLng.getLat(),
                lng: latLng.getLng(),
              },
              bound: {
                northLat: bound.getNorthEast().getLat(),
                eastlng: bound.getNorthEast().getLng(),
                southLat: bound.getSouthWest().getLat(),
                westlng: bound.getSouthWest().getLng(),
              },
            });
            setShowButton(true);
          }}
        >
          {/* <DrawingManager> */}
          {/* <Toolbox /> */}

          {/* 현재 내 위치 마커. 모든 마커는 반드시 맵 다음에 와야 함 */}
          {!state.isLoading && (
            <MapMarker
              position={curLoc.center} // curLoc 값에 따라 마커 설정 (고정)
              image={{
                src: '../src/assets/icon/location.png',
                size: {
                  width: 50,
                  height: 50,
                },
              }}
              title="나는 여기에 있어용"
            />
          )}
          {/* 내 위치 버튼 */}
          <EventButtonContainer />

          {/* 현 위치에서 재검색 버튼 */}
          <EventResearchContainer />

          {/* 맵 마커 목록: 영업 중 */}
          <MarkerClusterer
            averageCenter={true}
            minLevel={5}
            calculator={[10, 30, 50]}
            styles={[
              {
                // calculator 각 사이 값 마다 적용될 스타일을 지정한다
                width: '30px',
                height: '30px',
                background: 'rgba(245, 77, 77, 0.83)',
                borderRadius: '15px',
                color: '#000',
                textAlign: 'center',
                fontWeight: 'bold',
                lineHeight: '31px',
              },
            ]}
          >
            {isOpenData.map((data, index) => (
              <OpenMarkerContainer
                index={index}
                key={`OpenMarkerContainer-${data.lat}-${data.lng}`}
                position={{ lat: data.lat, lng: data.lng }}
                // 마커 마우스 올리면 나타나는 화면 div
                content={
                  <div
                    style={{
                      width: '100%',
                      whiteSpace: 'nowrap',
                      height: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '10px',
                      textAlign: 'center',
                    }}
                  >
                    가게명: {data.title} <hr />
                    카테고리:{' '}
                    {
                      data.category === 'bread'
                        ? '붕어빵'
                        : data.category === 'snack'
                          ? '분식'
                          : data.category === 'hotteok'
                            ? '호떡'
                            : data.category === 'sweetPotato'
                              ? '군고구마'
                              : data.category // 조건에 맞지 않으면(예외) 원래 값 출력
                    }{' '}
                    <hr />
                    {data.status === 'opened' ? (
                      <div>영업 중</div>
                    ) : (
                      <div>영업 준비 중</div>
                    )}
                  </div>
                }
                onClick={() => {
                  setSelectedMarker(index);
                  console.log('shopId: ', data.shopId);
                  moveToShop(data.shopId);
                }}
                isClicked={selectedMarker === index}
              />
            ))}
          </MarkerClusterer>

          {/* 맵 마커 목록: 영업 준비 중 */}
          <MarkerClusterer
            averageCenter={true}
            minLevel={5}
            calculator={[10, 30, 50]}
            styles={[
              {
                // calculator 각 사이 값 마다 적용될 스타일을 지정한다
                width: '30px',
                height: '30px',
                background: 'rgba(198, 179, 179, 0.83)',
                borderRadius: '15px',
                color: '#6b6b6b',
                textAlign: 'center',
                fontWeight: 'bold',
                lineHeight: '31px',
              },
            ]}
          >
            {isCloseData.map((data, index) => (
              <CloseMarkerContainer
                index={index}
                key={`OpenMarkerContainer-${data.lat}-${data.lng}`}
                position={{ lat: data.lat, lng: data.lng }}
                // 마커 마우스 올리면 나타나는 화면 div
                content={
                  <div
                    style={{
                      width: '100%',
                      whiteSpace: 'nowrap',
                      height: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '10px',
                      textAlign: 'center',
                    }}
                  >
                    가게명: {data.title}
                    <hr />
                    영업시간: {data.openTime} ~ {data.closeTime} <hr />
                    카테고리:{' '}
                    {
                      data.category === 'bread'
                        ? '붕어빵'
                        : data.category === 'snack'
                          ? '분식'
                          : data.category === 'hotteok'
                            ? '호떡'
                            : data.category === 'sweetPotato'
                              ? '군고구마'
                              : data.category // 조건에 맞지 않으면(예외) 원래 값 출력
                    }{' '}
                    <hr />
                    {data.status === 'opened' ? (
                      <div>영업 중</div>
                    ) : (
                      <div>영업 준비 중</div>
                    )}
                  </div>
                }
                onClick={() => {
                  setSelectedMarker(index);
                  console.log('shopId: ', data.shopId);
                  moveToShop(data.shopId);
                }}
                isClicked={selectedMarker === index}
              />
            ))}
          </MarkerClusterer>
          {/* </DrawingManager> */}
        </KakaoMap>
        <button onClick={onButtonClick} className="hidden"></button>
      </div>
    </>
  );
}

export default DetailMap;
