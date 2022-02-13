# Apartments

This is a project I built to automatically scrape several apartment website and track the information over time.  It has several components:

1. Scrapper to pull data automatically from several different websites
2. Mongo database to store the data
3. API to serve the data
4. Web UI

## Technologies

- GKE for managed K8s
- Python scrapper
- MongoDB for storing JSON listings
- NodeJS for API and serving index.html
- Github for VC
- Helm for managing applications in K8s (MongoDB and K8S Ingress)
- ? for docker image storage
- Drone (runs inside Kubernetes) for CI

## Deployment Order

1. Set environment variables
2. Create GCP Cluster
3. Cteate Ingress Pool
4. Create firewall rule
5. K8s Apply Secrets
6. Install MongoDB through Helm
7. Deploy API service
8. Create Ingress
9. Update Ingress Controller's Helm values.yml to point to the Ingress internal IP address
10. Install Ingress Controller through Helm
11. Create firewall rule
