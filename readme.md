# Lendsqr MVP Wallet Service

A robust, secure Minimum Viable Product (MVP) wallet API built for Demo Credit, a mobile lending application. This service allows users to onboard, fund their wallets, transfer money, and withdraw funds safely.

## 🚀 Tech Stack
*   **Runtime:** Node.js (LTS)
*   **Language:** TypeScript
*   **Database:** MySQL
*   **Query Builder & ORM:** Knex.js
*   **Testing:** Jest & Supertest

## 📐 Architecture & E-R Diagram
The application follows a Service-Oriented Architecture (Controllers, Services, Middlewares, and Routes) to maintain DRY principles and separation of concerns.

**Entity-Relationship Diagram:**
![E-R Diagram](https://dbdesigner.page.link/LNnLoQPBkDoa6YZZ7)
*(Or place the public link to your diagram here)*

## 🔐 Core Features & Transaction Scoping
*   **Adjutor Karma Validation:** Integrates with Lendsqr's Karma API to block blacklisted identities during onboarding.
*   **ACID Compliance:** All financial operations (`fund`, `transfer`, `withdraw`) are executed within strict database transactions.
*   **Pessimistic Locking:** Utilizes Knex's `.forUpdate()` row-level locking to prevent race conditions and double-spending during concurrent transfer requests.
*   **Faux Token Auth:** API endpoints are secured using a simulated Bearer token authorization system.

## 🛠️ Local Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd lendsqr-wallet-service
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   Create a `.env` file in the root directory and configure:
   \`\`\`env
   DB_HOST=127.0.0.1
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=lendsqr_db
   ADJUTOR_API_KEY=your_lendsqr_api_key
   PORT=3000
   \`\`\`

4. **Database Setup & Migrations**
   Ensure MySQL is running, create the database, and run migrations:
   \`\`\`bash
   npx knex migrate:latest
   \`\`\`

5. **Run the Server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Run Tests**
   \`\`\`bash
   npm run test
   \`\`\`

## 📄 Written Reports
The detailed **Security Assessment** and **Failure Handling & Debugging Assessment** can be found here: https://docs.google.com/document/d/1kJkbKT1RwPgK-R9uvrpjJrz2iqtFKuqDuJcG4_JtBv8/edit?usp=sharing