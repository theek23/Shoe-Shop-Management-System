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


}
