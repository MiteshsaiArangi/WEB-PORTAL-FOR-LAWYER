package com.lawlink.repository;

import com.lawlink.model.Case;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseRepository extends MongoRepository<Case, String> {
    List<Case> findByClientId(String clientId);
    List<Case> findByLawyerId(String lawyerId);
    List<Case> findByClientIdAndStatus(String clientId, String status);
    List<Case> findByLawyerIdAndStatus(String lawyerId, String status);
}
