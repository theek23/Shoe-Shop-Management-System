package lk.ijse.gdse66.helloshoes.backend.entity;

import jakarta.persistence.*;
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
public class Inventory {
    @Id
    private String itemCode;
    private String description;
    private String picture;
    private String category;
    private Integer size;
    private Double buyingPrice;
    private Double salePrice;
    private Double expectProfit;
    private Double profitMargin;
    private String status;
    private Integer Qty;

    @ManyToOne
    @JoinColumn(name = "supplierCode")
    private Supplier supplier;

    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL)
    private List<SaleDetail> saleDetail;
}
