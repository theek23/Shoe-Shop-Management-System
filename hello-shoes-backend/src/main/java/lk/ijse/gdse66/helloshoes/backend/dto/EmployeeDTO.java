package lk.ijse.gdse66.helloshoes.backend.dto;

import lk.ijse.gdse66.helloshoes.backend.entity.Sale;
import lk.ijse.gdse66.helloshoes.backend.entity.User;
import lk.ijse.gdse66.helloshoes.backend.entity.embedded.Address;
import lk.ijse.gdse66.helloshoes.backend.util.entityUtil.Gender;
import lk.ijse.gdse66.helloshoes.backend.util.entityUtil.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDTO implements Serializable {
    private String employeeCode;
    private String name;
    private String profilePic;
    private Gender gender;
    private String status;
    private String designation;
    private Role role;
    private Date dateOfBirth;
    private Date dateOfJoin;
    private String branch;
    private Address address;
    private String ContactNo;
    private String email;
    private String guardianName;
    private String EmergencyContactNo;

    private User user;
    private List<Sale> sales;
}
