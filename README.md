# Retail Inventory Management

A full-stack retail inventory management application built with a **Spring Boot REST API**, **PostgreSQL**, and an **Angular frontend**.

The application provides authentication and inventory workflows for products, product variants, categories, suppliers, warehouses, stock movements, and inventory records.

## Technology Stack

### Backend

- Java 17+

- Spring Boot 4.1.1

- Spring Web MVC

- Spring Data JPA / Hibernate

- Spring Security

- JWT authentication

- PostgreSQL

- Maven Wrapper

- Lombok

### Frontend

- Angular 21

- TypeScript

- Tailwind CSS 4

- Lucide Angular

- Angular standalone components

- Reactive forms and route guards

## Repository Structure

```
.
├── src/
│   ├── main/java/                         # Spring Boot application source
│   │   ├── config/                        # CORS and security configuration
│   │   ├── controller/                    # REST controllers
│   │   ├── entity/                        # JPA entities
│   │   ├── repository/                    # Spring Data repositories
│   │   ├── security/                      # JWT and authentication components
│   │   └── service/                       # Service interfaces and implementations
│   ├── main/resources/application.properties
│   └── test/                              # Backend tests
├── frontend/retailstock-angular/         # Angular application
├── .github/workflows/ci.yml              # GitHub Actions CI workflow
├── pom.xml                               # Maven project configuration
├── mvnw                                  # Unix Maven wrapper
└── mvnw.cmd                              # Windows Maven wrapper
```

## Prerequisites

Install the following before running the project locally:

- Java 17 or later

- PostgreSQL 14 or later

- Node.js 22 or later

- npm 10 or later

- Git

## Database Setup

Create a PostgreSQL database and user, or use an existing PostgreSQL installation.

Example using the PostgreSQL command line:

```sql
CREATE DATABASE retail_inventory_managment;
CREATE USER retail_app WITH PASSWORD 'change-this-password';
GRANT ALL PRIVILEGES ON DATABASE retail_inventory_managment TO retail_app;
```

For PostgreSQL 15 or later, connect to the database and grant schema permissions if required:

```sql
\c retail_inventory_managment
GRANT ALL ON SCHEMA public TO retail_app;
```

> Never commit real database passwords to the repository. Use environment variables locally and GitHub Actions Secrets in CI.


### Linux/macOS

```bash
export DB_CLASS_NAME=org.postgresql.Driver
export DB_URL=jdbc:postgresql://localhost:5432/retail_inventory_managment
export DB_USERNAME=retail_app
export DB_PASS='change-this-password'
```

### Windows PowerShell

```
$env:DB_CLASS_NAME = "org.postgresql.Driver"
$env:DB_URL = "jdbc:postgresql://localhost:5432/retail_inventory_managment"
$env:DB_USERNAME = "retail_app"
$env:DB_PASS = "change-this-password"
```

Hibernate is currently configured with `ddl-auto=update`, so the application updates the schema from the JPA entities during startup. For production deployments, use a migration tool such as Flyway or Liquibase and review this setting before deployment.

## Run the Backend

From the repository root:

```bash
# Linux/macOS
chmod +x mvnw
./mvnw spring-boot:run
```

On Windows:

```
.\mvnw.cmd spring-boot:run
```

The backend starts on:

```
http://localhost:8080
```

## Run the Frontend

Open a second terminal and run:

```bash
cd frontend/retailstock-angular
npm install
npm start
```

The Angular application starts on:

```
http://localhost:4200
```

The frontend uses `src/environments/environment.ts` to locate the backend API. The default API URL is:

```typescript
apiUrl: 'http://localhost:8080'
```

If the backend is hosted elsewhere, update this value before starting the frontend.

## Authentication

The API uses stateless JWT authentication.

- Registration and login are publicly accessible.

- Protected API routes require a valid JWT.

- The frontend stores and sends the token through its authentication and API services.

- Deactivating a user requires the `ADMIN` role.

- Passwords are encoded with BCrypt.

Public authentication endpoints:

```
POST /api/auth/register
POST /api/auth/login
```

## API Overview

All routes are served by the backend at `http://localhost:8080`.

| Resource | Base route | Supported operations |
| --- | --- | --- |
| Authentication and users | `/api/auth` | Register, login, get user, list users, update user, deactivate user |
| Categories | `/api/categories` | Create, list, get by ID, update |
| Products | `/api/auth` | Create product, list products, get product, update product |
| Product variants | `/api/product-variants` | Create, list, get by ID, filter by product, update |
| Inventory | `/api/inventory` | Create, list, get by ID, filter by product or warehouse, update, delete |
| Stock movements | `/api/stock-movements` | Create, list, get by ID, filter by product or warehouse |
| Suppliers | `/api/suppliers` | Create, list, get by ID, update, delete |
| Supplier products | `/api/supplier-products` | Create, list, get by ID, filter by supplier or product, update, delete |
| Warehouses | `/api/warehouses` | Create, list, get by ID, update |

Most routes require authentication. Use the JWT returned by the login endpoint in the request header:

```
Authorization: Bearer <your-jwt-token>
```

## Testing

### Backend tests

```bash
./mvnw test
```

On Windows:

```
.\mvnw.cmd test
```

Backend tests require a PostgreSQL database because the application datasource is configured through environment variables.

### Frontend build

```bash
cd frontend/retailstock-angular
npm install
npm run build
```

### Frontend tests

The Angular test command is available through the project scripts:

```bash
cd frontend/retailstock-angular
npm test
```

## GitHub Actions CI

The workflow at [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs automatically for pushes and pull requests targeting `main` or `master`.

It performs the following checks:

1. Starts a temporary PostgreSQL 16 service.

1. Runs the Spring Boot/Maven test suite on Java 17.

1. Installs Angular dependencies.

1. Builds the Angular application for production.

The CI database is temporary and is not your local database. If you later connect CI to an external database, store the connection values under **Repository Settings → Secrets and variables → Actions** rather than placing passwords in the workflow file.

> The current frontend lockfile is out of sync with `package.json`, so the workflow currently uses `npm install`. After regenerating and committing a synchronized lockfile, change the workflow to a frozen install for more reproducible builds.

## Common Troubleshooting

### Database connection failure

Check that PostgreSQL is running and that all four variables are set in the same terminal where the backend is started:

```bash
env | grep '^DB_'
```

Also verify that the database exists and that the username has access to the `public` schema.

### Port already in use

The backend uses port `8080` and the frontend uses port `4200`. Stop the process using the port or configure a different port before starting the application.

### CORS errors

The backend includes CORS configuration for frontend communication. If the frontend is served from a different origin, review `CorsConfig.java` and add the required origin.

### Maven wrapper permission denied

On Linux/macOS, run:

```bash
chmod +x mvnw
```

## Security Notes

- Do not commit `.env` files, passwords, JWT secrets, or database connection strings containing credentials.

- Rotate any database password that has been exposed publicly.

- Use HTTPS in production.

- Replace `ddl-auto=update` with a reviewed migration strategy for production.

- Restrict CORS origins to trusted frontend domains before deployment.

## License

No license file is currently included in this repository. Add a license before distributing the project publicly.
