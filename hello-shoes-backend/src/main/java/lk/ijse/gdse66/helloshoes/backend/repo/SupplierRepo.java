package lk.ijse.gdse66.helloshoes.backend.repo;

import lk.ijse.gdse66.helloshoes.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepo extends JpaRepository<Supplier,String> {
    @Query(value = "SELECT s.supplier_code FROM Supplier s ORDER BY s.supplier_code DESC LIMIT 1", nativeQuery = true)
    String findLastSupplierCode();

    @Query("SELECT s FROM Supplier s WHERE s.name LIKE %:name%")
    List<Supplier> findSuppliersByName(@Param("name") String name);
}
