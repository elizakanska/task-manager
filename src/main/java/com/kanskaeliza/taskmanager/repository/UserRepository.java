package com.kanskaeliza.taskmanager.repository;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserDTO, Long> {
}
