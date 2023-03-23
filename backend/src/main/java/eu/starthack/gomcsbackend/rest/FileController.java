package eu.starthack.gomcsbackend.rest;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import eu.starthack.gomcsbackend.repository.FileStorageService;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;


@RestController
public class FileController {


    private final MongoTemplate mongoTemplate;

    public FileController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostMapping("/uploadTimeline")
    public ResponseEntity<String> uploadZip(@RequestParam("file") @NotNull MultipartFile file) {
        if (!file.getContentType().equals("application/zip")) {
            return ResponseEntity.badRequest().body("Invalid file type, please upload a ZIP file.");
        }

        try (ZipInputStream zipIn = new ZipInputStream(file.getInputStream())) {

            ZipEntry entry = zipIn.getNextEntry();
            List<DBObject> dbObjects = new ArrayList<>();

            while (entry != null) {

                if (!entry.isDirectory() && entry.getName().endsWith(".json")) {
                    String content = IOUtils.toString(zipIn, StandardCharsets.UTF_8);
                    DBObject dbObject = BasicDBObject.parse(content);
                    dbObjects.add(dbObject);
                }

                zipIn.closeEntry();
                entry = zipIn.getNextEntry();
            }

            mongoTemplate.insert(dbObjects, "timeline");

            return ResponseEntity.ok("Successfully uploaded " + dbObjects.size() + " documents to MongoDB!");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process zip file: " + e.getMessage());
        }
    }
}