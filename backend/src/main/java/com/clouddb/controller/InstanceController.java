package com.clouddb.controller;

import com.clouddb.model.Instance;
import com.clouddb.service.InstanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instances")
@RequiredArgsConstructor
public class InstanceController {

    private final InstanceService instanceService;

    @GetMapping
    public ResponseEntity<List<Instance>> getUserInstances(Authentication authentication) {
        return ResponseEntity.ok(instanceService.getUserInstances(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<Instance> createInstance(@RequestBody Instance instance,
                                                    Authentication authentication) {
        return ResponseEntity.ok(instanceService.createInstance(authentication.getName(), instance));
    }
}