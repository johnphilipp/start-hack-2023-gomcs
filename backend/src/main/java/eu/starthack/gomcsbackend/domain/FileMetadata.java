package eu.starthack.gomcsbackend.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class FileMetadata {

    @Id
    private String id;
    private String filename;

    public FileMetadata() {
    }

    public FileMetadata(String filename) {
        this.filename = filename;
    }

    // Getters and setters
}