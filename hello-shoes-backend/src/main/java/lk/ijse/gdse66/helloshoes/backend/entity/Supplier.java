package lk.ijse.gdse66.helloshoes.backend.entity;

import jakarta.persistence.*;
import lk.ijse.gdse66.helloshoes.backend.entity.embedded.Address;
import lk.ijse.gdse66.helloshoes.backend.entity.embedded.ContactNo;
import lk.ijse.gdse66.helloshoes.backend.util.entityUtil.supplierUtil.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class Supplier {
    @Id
    private String supplierCode;
    private String name;
    private Category category;
    @Embedded
    private Address address;
    @Embedded
    private ContactNo contactNo;
    private String email;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    private List<Inventory> inventoryItems;
}
