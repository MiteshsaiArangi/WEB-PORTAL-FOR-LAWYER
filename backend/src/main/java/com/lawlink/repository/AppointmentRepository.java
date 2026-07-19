package com.lawlink.repository;

import com.lawlink.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByClientId(String clientId);
    List<Appointment> findByLawyerId(String lawyerId);
    List<Appointment> findByClientIdAndStatus(String clientId, String status);
    List<Appointment> findByLawyerIdAndStatus(String lawyerId, String status);
}
