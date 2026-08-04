package com.clouddb.repository;

import com.clouddb.model.Instance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InstanceRepository extends JpaRepository<Instance, Long> {
    List<Instance> findByUserId(Long userId);
}