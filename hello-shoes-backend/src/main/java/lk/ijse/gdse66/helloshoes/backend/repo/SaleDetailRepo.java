package lk.ijse.gdse66.helloshoes.backend.repo;

import lk.ijse.gdse66.helloshoes.backend.entity.Inventory;
import lk.ijse.gdse66.helloshoes.backend.entity.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SaleDetailRepo extends JpaRepository<SaleDetail,String> {
    @Query(value = "SELECT SUM(sd.qty * (i.sale_price - i.buying_price)) FROM sale_detail sd JOIN inventory i ON sd.item_code = i.item_code", nativeQuery = true)
    double findTotalProfitOfSoldItems();

    // Native query to find the top 4 most sold items based on quantity
    @Query(value = "SELECT sd.item_code, SUM(sd.qty) as totalQty FROM sale_detail sd GROUP BY sd.item_code ORDER BY totalQty DESC LIMIT 4", nativeQuery = true)
    List<Object[]> findTop4SoldItems();
}
