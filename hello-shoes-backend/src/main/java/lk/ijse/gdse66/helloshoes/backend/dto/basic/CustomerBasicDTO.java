package lk.ijse.gdse66.helloshoes.backend.dto.basic;


import lk.ijse.gdse66.helloshoes.backend.entity.Sale;
import lk.ijse.gdse66.helloshoes.backend.entity.embedded.Address;
import lk.ijse.gdse66.helloshoes.backend.util.entityUtil.Gender;
import lk.ijse.gdse66.helloshoes.backend.util.entityUtil.customrtUtil.Level;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerBasicDTO implements Serializable {
    private String customerCode;
    private String name;
    private Gender gender;
    private String contactNo;
    private String email;
    private String joinDate;
    private Address address;
    private Level level;
    private Double totalPoints;
    private Date dateOfBirth;
    private Timestamp recentPurchase;
}

