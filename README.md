# Lead Management Kanban Board & Real-Time Updates

![React](https://img.shields.io/badge/React-19.1.0-blue)
![Django](https://img.shields.io/badge/Django-5.1.5-green)
![WebSockets](https://img.shields.io/badge/WebSockets-Django%20Channels-yellow)
![Redis](https://img.shields.io/badge/Redis-Docker-orange)

A responsive lead management system featuring a form page and interactive Kanban board with real-time updates via WebSockets.

## Features

- **Form Page**: Add or edit lead details with validation.
- **Kanban Board**: Drag-and-drop interface for managing leads in different stages.
- **Real-Time Updates**: Instant synchronization across all clients using WebSockets.
- **Responsive Design**: Works on both desktop and mobile devices.
- **AI-Assisted Development**: Leveraged DeepSeek and ChatGPT for code generation and optimization.

## Tech Stack
Tech Stack
 **React.js**: A JavaScript library for building user interfaces, providing a component-based structure and efficient state management.
 **Bootstrap**: A front-end framework that ensures responsive and visually appealing UI with pre-built components and styling.
 **HTML & CSS**: Fundamental technologies for structuring and styling the web application, ensuring a clean and consistent design.
 **Django**: A high-level Python web framework that simplifies backend development with built-in authentication, ORM, and security features.
 **WebSockets**: Enables real-time, bidirectional communication between the server and clients, ensuring instant updates in the application.

Docker: A containerization platform that allows the application to run in isolated environments, making deployment consistent and scalable.
### Frontend
- React 19
- TypeScript
- React Bootstrap
- DnD Kit (for drag-and-drop functionality)
- Axios (for API calls)
- Vite (build tool)

### Backend
- Django 5
- Django REST Framework
- Django Channels (WebSockets)
- Redis (via Docker)

## Prerequisites

- Node.js (v18+ recommended)
- Python (3.10+ recommended)
- Docker (for Redis)
- npm (v9+ recommended)
- pip (v24+ recommended)

## Installation
## Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/abdullahashraf12/Lead-Management-Kanban.git
cd Lead-Management-Kanban-Board-Real-Time-Updates
```

### 2. Activate Venv & Navigating To The Project Folder
```bash
./venv/Scripts/Activate
cd LightweightCRMFeature
```
### 3. Set Up Frontend
In a new terminal, navigate to the UI folder:
```bash
cd Lead-Management-Kanban-Board-Real-Time-Updates\LightweightCRMFeature\Lightweight_CRM_Feature
```
### Make sure Vite is installed by running:
```bash
npm install
npm run dev
npm install vite # if error says module not found (vite) not installed Now Rerun the wollowing command
npm run dev
```
### 4. Set Up Backend
Make sure Redis is installed after Docker installation. Check any YouTube tutorial if you're unsure.

Now, in the backend folder:
```bash
cd Lead-Management-Kanban-Board-Real-Time-Updates\LightweightCRMFeature
python manage.py runserver 127.0.0.1:80

```
## That's All





