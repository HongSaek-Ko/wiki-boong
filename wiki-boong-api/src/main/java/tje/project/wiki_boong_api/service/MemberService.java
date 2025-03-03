package tje.project.wiki_boong_api.service;

import tje.project.wiki_boong_api.domain.Member;
import tje.project.wiki_boong_api.dto.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
public interface MemberService {
    MemberDTO getKakaoMember(String accessToken);

    // Member 등록
    String regist(MemberFormDTO memberFormDTO);

    // 멤버 1명 조회
    MemberResponseDTO getMemberByEmail(String email);

    // 멤버 1명 조회(연락처로 멤버 조회)
    MemberResponseDTO getMemberByPhone(String phone);

    // Member 엔티티 -> MemberDTO 변환 default 메서드
    default MemberDTO entityToDTO(Member member) {
        MemberDTO memberDTO = new MemberDTO(
                member.getEmail(),
                member.getPassword(),
                member.getNickname(),
                member.getPhone(),
                member.getProfileFilename(),
                member.getCertiFilename(),
                member.isSocial(),
                member.getMemberStat(),
                member.getRoleList().stream()
                        .map(role -> role.name())
                        .collect(Collectors.toList())
        );
        return memberDTO;
    }

    void modifyMember(MemberModifyDTO memberModifyDTO);

    // 회원 일반정보 수정
    void modifyMemberInfoService(MemberFormModifyInfoDTO memberFormModifyInfoDTO);

    // 카카오 회원 정보 수정
    void modifyMemberKakaoService(MemberFormModifyKakaoDTO memberFormModifyKakaoDTO);

    // 회원 비밀번호 수정
    String  modifyMemberPasswordService(MemberFormModifyPasswordDTO memberFormModifyPasswordDTO);

    // 회원 탈퇴
    void remove(String email);

    void modifyPasswordByTemporaryPassword(String email, String pwdResult);

    List<ShopMoonDTO> getShopsByEmail(String email);

    ShopDTO getShopByEmail(String email);

    void openShop(String email);

    void closeShop(String email);
}
