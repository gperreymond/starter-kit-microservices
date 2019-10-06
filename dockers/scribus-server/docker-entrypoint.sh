#!/bin/sh

if [ "$1" = 'scribus' ]; then
  nameko run server
fi

exec "$@"
