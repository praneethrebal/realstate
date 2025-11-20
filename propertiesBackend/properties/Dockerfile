# Use lightweight Java 21 image
FROM eclipse-temurin:21-jre-alpine

# Set working directory inside container
WORKDIR /app

# Copy the Spring Boot jar file from target folder to the container
COPY target/*.jar app.jar

# Expose the application port (change if your app uses a different port)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
