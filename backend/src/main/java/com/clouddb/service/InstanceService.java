package com.clouddb.service;

import com.clouddb.model.Instance;
import com.clouddb.model.User;
import com.clouddb.repository.InstanceRepository;
import com.clouddb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstanceService {

    private final InstanceRepository instanceRepository;
    private final UserRepository userRepository;

    public List<Instance> getUserInstances(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return instanceRepository.findByUserId(user.getId());
    }

    public Instance createInstance(String username, Instance instance) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        instance.setUser(user);
        return instanceRepository.save(instance);
    }
}