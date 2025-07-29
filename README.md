# Queue Management Platform MVP

A modern, full-stack queue management system designed for small service-based businesses like barbershops, clinics, and repair shops.

---

## 🚀 Features

### Core Functionality

- **PIN-based Employee Check-in**: No accounts required for employees  
- **Customer Queue Management**: Walk-in check-in via kiosk or receptionist  
- **Automated Assignment Logic**: Stick & Serve or Flow & Flex modes  
- **Customizable Workflows**: Define your business process steps  
- **Real-time Updates**: WebSocket-powered live queue status  
- **Email Notifications**: Optional customer notifications  
- **Multi-tenant Support**: Secure business data separation  

### User Roles

- **Admin**: Full dashboard access with secure login  
- **Employee**: PIN-based access to assigned customers  
- **Customer**: Simple check-in process with queue tracking  

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, Socket.io-client, React Router  
- **Backend**: Node.js, Express, PostgreSQL, Sequelize, Socket.io  
- **Styling**: Custom CSS with design tokens  
- **Authentication**: JWT for admins, PIN for employees  

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+  
- PostgreSQL 14+  
- npm or yarn  

### Installation

#### Clone the repository

```bash
git clone <repository-url>
cd queue-management-platform


