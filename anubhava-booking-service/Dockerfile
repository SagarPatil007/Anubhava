# ---------- Build stage ----------
FROM eclipse-temurin:25-jdk AS build
WORKDIR /build

# --- Step 1: build & install the shared common module into local .m2 ---
COPY anubhava-common-module /build/anubhava-common-module
WORKDIR /build/anubhava-common-module
RUN chmod +x mvnw && ./mvnw clean install -DskipTests -B

# --- Step 2: build booking-service, which can now resolve the dependency ---
WORKDIR /app
COPY anubhava-booking-service/mvnw .
COPY anubhava-booking-service/.mvn .mvn
COPY anubhava-booking-service/pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY anubhava-booking-service/src src
RUN ./mvnw clean package -DskipTests -B

# ---------- Runtime stage ----------
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]