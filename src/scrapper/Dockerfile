FROM python:3.7-alpine as base


FROM base as builder

RUN mkdir /install
WORKDIR /install

# Install app dependencies
COPY requirements.txt /requirements.txt
RUN pip install --install-option="--prefix=/install" -r /requirements.txt


FROM base

COPY --from=builder /install /usr/local
WORKDIR /app
COPY *.py /app/

ENTRYPOINT [ "python" ]
