# server.py
# https://www.nameko.io/

import json
from nameko.web.handlers import http

class HttpService:
    name = "http_service"

    @http('GET', '/hc')
    def get_method(self, request):
        return 200, json.dumps({'alive': True})

    @http('POST', '/scribus')
    def get_method(self, request):
        return 200, json.dumps({'alive': True})
