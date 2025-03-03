package tje.project.wiki_boong_api.service;

import tje.project.wiki_boong_api.dto.ReviewFormDTO;


public interface ReviewService {

    Long save (Long shopId, Long ShopDetailId, String infoType, ReviewFormDTO reviewDTO);


}
