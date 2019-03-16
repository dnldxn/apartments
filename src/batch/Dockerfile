FROM alpine:3.9

ENV CLOUD_SDK_VERSION=238.0.0
ENV KUBE_VERSION="v1.13.4"

# Downloading and Install gcloud and kubectl
ENV PATH /google-cloud-sdk/bin:$PATH
RUN apk --no-cache add curl python && \
    curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    tar xzf google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    rm google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    ln -s /lib /lib64 && \
    gcloud config set core/disable_usage_reporting true && \
    gcloud config set component_manager/disable_update_check true && \
    gcloud config set metrics/environment github_docker_image && \
    curl -L https://storage.googleapis.com/kubernetes-release/release/${KUBE_VERSION}/bin/linux/amd64/kubectl -o /google-cloud-sdk/bin/kubectl && \
    chmod +x /google-cloud-sdk/bin/kubectl && \
    apk del curl && \
    gcloud --version

WORKDIR /app
COPY run.sh /app/
RUN chmod +x /app/run.sh

CMD [ "/app/run.sh" ]
