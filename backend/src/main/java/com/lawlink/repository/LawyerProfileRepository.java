package com.lawlink.repository;

import com.lawlink.model.LawyerProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LawyerProfileRepository extends MongoRepository<LawyerProfile, String> {
    Optional<LawyerProfile> findByUserId(String userId);
    Optional<LawyerProfile> findByBarNumber(String barNumber);
    List<LawyerProfile> findBySpecialization(String specialization);
    List<LawyerProfile> findByAvailableTrue();
    List<LawyerProfile> findByVerificationStatus(String verificationStatus);
    List<LawyerProfile> findByVerifiedAndAvailableTrue(boolean verified);
    List<LawyerProfile> findByVerifiedAndSpecialization(boolean verified, String specialization);
    List<LawyerProfile> findByVerifiedAndCity(boolean verified, String city);
    List<LawyerProfile> findByVerifiedAndState(boolean verified, String state);

    @Query("{ $and: [ { 'verified': true }, { $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'specialization': { $regex: ?0, $options: 'i' } } ] } ] }")
    List<LawyerProfile> searchByNameOrSpecialization(String keyword);
}
