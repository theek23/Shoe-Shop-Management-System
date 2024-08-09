
# Shoe Shop Management System

Welcome to the Shoe Shop Management System repository! This project is a comprehensive web application designed to streamline the management of a shoe shop, including inventory, orders, customers, and more.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

The Shoe Shop Management System offers the following features:

- **Product Management**: Add, update, and delete shoe products with details like price, size, and stock availability.
- **Customer Management**: Handle customer data and manage interactions.
- **Order Management**: Process customer orders and track their status from creation to fulfillment.
- **Inventory Management**: Monitor stock levels, receive notifications for low stock, and manage inventory efficiently.
- **User Authentication**: Secure user login and role-based access control for different sections of the application.
- **Reporting**: Generate and view reports on sales, inventory levels, and customer activity.

## Technologies Used

- **Backend**: 
  - **Java**: The main programming language for backend development.
  - **Spring Boot**: Framework for building the backend RESTful services.
  - **Spring Data JPA**: For database interactions and ORM.
  - **ModelMapper**: For mapping between entities and DTOs.
  - **MySQL**: Database for storing application data.

- **Frontend**: 
  - **HTML/CSS**: For structuring and styling the web pages.

- **Others**:
  - **Maven**: For managing dependencies and building the project.
  - **Git**: For version control.

## Installation

To set up the Shoe Shop Management System locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/theek23/Shoe-Shop-Management-System.git
   cd Shoe-Shop-Management-System
   ```

2. **Backend Setup**:

   - Navigate to the `/backend` directory:

     ```bash
     cd backend
     ```

   - Install dependencies and build the project using Maven or Gradle:

     ```bash
     mvn clean install
     ```

   - Configure the database connection in the `application.properties` or `application.yml` file with your database credentials.

   - Run the Spring Boot application:

     ```bash
     mvn spring-boot:run
     ```

3. **Frontend Setup**:

   - Navigate to the `/frontend` directory:

     ```bash
     cd ../frontend
     ```

   - Install the required dependencies using npm or yarn:

     ```bash
     npm install
     ```

   - Start the development server:

     ```bash
     npm start
     ```

4. **Access the Application**:

   - Open your browser and go to `http://localhost:3000` (or the specified port) to access the application.

## Usage

- **Admin Dashboard**: Access the admin dashboard to manage products, orders, and customers.
- **User Login**: Users can log in to access different features based on their roles.
- **Order Processing**: Create, view, and update orders as per customer requests.
- **Inventory Monitoring**: Check stock levels and receive alerts for restocking.

## Contributing

Contributions are welcome! To contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request detailing your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
