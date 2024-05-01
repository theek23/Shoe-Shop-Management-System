package lk.ijse.gdse66.helloshoes.backend.entity;

import jakarta.persistence.*;
import lk.ijse.gdse66.helloshoes.backend.util.entityUtil.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class User {
    @Id
    private String email;
    private String password;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "employeeCode")
    private Employee employee;
}
