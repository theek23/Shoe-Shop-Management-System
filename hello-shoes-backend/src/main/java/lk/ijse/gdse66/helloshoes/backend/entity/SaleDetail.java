package lk.ijse.gdse66.helloshoes.backend.entity;

import jakarta.persistence.*;
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
@IdClass(SaleDetail_ID.class)   
public class SaleDetail{
    @Id
    private String itemCode;
    @Id
    private String orderNo;
    private Integer qty;

    @ManyToOne(cascade = CascadeType.ALL)
    private Sale sale;

    @ManyToOne(cascade = CascadeType.ALL)
    private Inventory inventory;
}
