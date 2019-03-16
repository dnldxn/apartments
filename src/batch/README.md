# Batch

```bash
docker build -t us.gcr.io/apartments-139902/apartments-batch .
docker push us.gcr.io/apartments-139902/apartments-batch
gcloud container images list-tags us.gcr.io/apartments-139902/apartments-batch

docker run -it --rm ^
-e CLUSTER_NAME=apartments -e DB_HOST=%DB_HOST% -e DB_PORT=%DB_PORT% -e DB_DATABASE=%DB_DATABASE% -e DB_USERNAME=%DB_USERNAME% -e DB_PASSWORD=%DB_PASSWORD% ^
-v %cd%/apartments-139902-86971d7acd22.json:/app/apartments-139902-key.json:ro ^
us.gcr.io/apartments-139902/apartments-batch /bin/sh
```

## Build on Google Build Engine

```bash
gcloud builds submit --tag us.gcr.io/apartments-139902/apartments-batch .

# Clean up stored images to avoid recurring charges
gcloud container images delete us.gcr.io/apartments-139902/apartments-batch --force-delete-tags
```

## Manually Run CronJob

```bash
kubectl create job --from=cronjob/batch-cron-job batch-cron-job-manual-001
```
