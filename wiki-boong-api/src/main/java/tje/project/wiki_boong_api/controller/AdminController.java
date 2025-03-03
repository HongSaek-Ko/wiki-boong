package tje.project.wiki_boong_api.controller;

import tje.project.wiki_boong_api.dto.*;
import tje.project.wiki_boong_api.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/admin")
@RequiredArgsConstructor // 생성자 자동 주입
public class AdminController {
    private final AdminService adminService;

    // 목록 처리 : .../list?page=1&size=10
    @GetMapping("/list")
    public PageResponseDTO<MemberResponseDTO> list(PageRequestDTO pageRequestDTO) {
        log.info("/admin/list - pageRequestDTO : {}", pageRequestDTO);
        return adminService.list(pageRequestDTO);
    }

    // 점포 목록 처리 : .../list?page=1&size=10
    @GetMapping("/shoplist")
    public PageResponseDTO<ShopDTO> shoplist(PageRequestDTO pageRequestDTO) {
        log.info("/admin/shoplist - pageRequestDTO : {}", pageRequestDTO);
        return adminService.shoplist(pageRequestDTO);
    }
    // 사업신청자 목록 처리 : .../list?page=1&size=10
    @GetMapping("/memberlist")
    public PageResponseDTO<MemberResponseDTO> memberlist(PageRequestDTO pageRequestDTO) {
        log.info("/admin/memberlist - pageRequestDTO : {}", pageRequestDTO);
        return adminService.memberlist(pageRequestDTO);
    }

    // 멤버 1명 조회
    @GetMapping("/{email}")
    public MemberResponseDTO getMember(@PathVariable("email") String email) {

        log.info("/admin/getMember - pageRequestDTO : {}", email);
        return adminService.getMemberByEmail(email);
    }

    // 멤버 -> 사업자로 승인처리
    @PutMapping("/modifyInfo/{email}")
    public String modifyMemberInfo(@PathVariable(name="email") String email) {
        log.info("modifyInfo - 사업자 승인 처리 email : {}", email);
        //memberFormModifyInfoDTO.setEmail(email);
        //adminService.modifyMember(memberFormModifyInfoDTO);
        adminService.modifyMemberStat(email);
        return email;
    }

    @DeleteMapping("/{email}")
    public Map<String, String> remove(@PathVariable("email") String email) {
        log.info("------------delete member------------");
        log.info("email: " + email);
        adminService.remove(email); // delFlag = true 로 변경
        return Map.of("삭제 결과: ", "성공");
    }

}
