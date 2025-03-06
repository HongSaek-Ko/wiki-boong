package tje.project.wiki_boong_api.service;

import tje.project.wiki_boong_api.domain.Map;
import tje.project.wiki_boong_api.dto.MapDTO;
import tje.project.wiki_boong_api.repository.MapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MapService {
    private final MapRepository mapRepository;
    
    // 맵(가게) 하나 조회
    public MapDTO getMap(int sid) {
        Map map = mapRepository.getMap(sid);
        return new MapDTO().toMapDTO(map);
    }

    // 전체 조회: 기본 메서드(findAll()) 사용
    public List<MapDTO> findAll() {
        List<MapDTO> allMapDTOs = new ArrayList<>();
        List<Map> maps = mapRepository.findAll();
        for (Map map : maps) {
            MapDTO mapDTO = new MapDTO().toMapDTO(map);
            allMapDTOs.add(mapDTO);
        }
        return allMapDTOs;
    }

    // 카테고리 선택 시: findAllByCate
    public List<MapDTO> findAllByCate(String cate) {
        log.info("MapService - findAllByCate: {}", cate);
        List<MapDTO> allMapDTOs = new ArrayList<>();
        List<Map> maps = mapRepository.findAllByCate(cate);
        for(Map map : maps) {
            MapDTO mapDTO = new MapDTO().toMapDTO(map);
            log.info(mapDTO.toString());
            allMapDTOs.add(mapDTO);
        }
        return allMapDTOs;
    }

    // 카테고리 없음, "영업 중"
//    public List<MapDTO> findAllByOpen() {
//        log.info("MapService - findAllByOpen");
//        List<MapDTO> allMapDTOs = new ArrayList<>();
//        List<Map> maps = mapRepository.findAllByOpen(true);
//        for(Map map : maps) {
//            MapDTO mapDTO = new MapDTO().toMapDTO(map);
//            allMapDTOs.add(mapDTO);
//        }
//        return allMapDTOs;
//    }
//
//    // 카테고리 없음 + 구분 있음
//    public List<MapDTO> findAllByRole(int cert) {
//        List<MapDTO> allMapDTOs = new ArrayList<>();
//        // 제보된 것만 조회
//        if(cert == 1) {
//            List<Map> maps = mapRepository.findAllByUser(false);
//            log.info("findByUser: {}", cert);
//            for(Map map : maps) {
//                log.info(map.getShop().toString());
//                MapDTO mapDTO = new MapDTO().toMapDTO(map);
//                allMapDTOs.add(mapDTO);
//                log.info("findByUser - allMapDTOs: {}", allMapDTOs);
//            }
//            // 인증된 것만 조회
//        } else if(cert == 2) {
//            List<Map> maps = mapRepository.findAllByOwner(true);
//            log.info("findByOwner: {}", cert);
//            for(Map map : maps) {
//                MapDTO mapDTO = new MapDTO().toMapDTO(map);
//                allMapDTOs.add(mapDTO);
//                log.info("findByOwner - allMapDTOs: {}", allMapDTOs);
//            }
//        }
//        log.info("findAllByRole: {}", allMapDTOs.toString());
//        return allMapDTOs;
//    }
//
//    // "구분", "영업 중"
//    public List<MapDTO> findByRoleWithOpen(int cert) {
//        List<MapDTO> allMapDTOs = new ArrayList<>();
//        if(cert == 1) {
//            List<Map> maps = mapRepository.findAllByUserWithOpen(false, true);
//            for(Map map : maps) {
//                MapDTO mapDTO = new MapDTO().toMapDTO(map);
//                allMapDTOs.add(mapDTO);
//            }
//        }
//        if(cert == 2) {
//            List<Map> maps = mapRepository.findAllByOwnerWithOpen(true, true);
//            for(Map map : maps) {
//                MapDTO mapDTO = new MapDTO().toMapDTO(map);
//                allMapDTOs.add(mapDTO);
//            }
//        }
//        return allMapDTOs;
//    }
//
//    // 카테고리 있음 + 구분 있음
//    public List<MapDTO> findByCateWithRole(String cate, int cert) {
//        log.info("category, cert: {}, {}", cate, cert);
//        List<MapDTO> allMapDTOs = new ArrayList<>();
//
//        if(cert == 1) {
//            List<Map> maps = mapRepository.findByCategoryWithUser(cate, false);
//            for(Map map : maps) {
//                log.info("map(cert 1): {}", map.toString());
//                MapDTO mapDTO = new MapDTO().toMapDTO(map);
//                allMapDTOs.add(mapDTO);
//            }
//        } else if (cert == 2) {
//            List<Map> maps = mapRepository.findByCategoryWithOwner(cate, true);
//            for(Map map : maps) {
//                log.info("map(cert 2): {}", map.toString());
//                MapDTO mapDTO = new MapDTO().toMapDTO(map);
//                allMapDTOs.add(mapDTO);
//            }
//        }
//        log.info("allMapDTOs: {}", allMapDTOs.toString());
//        return allMapDTOs;
//    }
//
//    // "카테고리" + "영업 중"
//    public List<MapDTO> findByCateWithOpen(String cate) {
//        List<MapDTO> allMapDTOs = new ArrayList<>();
//        List<Map> maps = mapRepository.findByCateWithOpen(cate, true);
//        for(Map map : maps) {
//            MapDTO mapDTO = new MapDTO().toMapDTO(map);
//            allMapDTOs.add(mapDTO);
//        }
//        return allMapDTOs;
//    }
//
//    // "카테고리" + "구분" + "영업 중"
//    public List<MapDTO> findByCateWithRoleAndOpen(String cate, int cert) {
//        List<MapDTO> allMapDTOs = new ArrayList<>();
//        if(cert == 1) {
//            List<Map> maps = mapRepository.findByCateWithUserAndOpen(cate, false, true);
//            for(Map map : maps) {
//                MapDTO mapDTO = new MapDTO().toMapDTO(map);
//                allMapDTOs.add(mapDTO);
//            }
//        } else if (cert == 2) {
//            List<Map> maps = mapRepository.findByCateWithOwnerAndOpen(cate, true, true);
//            for(Map map : maps) {
//                MapDTO mapDTO = new MapDTO().toMapDTO(map);
//                allMapDTOs.add(mapDTO);
//            }
//        }
//        return allMapDTOs;
//    }
}
