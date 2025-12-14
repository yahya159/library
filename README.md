# Library Microservices - Online Library Management System

A simple, clean backend-only microservices architecture for managing an online library system.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│  Client Apps    │────▶│   API Gateway    │
│                 │     │     (8080)       │
└─────────────────┘     └────────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              ┌─────▼────┐ ┌─────▼────┐ ┌────▼──────┐
              │  Book    │ │  Loan    │ │  Recom-   │
              │  Service │ │  Service │ │  mendation│
              │  (8081)  │ │  (8082)  │ │  (8083)   │
              └─────┬────┘ └─────┬────┘ └────┬──────┘
                    │            │            │
                    └─────┬──────┴────────────┘
                          │ PostgreSQL
                          ▼
                    ┌──────────┐
                    │librarydb │
                    └──────────┘
```

All services register with **Eureka Discovery Service** (8761).

## Tech Stack

- **Spring Boot 3.2** - Core framework
- **Spring Data JPA** - Database access
- **Spring Data REST** - Auto-expose REST endpoints
- **OpenFeign** - Inter-service communication
- **Eureka** - Service discovery
- **PostgreSQL** - Production-ready database
- **Bean Validation** - Input validation

## Services

| Service | Port | Description |
|---------|------|-------------|
| Discovery Service | 8761 | Eureka Server for service registration |
| API Gateway | 8080 | Routes requests to microservices |
| Book Service | 8081 | Manages books and authors |
| Loan Service | 8082 | Manages book loans |
| Recommendation Service | 8083 | Provides book recommendations |

## Prerequisites

- Java 17+
- Maven 3.8+
- PostgreSQL 14+ (running on localhost:5432)

## Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create the database**:
   ```sql
   CREATE DATABASE librarydb;
   ```
3. **Default credentials** (can be changed in application.yml):
   - Username: `postgres`
   - Password: `postgres`

## How to Build

```bash
# Build all services
mvn clean compile

# Package all services
mvn clean package -DskipTests
```

## How to Run

Start services in this order:

```bash
# 1. Start Discovery Service (Eureka)
cd discovery-service
mvn spring-boot:run

# 2. Start API Gateway
cd api-gateway
mvn spring-boot:run

# 3. Start Book Service
cd book-service
mvn spring-boot:run

# 4. Start Loan Service
cd loan-service
mvn spring-boot:run

# 5. Start Recommendation Service
cd recommendation-service
mvn spring-boot:run
```

## API Endpoints

### Eureka Dashboard
- `GET http://localhost:8761` - View registered services

### Book Service (via Gateway)
```bash
# Create author
POST http://localhost:8080/book-service/api/authors
Body: {"name": "Victor Hugo", "nationality": "French"}

# Get all authors
GET http://localhost:8080/book-service/api/authors

# Create book
POST http://localhost:8080/book-service/api/books
Body: {"title": "Les Misérables", "isbn": "978-0-1234-5678-9", "publicationYear": 1862, "authorId": 1}

# Get all books
GET http://localhost:8080/book-service/api/books
```

### Loan Service (via Gateway)
```bash
# Create loan
POST http://localhost:8080/loan-service/api/loans
Body: {"bookId": 1, "borrowerName": "John Doe"}

# Get all loans
GET http://localhost:8080/loan-service/api/loans

# Get active loans
GET http://localhost:8080/loan-service/api/loans/active

# Return a book
PUT http://localhost:8080/loan-service/api/loans/1/return
```

### Recommendation Service (via Gateway)
```bash
# Get random recommendations
GET http://localhost:8080/recommendation-service/api/recommendations?count=5

# Get recommendations by author
GET http://localhost:8080/recommendation-service/api/recommendations/author/Hugo

# Get recent publications
GET http://localhost:8080/recommendation-service/api/recommendations/recent
```

## Project Structure

```
library/
├── pom.xml                          # Parent POM
├── discovery-service/               # Eureka Server
├── api-gateway/                     # Spring Cloud Gateway
├── book-service/                    # Books & Authors management
│   └── src/main/java/com/library/book/
│       ├── entity/                  # Book, Author entities
│       ├── repository/              # JPA repositories
│       └── controller/              # REST controllers
├── loan-service/                    # Loan management
│   └── src/main/java/com/library/loan/
│       ├── entity/                  # Loan entity
│       ├── repository/              # JPA repository
│       ├── client/                  # FeignClient to Book Service
│       ├── dto/                     # Data transfer objects
│       └── controller/              # REST controller
└── recommendation-service/          # Recommendations (Extension)
    └── src/main/java/com/library/recommendation/
        ├── client/                  # FeignClient to Book Service
        ├── dto/                     # Data transfer objects
        ├── service/                 # Recommendation logic
        └── controller/              # REST controller
```

## Features

- **Input Validation**: All entities are validated using Bean Validation annotations
- **Structured Logging**: Controllers include SLF4J logging for debugging
- **Error Handling**: Proper HTTP status codes returned for all operations
- **Inter-service Communication**: Feign clients for seamless service-to-service calls
