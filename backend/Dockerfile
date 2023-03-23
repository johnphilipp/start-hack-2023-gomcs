# Use the official Maven image as the base image
FROM maven:3.8.3-openjdk-11 as builder

# Set the working directory
WORKDIR /app

# Copy the pom.xml file into the container
COPY pom.xml ./

# Copy the source code into the container
COPY src ./src

# Build the Spring Boot application using Maven
RUN mvn clean package -DskipTests

# Use the official OpenJDK image as the base image for the final stage
FROM openjdk:19-jre-slim

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Start the Spring Boot application
CMD ["java", "-jar", "app.jar"]
