FROM library/ubuntu:18.04

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>


RUN apt update && \
    apt install -y iputils-ping apt-utils software-properties-common xvfb curl apt-transport-https

RUN add-apt-repository ppa:scribus/ppa

RUN apt update && \
    apt install -y scribus-ng

RUN apt autoremove

RUN python --version && \
    apt install -y python-pip && \
    pip install nameko

COPY server.py /usr/local/scribus/server.py
ADD scripts /usr/local/scribus/scripts
ADD templates /usr/local/scribus/templates
COPY docker-entrypoint.sh /docker-entrypoint.sh

WORKDIR /usr/local/scribus

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["scribus"]

EXPOSE 8888
