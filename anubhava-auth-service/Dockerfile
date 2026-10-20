# ---------- Build stage ----------
FROM eclipse-temurin:25-jdk AS build
WORKDIR /build

# Build the shared module before compiling auth-service.
COPY anubhava-common-module /build/anubhava-common-module
WORKDIR /build/anubhava-common-module
RUN chmod +x mvnw && ./mvnw clean install -DskipTests -B

WORKDIR /app
COPY anubhava-auth-service/mvnw .
COPY anubhava-auth-service/.mvn .mvn
COPY anubhava-auth-service/pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY anubhava-auth-service/src src
RUN ./mvnw clean package -DskipTests -B

# ---------- Runtime stage ----------
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
