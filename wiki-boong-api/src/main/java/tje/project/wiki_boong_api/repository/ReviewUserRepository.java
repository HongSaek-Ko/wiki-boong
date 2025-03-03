package tje.project.wiki_boong_api.repository;

import tje.project.wiki_boong_api.domain.ReviewUser;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReviewUserRepository extends JpaRepository<ReviewUser, Long> {
}
