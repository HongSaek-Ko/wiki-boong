package tje.project.wiki_boong_api.dto;

import lombok.extern.slf4j.Slf4j;
import tje.project.wiki_boong_api.domain.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Slf4j
public class MapDTO {
    private Long mapId;
    private String title;
    private double lat;
    private double lng;
    private Long shopId;
    private String category;
    private boolean isOpen;
    private String Location;
    private boolean certificate;
    private String openTime;
    private String closeTime;

    // Entity → DTO
    public MapDTO toMapDTO(Map map) {
        MapDTO mapDTO = new MapDTO();
        mapDTO.setMapId(map.getMapId());
        mapDTO.setShopId(map.getShop().getShopId());
        mapDTO.setLat(map.getLat());
        mapDTO.setLng(map.getLng());
        // certificate = true → owner
        if(map.getShop().isCertificate()) {
            mapDTO.setCertificate(true);
            mapDTO.setTitle(map.getShop().getShopOwner().getTitle());
            mapDTO.setLocation(map.getShop().getShopOwner().getLocation());
            mapDTO.setCategory(map.getShop().getShopOwner().getCategory());
            mapDTO.setOpenTime(map.getShop().getShopOwner().getOpenTime());
            mapDTO.setCloseTime(map.getShop().getShopOwner().getCloseTime());
            mapDTO.setOpen(map.getShop().getShopOwner().isOpen());
        }
        if (!map.getShop().isCertificate()) {
            mapDTO.setCertificate(false);
            mapDTO.setTitle(map.getShop().getShopUser().getTitle());
            mapDTO.setLocation(map.getShop().getShopUser().getLocation());
            mapDTO.setCategory(map.getShop().getShopUser().getCategory());
            mapDTO.setOpenTime(map.getShop().getShopUser().getOpenTime());
            mapDTO.setCloseTime(map.getShop().getShopUser().getCloseTime());
            mapDTO.setOpen(map.getShop().getShopUser().isOpen());
        }
        return mapDTO;
    }

    // DTO -> Entity
    public Map toEntity() {
        Map map = Map.builder()
                .mapId(this.mapId)
                .title(this.title)
                .lat(this.lat)
                .lng(this.lng)
                .build();
        return map;
    }

    // 시간 계산 메서드
    public void timeFormatter() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
    }
}
