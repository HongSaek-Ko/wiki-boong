package tje.project.wiki_boong_api.controller;

import tje.project.wiki_boong_api.dto.ReviewFormDTO;
import tje.project.wiki_boong_api.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/add/{shopId}/{shopDetailId}/{infoType}")
    public Long addReivew(@PathVariable("shopId") Long shopId,
                          @PathVariable("shoDetailId") Long shopDetailId,
                          @PathVariable("infoType") String infoType,
                          ReviewFormDTO reviewDTO) {
        log.info("shopId : ", shopId);
        log.info("shopDetailId : ", shopDetailId);
        log.info("infoType : ", infoType);
        log.info("ReviewDTO : {}", reviewDTO);

        reviewService.save(shopId, shopDetailId,infoType,reviewDTO);
        return 1L;
    }
}
