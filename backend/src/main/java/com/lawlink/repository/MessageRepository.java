package com.lawlink.repository;

import com.lawlink.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    @Query("{ $or: [ { 'senderId': ?0 }, { 'receiverId': ?0 } ] }")
    List<Message> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(String id1, String id2);

    List<Message> findByReceiverIdAndReadFalse(String receiverId);

    long countByReceiverIdAndReadFalse(String receiverId);
}
