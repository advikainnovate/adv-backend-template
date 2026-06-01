# DealAmaze Notification Microservice

A decoupled, scalable notification processing system built with Node.js, Express, and PostgreSQL. This service handles the delivery of notifications via Email, SMS, and Push channels, triggered either via REST API or AWS SQS messages.

## 🚀 Features

*   **Multi-Channel Support**: Email (SMTP), SMS (Twilio-ready), Push (Firebase-ready).
*   **Decoupled Architecture**: Supports asynchronous processing via AWS SQS.
*   **Template Engine**: Dynamic content rendering with placeholder replacement.
*   **Repository Pattern**: Clean separation of concerns between data access and business logic.
*   **Functional Programming**: Core logic implemented using functional modules.
*   **Retry Mechanism**: Configurable retries for failed notifications.
*   **REST API**: Comprehensive endpoints for managing templates, events, and channels.
*   **Swagger Documentation**: Interactive API docs available at `/api-docs`.

## 🛠️ Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **ORM**: Sequelize
*   **Queue**: AWS SQS (`@aws-sdk/client-sqs`)
*   **Validation**: Joi
*   **Logging**: Pino
*   **Documentation**: Swagger / OpenAPI 3.0

## 📂 Project Structure

```
src/
├── config/         # Configuration (DB, AWS, SMTP)
├── database/       # Migrations, Models, Seeders
├── docs/           # Swagger JSON
├── helpers/        # Utility functions & Channel Providers
├── middlewares/    # Express middlewares
├── modules/        # Business logic (Controllers, Services, Routes)
├── repositories/   # Data access layer (Functional)
├── workers/        # SQS Consumer logic
├── app.js          # Express app setup
└── worker.js       # SQS Worker entry point
```

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd dealamaze-notifications-service
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Copy `.env.example` to `.env` and update the values.
    ```bash
    cp .env.example .env
    ```
    *Ensure you provide valid DB credentials and AWS keys.*

4.  **Database Setup**
    Run migrations to create tables.
    ```bash
    npm run prestart
    ```
    Seed the database with default channels (EMAIL, SMS, PUSH).
    ```bash
    npm run db:seed
    ```

## 🏃‍♂️ Running the Application

### API Server
Starts the REST API server (default port: 5002).
```bash
npm run dev      # Development (Nodemon)
npm start        # Production
```

### SQS Worker
Starts the background worker to consume messages from AWS SQS.
```bash
npm run worker
```

## 📖 API Documentation

Once the server is running, visit:
**http://localhost:5002/api-docs**

## 🧪 Testing

Run the test suite (if configured):
```bash
npm test
```

## ☁️ AWS SQS Integration

The service listens to two queues defined in `.env`:
*   `AWS_SQS_ORDERS_URL`: High priority (Orders, Payments)
*   `AWS_SQS_PROMOTIONS_URL`: Low priority (Marketing)

**Message Format:**
```json
{
  "eventType": "ORDER_PLACED",
  "channel": "EMAIL",
  "recipient": "user@example.com",
  "payload": {
    "name": "John Doe",
    "orderId": "12345"
  }
}
```
