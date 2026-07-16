# 🚀 High Availability 3-Tier Application on AWS

A production-inspired **High Availability 3-Tier Application** deployed on AWS using **Terraform**, **Docker**, **GitHub Actions**, **Amazon ECR**, **Application Load Balancer (ALB)**, **Auto Scaling Groups (ASG)**, **Launch Templates**, and **Amazon RDS**.

The infrastructure is provisioned using **Terraform**, while **GitHub Actions** automates the complete CI/CD pipeline. Docker images are built, tested, pushed to Amazon ECR, and deployed automatically using **Auto Scaling Instance Refresh**, providing rolling deployments with minimal downtime.

## 📷 Architecture Diagrams

- CI/CD Pipeline for Automated Docker Deployment
- High Availability 3-Tier Application Request Flow
---

![alt text](<Untitled - 16 July 2026 at 22.06.53.gif>)


## 📌 Architecture

- High Availability across **2 Availability Zones**
- Custom VPC
- Public & Private Subnets
- Internet Gateway
- NAT Gateway
- Application Load Balancer
- Frontend Auto Scaling Group
- Backend Auto Scaling Group
- Launch Templates
- Amazon RDS MySQL
- Amazon ECR
- CloudWatch Dashboard
- CloudWatch Alarms
- SNS Email Notifications

---

## 🚀 Features

- Infrastructure as Code using Terraform
- High Availability Architecture
- Dockerized Frontend & Backend
- Automated CI/CD with GitHub Actions
- Automated Docker Image Deployment
- Amazon ECR Integration
- Rolling Deployment using Auto Scaling Instance Refresh
- IAM Roles & Instance Profiles
- Path-Based Routing using ALB
- Amazon RDS MySQL
- CloudWatch Monitoring
- SNS Email Notifications
- Manual Rollback using Docker Image Tags

---

## 🛠️ Tech Stack

- AWS
- Terraform
- Docker
- GitHub Actions
- Amazon ECR
- EC2
- Auto Scaling Groups
- Launch Templates
- Application Load Balancer
- IAM
- Amazon RDS
- CloudWatch
- SNS
- React
- Node.js
- MySQL

---

## ⚙️ Infrastructure Provisioned by Terraform

- VPC
- Public & Private Subnets
- Internet Gateway
- NAT Gateway
- Route Tables
- Security Groups
- Application Load Balancer
- Target Groups
- Launch Templates
- Auto Scaling Groups
- IAM Roles & Instance Profiles
- Amazon ECR Repositories
- Amazon RDS MySQL
- CloudWatch Dashboard
- CloudWatch Alarms
- SNS Topic & Email Subscription

---

## 🔄 CI/CD Workflow

1. Push Code to GitHub
2. GitHub Actions Triggered
3. Run Application Tests
4. Build Docker Images
5. Tag Images (`latest` + `github.sha`)
6. Push Images to Amazon ECR
7. Start Auto Scaling Instance Refresh
8. Launch New EC2 Instances
9. User Data Pulls Latest Docker Image
10. Containers Start Automatically
11. Health Checks Pass
12. Old EC2 Instances are Terminated

---

## 🌐 Application Request Flow

User

↓

Application Load Balancer

↓

Frontend Target Group

↓

Frontend EC2 (Managed by ASG)

↓

Backend Target Group

↓

Backend EC2 (Managed by ASG)

↓

Amazon RDS MySQL

---

## 📊 Monitoring

CloudWatch Dashboard monitors:

- Frontend ASG CPU Utilization
- Backend ASG CPU Utilization
- Frontend Healthy Hosts
- Backend Healthy Hosts
- Application Load Balancer Request Count
- Amazon RDS CPU Utilization

CloudWatch Alarms notify through Amazon SNS.

---

## 🔄 Rollback Strategy

Each deployment stores Docker images using:

- `latest`
- `github.sha`

If a deployment fails:

1. Retag a previous stable SHA image as `latest`
2. Start an Auto Scaling Instance Refresh
3. New EC2 instances automatically deploy the previous stable version

---

## 🧩 Challenges Solved

- Terraform Remote Backend Configuration
- S3 State Locking
- IAM Trust Policy Configuration
- Amazon ECR Authentication
- Launch Template User Data
- Base64 Encoding Issues
- Docker Authentication
- Auto Scaling Instance Refresh
- ALB Target Health Troubleshooting
- GitHub Actions Deployment Automation

---

## 📚 Skills Demonstrated

- AWS Networking
- Infrastructure as Code
- High Availability Architecture
- Docker
- GitHub Actions
- CI/CD Automation
- Auto Scaling
- Launch Templates
- Rolling Deployments
- Cloud Monitoring
- Infrastructure Automation
- DevOps Best Practices

---


## 🚀 Future Improvements

- Automatic Rollback
- AWS Secrets Manager
- Blue/Green Deployment
- ECS Migration
- End-to-End Integration Testing

---

## GitHub

https://github.com/Kartik71845


## LinkedIn

https://www.linkedin.com/in/kartik-bhandari-623622319/

## ⭐ If you found this project helpful, consider giving it a star!