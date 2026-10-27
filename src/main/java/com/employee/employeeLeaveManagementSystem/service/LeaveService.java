
package com.employee.service;

import com.employee.entity.Leave;
import com.employee.repository.LeaveRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;

    public LeaveService(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    // Save leave request
    public Leave saveLeave(Leave leave) {
        return leaveRepository.save(leave);
    }

    // Get all leave requests
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // Get leave request by ID
    public Optional<Leave> getLeaveById(Long id) {
        return leaveRepository.findById(id);
    }

    // Update leave request status
    public Optional<Leave> updateLeaveStatus(Long id, String status) {
        Optional<Leave> optionalLeave = leaveRepository.findById(id);

        if (optionalLeave.isPresent()) {
            Leave leave = optionalLeave.get();
            leave.setStatus(status);

            return Optional.of(leaveRepository.save(leave));
        }

        return Optional.empty();
    }

    // Delete leave request
    public void deleteLeave(Long id) {
        leaveRepository.deleteById(id);
    }
}

