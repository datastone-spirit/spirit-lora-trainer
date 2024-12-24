# coding:utf-8
# Copyright 2011 litl, LLC. All Rights Reserved.

import http.client as httplib
import urllib.parse as urlparse
from urllib.parse import urlencode
import re
import urllib
from flask import request, Response, url_for
from werkzeug.datastructures import Headers
from werkzeug.exceptions import NotFound

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

HTML_REGEX = re.compile(r'((?:src|action|href)=["\'])/')
JQUERY_REGEX = re.compile(r'(\$\.(?:get|post)\(["\'])/')
JS_LOCATION_REGEX = re.compile(r'((?:window|document)\.location.*=.*["\'])/')
CSS_REGEX = re.compile(r'(url\(["\']?)/')

REGEXES = [HTML_REGEX, JQUERY_REGEX, JS_LOCATION_REGEX, CSS_REGEX]

def iterform(multidict):
    for key in multidict.keys():
        for value in multidict.getlist(key):
            yield (key.encode("utf8"), value.encode("utf8"))

def proxy_tb(tb_host: str, tb_port: int):
    # Remove /tensorboard prefix if present
    path = request.path.replace('/tensorboard', '', 1) or '/'
    
    # Add query string if present
    if request.query_string:
        path = f"{path}?{request.query_string.decode('utf-8')}"

    # Setup headers
    request_headers = {}
    for h in ["Cookie", "Referer", "X-Csrf-Token", "Content-Type", "X-XSRF-Protected"]:
        if h in request.headers:
            request_headers[h] = request.headers[h]

    # Handle POST data
    if request.method == "POST":
        if request.headers.get('Content-Type', '').startswith('multipart/form-data'):
            form_data = request.get_data()
            request_headers["Content-Length"] = str(len(form_data))
        else:
            form_data = list(iterform(request.form))
            form_data = urlencode(form_data)
            request_headers["Content-Length"] = str(len(form_data))
    else:
        form_data = None

    # Make upstream request
    conn = httplib.HTTPConnection(tb_host, port=tb_port)
    try:
        conn.request(request.method, path, body=form_data, headers=request_headers)
        resp = conn.getresponse()
    except Exception as e:
        logger.error(f"Proxy error url {path}:", exc_info=e)
        return Response(str(e), status=500)

    # Process response headers
    response_headers = {}
    for key, value in resp.getheaders():
        if key.lower() in ["content-length", "connection"]:
            continue
        if key.lower() == "set-cookie":
            cookies = value.split(",")
            response_headers[key] = cookies
        else:
            response_headers[key] = value

    # Handle redirects
    if resp.status in [301, 302] and "location" in response_headers:
        redirect = response_headers["location"]
        parsed = urlparse.urlparse(request.url)
        redirect_parsed = urlparse.urlparse(redirect)
        
        redirect_host = redirect_parsed.netloc or f"{tb_host}:{tb_port}"
        redirect_path = redirect_parsed.path
        if redirect_parsed.query:
            redirect_path += "?" + redirect_parsed.query

        url = f"{parsed.scheme}://{parsed.netloc}/tensorboard{redirect_path}"
        response_headers["location"] = url

    # Process response content
    content = resp.read()
    if resp.getheader('content-type', '').startswith('text/html'):
        content = content.decode('utf-8')
        base_url = f"/tensorboard"
        for regex in REGEXES:
            content = regex.sub(r'\1' + base_url, content)
        content = content.encode('utf-8')

    return Response(
        response=content,
        status=resp.status,
        headers=response_headers,
        content_type=resp.getheader('content-type')
    )