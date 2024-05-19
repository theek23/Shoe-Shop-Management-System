package lk.ijse.gdse66.helloshoes.backend.service.impl;

import lk.ijse.gdse66.helloshoes.backend.entity.Employee;
import lk.ijse.gdse66.helloshoes.backend.entity.Employee;
import lk.ijse.gdse66.helloshoes.backend.dto.EmployeeDTO;
import lk.ijse.gdse66.helloshoes.backend.repo.EmployeeRepo;
import lk.ijse.gdse66.helloshoes.backend.service.EmployeeService;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.UUID;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {
    private EmployeeRepo employeeRepo;
    private ModelMapper modelMapper;

    public EmployeeServiceImpl(EmployeeRepo employeeRepo, ModelMapper modelMapper) {
        this.employeeRepo = employeeRepo;
        this.modelMapper = modelMapper;
    }


    @Override
    public String generateNewID() {
        String lastID = employeeRepo.findLastEmployeeCode();

        if (lastID == null){
            return "EMP00001";
        }
        String numericPart = lastID.substring(5);
        int numericValue = Integer.parseInt(numericPart);

        // Increment the numeric value
        numericValue++;

        // Format the new ID with leading zeros
        String newID = String.format("EMP%05d", numericValue);

        return newID;
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepo.findAll().stream().map(employee -> {
            EmployeeDTO employeeDTO = modelMapper.map(employee, EmployeeDTO.class);
            if (employee.getProfilePic() != null) {
                employeeDTO.setProfilePic(Base64.getEncoder().encodeToString(employee.getProfilePic()));
            }
            return employeeDTO;
        }).toList();
    }


    @Override
    public EmployeeDTO getEmployeeDetails(String id) {
        if (!employeeRepo.existsById(id)) throw new RuntimeException("Id not exists !");
        return modelMapper.map(employeeRepo.findById(id).get(), EmployeeDTO.class);
    }

    @Override
    public EmployeeDTO saveEmployee(EmployeeDTO employeeDTO) {
        if (employeeDTO.getEmployeeCode() == null || employeeDTO.getEmployeeCode().isEmpty()) {
            employeeDTO.setEmployeeCode(UUID.randomUUID().toString()); // Generate new UUID only if necessary
        }
        byte[] imageBytes = Base64.getDecoder().decode(employeeDTO.getProfilePic());
        Employee employeeEntity = modelMapper.map(employeeDTO, Employee.class);
        employeeEntity.setProfilePic(imageBytes);
        Employee savedEmployee = employeeRepo.save(employeeEntity);
        return modelMapper.map(savedEmployee, EmployeeDTO.class);
    }

    @Override
    public void updateEmployee(String id, EmployeeDTO employeeDTO) {
        Employee existingEmployee = employeeRepo.findById(id).orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
        modelMapper.map(employeeDTO, existingEmployee);
        employeeRepo.save(existingEmployee);
    }

    @Override
    public void deleteEmployee(String id) {
        if (!employeeRepo.existsById(id)) {
            throw new RuntimeException("Cannot delete as employee does not exist with ID: " + id);
        }
        employeeRepo.deleteById(id);
    }

    @Override
    public List<EmployeeDTO> findEmployeesByName(String name) {
        return null;
    }
}
