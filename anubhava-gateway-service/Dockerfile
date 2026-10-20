# ---------- Build stage ----------
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

COPY anubhava-gateway-service/mvnw .
COPY anubhava-gateway-service/.mvn .mvn
COPY anubhava-gateway-service/pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY anubhava-gateway-service/src src
RUN ./mvnw clean package -DskipTests -B

# ---------- Runtime stage ----------
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
