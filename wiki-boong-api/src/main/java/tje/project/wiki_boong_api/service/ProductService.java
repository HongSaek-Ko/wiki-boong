package tje.project.wiki_boong_api.service;

import tje.project.wiki_boong_api.dto.PageRequestDTO;
import tje.project.wiki_boong_api.dto.PageResponseDTO;
import tje.project.wiki_boong_api.dto.ProductDTO;

public interface ProductService {
    // 목록 조회
    // generic type으로 작성했으므로, ProductDTO 등 다른 게 오더라도 상관 없음
    PageResponseDTO<ProductDTO> getProductList(PageRequestDTO requestDTO);

    // 상품 등록
    Long regist(ProductDTO productDTO);

    // 상품 1개 조회
    ProductDTO getProductByPno(Long pno);

    // 상품 수정
    void modify(ProductDTO productDTO);

    // 상품 삭제
    void remove(Long pno);
}
