package lk.ijse.gdse66.helloshoes.backend.repo;

import lk.ijse.gdse66.helloshoes.backend.entity.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SaleDetailRepo extends JpaRepository<SaleDetail,String> {
    @Query(value = "SELECT SUM(sd.qty * (i.sale_price - i.buying_price)) FROM sale_detail sd JOIN inventory i ON sd.item_code = i.item_code", nativeQuery = true)
    double findTotalProfitOfSoldItems();
}
