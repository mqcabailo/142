from os import curdir
import SimpleHTTPServer
import SocketServer
import logging
import cgi

PORT = 8000
logging.basicConfig(level=logging.DEBUG)
class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    store_path = curdir + 'score.json'
    print store_path

    def do_GET(self):
        logging.error(self.headers)
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        length = self.headers['content-length']
        data = self.rfile.read(int(length))
        logging.debug(data)

        with open('score.json', 'w+') as fh:
            fh.write(data.decode())

        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)


Handler = ServerHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()