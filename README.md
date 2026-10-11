# Progree Task 4 - Terraform & Kubernetes Orchestration

## Project Overview

This project demonstrates Infrastructure as Code (IaC),
Docker containerization, Kubernetes orchestration,
persistent storage, Ingress routing, and autoscaling.

Developed as part of the Progree DevOps Internship.

## Technologies Used

- Terraform
- Kubernetes
- Minikube
- Docker
- Node.js
- NGINX Ingress Controller
- Kubernetes Metrics Server
- Horizontal Pod Autoscaler (HPA)
- Git and GitHub

## Architecture

Client
  |
NGINX Ingress Controller
  |
Kubernetes ClusterIP Service
  |
Node.js Application Pods
  |
Kubernetes Cluster (Minikube)

Terraform manages the Kubernetes namespace.

## Project Structure

app/          - Node.js application and Dockerfile
terraform/    - Infrastructure as Code configuration
kubernetes/   - Kubernetes YAML manifests
screenshots/  - Project execution evidence

## Features

- Terraform-managed Kubernetes namespace
- Dockerized Node.js application
- Kubernetes Deployment with two initial replicas
- ClusterIP Service for internal networking
- Persistent Volume Claim (1Gi)
- NGINX Ingress hostname routing
- CPU-based Horizontal Pod Autoscaler (2-4 replicas)
- Kubernetes health checks
- Resource requests and limits

## Deployment Instructions

### 1. Start Minikube

minikube start --driver=docker --cpus=2 --memory=3072

### 2. Initialize Terraform

cd terraform
terraform init
terraform apply

### 3. Build Docker Image

cd ../app
docker build -t progree-task4-app:v2 .

### 4. Load Image into Minikube

minikube image load progree-task4-app:v2

### 5. Enable Kubernetes Addons

minikube addons enable ingress
minikube addons enable metrics-server

### 6. Deploy Kubernetes Resources

cd ..
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/pvc.yaml
kubectl apply -f kubernetes/ingress.yaml
kubectl apply -f kubernetes/hpa.yaml

### 7. Verify Deployment

kubectl get pods -n progree-task4
kubectl get svc -n progree-task4
kubectl get ingress -n progree-task4
kubectl get hpa -n progree-task4

### 8. Test Ingress

kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8085:80

In another terminal:

curl -H "Host: progree.local" http://localhost:8085/

## Persistent Storage

The project includes a 1Gi Persistent Volume Claim.

Storage persistence was tested by creating a file,
recreating a test Pod, and verifying the saved data.

## Autoscaling

HPA configuration:

- Minimum replicas: 2
- Maximum replicas: 4
- Target CPU utilization: 50%

A CPU load-testing endpoint is included for testing.
Actual scale-out depends on observed CPU utilization.

## Notes

This is a local Minikube demonstration environment.
It does not provision cloud VPC resources or a
production-grade highly available cluster.

## Author

Muhammad Fazeel Akram

DevOps Internship Project - Progree

## Final Kubernetes Verification

The following features were implemented and tested successfully:

### Infrastructure
- Terraform Kubernetes provider configured for Minikube.
- Namespace created and managed using Terraform.
- Kubernetes Deployment running two Node.js application replicas.

### Application Networking
- ClusterIP Service configured.
- NGINX Ingress configured with the hostname `progree.local`.
- NetworkPolicy applied to restrict incoming application traffic to the `ingress-nginx` namespace on TCP port 3000.
- Unauthorized test Pod traffic timed out while the NetworkPolicy was active.
- Connectivity was restored when the NetworkPolicy was removed.
- NetworkPolicy was reapplied after testing.

### Autoscaling and Availability
- Horizontal Pod Autoscaler configured with a 50% CPU utilization target.
- Minimum replicas: 2.
- Maximum replicas: 4.
- Kubernetes HPA events confirmed scaling to 4 replicas and returning to 2.
- Pod self-healing tested successfully.
- Pod Disruption Budget configured with `minAvailable: 1`.
- Preferred Pod anti-affinity configured.

### Persistent Storage
- PersistentVolumeClaim provisioned with 1Gi capacity.
- PVC status verified as Bound.
- Persistent data successfully written and read.

### Limitations
- This demonstration uses a single-node Minikube cluster.
- Pod recovery was verified, but multi-node high availability was not demonstrated.
- Terraform manages the Kubernetes namespace; application resources are managed using Kubernetes manifests.
- NetworkPolicy enforcement was verified for the tested unauthorized Pod connection.

## Verification Evidence

Screenshots and network isolation test results are available in the `screenshots/` directory.
