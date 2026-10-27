package com.employee.controller;

import com.employee.entity.Leave;
import com.employee.service.LeaveService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // Apply for leave
    @PostMapping
    public ResponseEntity<Leave> createLeave(
            @RequestBody Leave leave) {

        Leave savedLeave = leaveService.saveLeave(leave);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedLeave);
    }

    // Get all leave requests
    @GetMapping
    public ResponseEntity<List<Leave>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    // Approve or Reject leave
    @PutMapping("/{id}/status")
    public ResponseEntity<Leave> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        if (!status.equalsIgnoreCase("Approved")
                && !status.equalsIgnoreCase("Rejected")
                && !status.equalsIgnoreCase("Pending")) {
            return ResponseEntity.badRequest().build();
        }

        return leaveService.updateLeaveStatus(id, status)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

