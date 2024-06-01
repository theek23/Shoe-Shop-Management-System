package lk.ijse.gdse66.helloshoes.backend.service.impl;

import lk.ijse.gdse66.helloshoes.backend.dto.CustomerDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.basic.CustomerBasicDTO;
import lk.ijse.gdse66.helloshoes.backend.entity.Customer;
import lk.ijse.gdse66.helloshoes.backend.repo.CustomerRepo;
import lk.ijse.gdse66.helloshoes.backend.service.CustomerService;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {
    private CustomerRepo customerRepo;
    private ModelMapper modelMapper;

    public CustomerServiceImpl(CustomerRepo customerRepo, ModelMapper modelMapper) {
        this.customerRepo = customerRepo;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<CustomerBasicDTO> findCustomersByName(String name) {
        return customerRepo.findCustomersByName(name).stream().map(
                customer -> modelMapper.map(customer,CustomerBasicDTO.class)).toList();
    }

    @Override
    public String generateNewID() {
        String lastID = customerRepo.findLastCustomerCode();

        if (lastID == null){
            return "CUST00001";
        }
        String numericPart = lastID.substring(5);
        int numericValue = Integer.parseInt(numericPart);

        // Increment the numeric value
        numericValue++;

        // Format the new ID with leading zeros
        String newID = String.format("CUST%05d", numericValue);

        return newID;
    }

    @Override
    public CustomerDTO findCustomerByContactNo(String contactNo) {
        Optional<Customer> customerOpt = customerRepo.findCustomerByContactNo(contactNo);
        Customer customer = customerOpt.orElseThrow(() -> new RuntimeException("Customer not found!"));
        return modelMapper.map(customer, CustomerDTO.class);
    }

    @Override
    public List<CustomerBasicDTO> getAllCustomers() {
        return customerRepo.findAll().stream().map(
                customer -> modelMapper.map(customer,CustomerBasicDTO.class)).toList();
    }

    @Override
    public CustomerDTO getCustomerDetails(String id) {
        if (!customerRepo.existsById(id)) throw new RuntimeException("Id not exists !");
        return modelMapper.map(customerRepo.findById(id).get(), CustomerDTO.class);
    }

    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) {
        if (customerDTO.getCustomerCode() == null || customerDTO.getCustomerCode().isEmpty()) {
            customerDTO.setCustomerCode(UUID.randomUUID().toString()); // Generate new UUID only if necessary
        }
        Customer customerEntity = modelMapper.map(customerDTO, Customer.class);
        Customer savedCustomer = customerRepo.save(customerEntity);
        //System.out.println(getLastCustomer());
        return modelMapper.map(savedCustomer, CustomerDTO.class);
    }

    @Override
    public void updateCustomer(String id, CustomerDTO customerDTO) {
        Customer existingCustomer = customerRepo.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
        //modelMapper.map(customerDTO, existingCustomer);

        existingCustomer.setName(customerDTO.getName());
        existingCustomer.setEmail(customerDTO.getEmail());
        existingCustomer.setContactNo(customerDTO.getContactNo());
        existingCustomer.setGender(customerDTO.getGender());
        existingCustomer.setLevel(customerDTO.getLevel());
        existingCustomer.setTotalPoints(customerDTO.getTotalPoints());

        customerRepo.save(existingCustomer);
    }

    @Override
    public void deleteCustomer(String id) {
        if (!customerRepo.existsById(id)) {
            throw new RuntimeException("Cannot delete as customer does not exist with ID: " + id);
        }
        customerRepo.deleteById(id);
    }
}
