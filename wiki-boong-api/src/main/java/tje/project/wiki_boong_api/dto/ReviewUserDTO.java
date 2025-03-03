package tje.project.wiki_boong_api.dto;

import tje.project.wiki_boong_api.domain.ReviewUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewUserDTO {

    private Long reviewUserId;
    private String content;

    //DTO -> Entity
    private ReviewUser toEntity(ReviewUserDTO reviewUserDTO) {
        ReviewUser reviewUser = ReviewUser.builder()
                .content(content)
                .build();
        return reviewUser;
    }



}
