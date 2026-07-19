package com.lawlink.dto;

import lombok.Data;

@Data
public class DashboardResponse {
    private long totalAppointments;
    private long pendingAppointments;
    private long activeCases;
    private long unreadMessages;
}
