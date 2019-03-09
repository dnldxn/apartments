# Scrapper

```bash
# JupyterLab Test Environment
docker run --name jupyter -it --rm -p 8888:8888 -e JUPYTER_ENABLE_LAB=yes --link db:db -v %cd%:/home/jovyan/work jupyter/base-notebook start-notebook.sh

python3.6 theverge.py

docker build -t apartments-scrapper .
```

## Build on Google Build Engine

```bash
gcloud builds submit --tag us.gcr.io/apartments-139902/apartments-scrapper .

# Clean up stored images to avoid recurring charges
gcloud container images delete us.gcr.io/apartments-139902/apartments-scrapper --force-delete-tags
```
