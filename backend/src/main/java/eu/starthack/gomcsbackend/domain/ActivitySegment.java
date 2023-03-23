package eu.starthack.gomcsbackend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ActivitySegment {
    private String activityType;
    private int distance;
    private String confidence;
    private String startTime;
    private String endTime;
}
