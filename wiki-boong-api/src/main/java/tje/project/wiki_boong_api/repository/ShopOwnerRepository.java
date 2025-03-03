package tje.project.wiki_boong_api.repository;

import tje.project.wiki_boong_api.domain.ShopOwner;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShopOwnerRepository extends JpaRepository<ShopOwner, Long> {

    // join시 필요 (조인할 entity명)
    @EntityGraph(attributePaths = {"menuOwner"})
    @Query("select owner from ShopOwner owner where owner.shop.shopId = :shopId")
    // shopId를 기준으로 ShopOwner + menuOwner 조인하여 가져와라
    public ShopOwner selectShopOwnerByShopUserId(@Param("shopId") Long shopId);
}
