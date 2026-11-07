\# 🚀 CampusConnect



\### Your Campus. Your Events. Your Community.



\*\*CampusConnect\*\* is a college event and activity management platform that helps students discover events, register for activities, and manage their participation through a centralized dashboard.



Built with a \*\*Docker-based multi-container architecture\*\*, the application uses Nginx as a gateway to connect independently running services.



<p align="center">



&#x20; !\[HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)

&#x20; !\[CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)

&#x20; !\[JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)

&#x20; !\[Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)

&#x20; !\[Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge\&logo=nginx\&logoColor=white)

&#x20; !\[Selenium](https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge\&logo=selenium\&logoColor=white)



</p>



\---



\## ✨ Key Features



\- 🎓 \*\*Explore Events\*\* – Browse college events and activities.

\- 🔍 \*\*Smart Search\*\* – Search events by title, category, and description.

\- 🏷️ \*\*Category Filters\*\* – Find events based on your interests.

\- 📝 \*\*Event Registration\*\* – Register for available events.

\- 🛡️ \*\*Duplicate Prevention\*\* – Prevent repeated registrations.

\- 📊 \*\*Student Dashboard\*\* – View registrations and statistics.

\- 📱 \*\*Responsive Design\*\* – Access the application across different screen sizes.

\- 🐳 \*\*Docker Deployment\*\* – Run the application using multiple containers.



\---



\## 🏗️ System Architecture



CampusConnect follows a \*\*multi-container architecture\*\* where each major application module runs as an independent service.



```text

&#x20;                 ┌──────────────────────┐

&#x20;                 │       Student        │

&#x20;                 └──────────┬───────────┘

&#x20;                            │

&#x20;                            ▼

&#x20;                 ┌──────────────────────┐

&#x20;                 │     NGINX Gateway    │

&#x20;                 │    localhost:8090    │

&#x20;                 └──────────┬───────────┘

&#x20;                            │

&#x20;          ┌─────────────────┼─────────────────┐

&#x20;          │                 │                 │

&#x20;          ▼                 ▼                 ▼

&#x20;     ┌─────────┐      ┌───────────┐     ┌──────────────┐

&#x20;     │  Home   │      │  Events   │     │ Registration │

&#x20;     │ Service │      │  Service  │     │   Service    │

&#x20;     └─────────┘      └───────────┘     └──────────────┘

&#x20;          │                 │                 │

&#x20;          └─────────────────┼─────────────────┘

&#x20;                            │

&#x20;                            ▼

&#x20;                    ┌─────────────┐

&#x20;                    │  Dashboard  │

&#x20;                    │   Service   │

&#x20;                    └─────────────┘



&#x20;             All services managed by

&#x20;                  Docker Compose

```



\### 🧩 Application Services



| Service | Responsibility |

|---|---|

| 🏠 Home | Displays the main landing page |

| 📅 Events | Event listing, search, and filtering |

| 📝 Registration | Handles student registrations |

| 📊 Dashboard | Displays registration details and statistics |

| 🌐 Gateway | Routes requests using Nginx |



\---



\## 🛠️ Tech Stack



| Technology | Purpose |

|---|---|

| HTML5 | Application structure |

| CSS3 | Styling and responsive layouts |

| JavaScript | Client-side functionality |

| Docker | Containerization |

| Docker Compose | Multi-container orchestration |

| Nginx | Web server and reverse proxy |

| Python | Automated test execution |

| Selenium | Browser automation testing |

| Git \& GitHub | Version control and collaboration |

| Jenkins | CI tooling |



\---



\## ⚙️ Getting Started



Follow these steps to run CampusConnect locally.



\### Prerequisites



Make sure you have installed:



\- \[Git](https://git-scm.com/)

\- \[Docker Desktop](https://www.docker.com/products/docker-desktop/)

\- \[Python](https://www.python.org/)



\### 1. Clone the Repository



```bash

git clone https://github.com/bmanikanta-git/CampusConnect.git

```



\### 2. Navigate to the Project



```bash

cd CampusConnect

```



\### 3. Build and Start Containers



```bash

docker compose up -d --build

```



\### 4. Open the Application



Visit:



\*\*http://localhost:8090\*\*



\---



\## 🔗 Application URLs



| Module | URL |

|---|---|

| 🏠 Home | \[localhost:8090](http://localhost:8090/) |

| 📅 Events | \[localhost:8090/events/](http://localhost:8090/events/) |

| 📝 Registration | \[localhost:8090/register/](http://localhost:8090/register/) |

| 📊 Dashboard | \[localhost:8090/dashboard/](http://localhost:8090/dashboard/) |



\---



\## 🧪 Automated Testing



CampusConnect includes Selenium-based automated tests to validate important application features.



\### Run the Test Suite



```bash

python -m unittest discover -s tests/selenium -p "test\_\*.py" -v

```



\### Test Coverage



\- Application page loading

\- Navigation between services

\- Student registration

\- Duplicate registration prevention

\- Event search functionality

\- Category filtering

\- Invalid input validation

\- Dashboard statistics

\- Unregistration functionality

\- Service failure and recovery



\*\*Latest integration test result: 12 tests passed.\*\*



\---



\## 🐳 Docker Management



Useful commands for managing the application:



| Command | Description |

|---|---|

| `docker compose up -d --build` | Build and start services |

| `docker compose ps` | View container status |

| `docker compose logs` | View service logs |

| `docker compose down` | Stop and remove containers |

| `docker compose restart` | Restart services |



\---



\## 📁 Project Structure



```text

CampusConnect/

│

├── home/

│   └── public/

│

├── events/

│   └── public/

│

├── registration/

│   └── public/

│

├── dashboard/

│   └── public/

│

├── gateway/

│   └── nginx.conf

│

├── tests/

│   └── selenium/

│

├── docker-compose.yml

└── README.md

```



\---



\## 👥 Project Team



CampusConnect is developed as a collaborative academic DevOps project.



\---



\## 🎯 Project Objective



The main objective of CampusConnect is to provide a centralized platform for college event management while demonstrating practical DevOps concepts such as containerization, service separation, reverse proxy configuration, automated testing, and version control.



\---



<p align="center">



&#x20; \*\*Built with 💻 and ☕ for a better campus experience.\*\*



&#x20; ⭐ If you find this project interesting, consider giving it a star!



</p>

