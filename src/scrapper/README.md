# Scrapper

```bash
# JupyterLab Test Environment
docker run --name jupyter -it --rm -p 8888:8888 -e JUPYTER_ENABLE_LAB=yes --link db:db -v %cd%:/home/jovyan/work jupyter/base-notebook start-notebook.sh

docker build -t apartments-scrapper .
```