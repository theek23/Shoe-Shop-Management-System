package lk.ijse.gdse66.helloshoes.backend.repo;

import lk.ijse.gdse66.helloshoes.backend.dto.CustomerDTO;
import lk.ijse.gdse66.helloshoes.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/

public interface CustomerRepo extends JpaRepository<Customer,String> {
    @Query(value = "SELECT c.customer_code FROM Customer c ORDER BY c.customer_code DESC LIMIT 1", nativeQuery = true)
    String findLastCustomerCode();

    @Query("SELECT c FROM Customer c WHERE c.name LIKE %:name%")
    List<Customer> findCustomersByName(@Param("name") String name);
}
