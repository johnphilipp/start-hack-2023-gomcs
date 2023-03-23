package eu.starthack.gomcsbackend.repository;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.bson.Document;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class FileStorageService {

    private final GridFSBucket gridFSBucket;

    @Autowired
    public FileStorageService(MongoTemplate mongoTemplate) {
        this.gridFSBucket = GridFSBuckets.create(mongoTemplate.getDb());
    }

    public String store(InputStream inputStream, String filename) {
        GridFSUploadOptions options = new GridFSUploadOptions()
                .metadata(new Document("type", "file"));

        return gridFSBucket.uploadFromStream(filename, inputStream, options).toString();
    }
}