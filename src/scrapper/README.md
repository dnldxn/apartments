# Scrapper

```bash
# JupyterLab Test Environment
docker run --name jupyter -it --rm -p 8888:8888 -e JUPYTER_ENABLE_LAB=yes -v %cd%:/home/jovyan/work jupyter/base-notebook start-notebook.sh

python3.6 theverge.py

docker build -t us.gcr.io/apartments-139902/apartments-scrapper .
docker push us.gcr.io/apartments-139902/apartments-api

docker run -it -e DB_HOST=a -e DB_PORT=27017 -e DB_DATABASE=a -e DB_USERNAME=a -e DB_PASSWORD=a us.gcr.io/apartments-139902/apartments-scrapper the_verge.py
```

## Build on Google Build Engine

```bash
gcloud builds submit --tag us.gcr.io/apartments-139902/apartments-scrapper .

# Clean up stored images to avoid recurring charges
gcloud container images delete us.gcr.io/apartments-139902/apartments-scrapper --force-delete-tags
```
