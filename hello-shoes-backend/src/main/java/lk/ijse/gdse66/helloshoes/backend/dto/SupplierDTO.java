package lk.ijse.gdse66.helloshoes.backend.dto;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lk.ijse.gdse66.helloshoes.backend.dto.basic.InventoryBasicDTO;
import lk.ijse.gdse66.helloshoes.backend.entity.Inventory;
import lk.ijse.gdse66.helloshoes.backend.entity.embedded.Address;
import lk.ijse.gdse66.helloshoes.backend.entity.embedded.ContactNo;
import lk.ijse.gdse66.helloshoes.backend.util.entityUtil.supplierUtil.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDTO {
    private String supplierCode;
    private String name;
    private Category category;
    private Address address;
    private ContactNo contactNo;
    private String email;

    private List<InventoryBasicDTO> inventoryItems;
}
