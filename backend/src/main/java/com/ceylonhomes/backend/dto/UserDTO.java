package com.ceylonhomes.backend.dto;

import com.ceylonhomes.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
}
