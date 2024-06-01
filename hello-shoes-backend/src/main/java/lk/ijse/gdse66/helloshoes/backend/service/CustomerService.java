package lk.ijse.gdse66.helloshoes.backend.service;

import lk.ijse.gdse66.helloshoes.backend.dto.CustomerDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.basic.CustomerBasicDTO;

import java.util.List;

public interface CustomerService {
    List<CustomerBasicDTO> findCustomersByName(String name);
    String generateNewID();
    CustomerDTO findCustomerByContactNo(String contactNo);

    List<CustomerBasicDTO> getAllCustomers();
    CustomerDTO getCustomerDetails(String id);
    CustomerDTO saveCustomer(CustomerDTO customerDTO);
    void updateCustomer(String id, CustomerDTO customerDTO);
    void deleteCustomer(String id);
}
