package lk.ijse.gdse66.helloshoes.backend.repo;

import lk.ijse.gdse66.helloshoes.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/

public interface CustomerRepo extends JpaRepository<Customer,String> {
}
