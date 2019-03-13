# Apartments

## TODO

- Reactive layout
- Add Avion to scrapper
- Get scrapper working on k8s
- Schedule scrapper with kron
- MongoDB data backup
- HTTPS
- Log errors to Mongo
- 

## Components

- GKE for managed K8s
- Python scrapper
- MongoDB for storing JSON listings
- NodeJS for API and serving index.html
- Github for VC
- Helm for managing applications in K8s (MongoDB and K8S Ingress)
- ? for docker image storage
- Drone (runs inside Kubernetes) for CI

## Order of Deployment

1.  Set environment variables
2.  Cluster
3.  Ingress Pool
4.  Create firewall rule
5.  Secrets
6.  Install MongoDB through Helm
7.  API
8.  Create Ingress
9.  Update Ingress Controller's Helm values.yml to point to the Ingress internal IP address
10.  Install Ingress Controller through Helm
11.  Create firewall rule
