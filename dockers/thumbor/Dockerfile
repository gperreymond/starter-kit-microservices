FROM alpine:3.8

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN apk add --no-cache --virtual .build-deps \
        cairo-dev \
        curl-dev \
        gcc \
        libc-dev \
        libjpeg-turbo-dev \
        libffi-dev \
        libressl-dev \
        libwebp-dev \
        python-dev \
        tiff-dev \
        zlib-dev

RUN apk add --no-cache \
        cairo \
        coreutils \
        exiftool \
        ffmpeg \
        gifsicle \
        imagemagick \
        libcurl \
        libjpeg-turbo  \
        libvpx \
        libwebp \
        python \
        py-pip \
        tiff \
        zlib

RUN pip install --upgrade pip && \
    pip install --no-cache-dir thumbor==6.7.0 envtpl==0.6.0 tc_aws && \
    apk del .build-deps && \
    rm -rf /var/cache/apk/* && \
    rm -rf /root/.cache

COPY thumbor.conf.tpl /usr/local/etc/thumbor.conf.tpl
COPY docker-entrypoint.sh /docker-entrypoint.sh

WORKDIR /usr/local/thumbor

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["thumbor"]

EXPOSE 8888
