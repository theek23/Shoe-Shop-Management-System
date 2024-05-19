package lk.ijse.gdse66.helloshoes.backend.repo;

import lk.ijse.gdse66.helloshoes.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepo extends JpaRepository<Employee,String> {
    @Query(value = "SELECT e.employee_code FROM Employee e ORDER BY e.employee_code DESC LIMIT 1", nativeQuery = true)
    String findLastEmployeeCode();

    @Query("SELECT e FROM Employee e WHERE e.name LIKE %:name%")
    List<Employee> findEmployeesByName(@Param("name") String name);
}
