package lk.ijse.gdse66.helloshoes.backend.repo;

import lk.ijse.gdse66.helloshoes.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryRepo extends JpaRepository<Inventory,String> {
    @Query(value = "SELECT i.item_code FROM Inventory i ORDER BY i.item_code DESC LIMIT 1", nativeQuery = true)
    String findLastInventoryCode();

    @Query("SELECT i FROM Inventory i WHERE i.description LIKE %:description%")
    List<Inventory> findItemByDescription(@Param("description") String description);

    // Query to find the total cost of every record of inventory
    @Query("SELECT SUM(i.buyingPrice * i.qty) FROM Inventory i")
    double findTotalInventoryCost();



}
