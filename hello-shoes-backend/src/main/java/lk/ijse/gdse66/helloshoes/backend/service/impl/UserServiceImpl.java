package lk.ijse.gdse66.helloshoes.backend.service.impl;

import lk.ijse.gdse66.helloshoes.backend.dto.UserDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.UserDTO;
import lk.ijse.gdse66.helloshoes.backend.entity.User;
import lk.ijse.gdse66.helloshoes.backend.repo.UserRepo;
import lk.ijse.gdse66.helloshoes.backend.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Service
@Transactional
public class UserServiceImpl implements UserService {
    private UserRepo userRepo;
    private ModelMapper modelMapper;

    public UserServiceImpl(UserRepo userRepo, ModelMapper modelMapper) {
        this.userRepo = userRepo;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserDetailsService userDetailService() {
        return username -> userRepo.findByEmail(username)
                .orElseThrow(() -> new
                        UsernameNotFoundException(
                        "user not found"));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream().map(
                users -> modelMapper.map(users, UserDTO.class)).toList();
    }

    @Override
    public UserDTO getUserDetails(String id) {
        if (!userRepo.existsById(id)) throw new RuntimeException("Id not exists !");
        return modelMapper.map(userRepo.findById(id).get(), UserDTO.class);
    }

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
        User userEntity = modelMapper.map(userDTO, User.class);
        User savedUser = userRepo.save(userEntity);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public void updateUser(String id, UserDTO userDTO) {
        User existingUser = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        modelMapper.map(userDTO, existingUser);
        userRepo.save(existingUser);
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("Cannot delete as user does not exist with ID: " + id);
        }
        userRepo.deleteById(id);
    }
}
