package tje.project.wiki_boong_api.dto;

import tje.project.wiki_boong_api.domain.MenuOwner;
import tje.project.wiki_boong_api.domain.MenuUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuRespDTO {

    private Long menuId;
    private String menuName;
    private String price;
    private String menuFilename;
    private LocalDateTime regDate;
    private LocalDateTime updateDate;

    // 생성자
    //MenuUser Entity -> DTO toMenuUserDTO = DB에서 조회한 내용을 DTO로 변환 -> 화면에 전달 목적 큼
    public MenuRespDTO (MenuUser menuUser) {

        this.menuId = menuUser.getMenuUserId();
        this.menuName = menuUser.getMenuName();
        this.price = menuUser.getPrice();
        this.menuFilename= menuUser.getMenuFilename();
        this.updateDate = menuUser.getUpdateDate();

    }
    // MenuOwner Entity -> DTO
    public MenuRespDTO (MenuOwner menuOwner) {

        this.menuId = menuOwner.getMenuOwnerId();
        this.menuName = menuOwner.getMenuName();
        this.price = menuOwner.getPrice();
        this.menuFilename= menuOwner.getMenuFilename();
        this.updateDate = menuOwner.getUpdateDate();

    }


}
