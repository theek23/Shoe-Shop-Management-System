package lk.ijse.gdse66.helloshoes.backend.repo;

import lk.ijse.gdse66.helloshoes.backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SaleRepo extends JpaRepository<Sale,String> {
    @Query(value = "SELECT s.order_no FROM Sale s ORDER BY s.order_no DESC LIMIT 1", nativeQuery = true)
    String findLastOrderCode();

    @Query(value = "SELECT * FROM Sale s WHERE s.purchase_date >= NOW() - INTERVAL 3 DAY", nativeQuery = true)
    List<Sale> findAllOrdersFromLast3Days();

    @Query("SELECT COUNT(s) FROM Sale s WHERE s.status = 'Active'")
    long countActiveSales();
}
